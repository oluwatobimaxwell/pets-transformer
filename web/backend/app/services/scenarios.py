"""Challenge scenarios, and turning a person's written scenario into the engine's scenario file."""

from pathlib import Path

import yaml
from fastapi import HTTPException

from pets_eval import io
from pets_engine.domain.scenario import Scenario
from pets_engine.utils.package import load_scenario
from pets_engine.utils.scenario_file import load_scenario_file

from app.config import settings
from app.schemas.custom_scenario_in import CustomScenarioIn

SCENARIO_FILE = "scenario.yaml"


def challenge_scenarios(dataset: str | None) -> list:
    root = settings.package_root
    if not (root / "metadata" / "scenarios.json").exists():
        return []
    listed = []
    for raw in io.load_scenarios(root):
        scenario = Scenario.from_dict(raw)
        if not dataset or scenario.dataset == dataset:
            listed.append({"id": scenario.id, "dataset": scenario.dataset, "title": raw["title"], "recipient": scenario.recipient,
                           "purpose": scenario.purpose, "trust_level": scenario.trust_level, "k": scenario.k_required, "task_ids": list(scenario.task_ids)})
    return listed


def challenge_scenario(scenario_id: str, dataset_name: str, source: str) -> Scenario:
    try:
        scenario = load_scenario(scenario_id, settings.package_root)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    if source != "sample" or scenario.dataset != dataset_name:
        raise HTTPException(status_code=400, detail=f"{scenario_id} is written for the {scenario.dataset} sample. For other data, describe your own recipient.")
    return scenario


def _question(question) -> dict:
    entry = {"ask": question.ask, question.kind: question.columns if question.kind == "correlation" else (question.columns[0] if question.columns else True)}
    if question.by:
        entry["by"] = question.by
    return entry


def custom_scenario(custom: CustomScenarioIn, dataset_name: str, run_dir: Path) -> Scenario:
    """Written to the run folder first, so the scenario a person chose is part of the run's record."""
    spec = {"id": f"CUSTOM-{run_dir.name}", "recipient": custom.recipient, "purpose": custom.purpose, "trust_level": custom.trust_level,
            "questions": [_question(q) for q in custom.questions]}
    if custom.k:
        spec["k"] = custom.k
    path = run_dir / SCENARIO_FILE
    path.write_text(yaml.safe_dump(spec, allow_unicode=True, sort_keys=False), encoding="utf-8")
    try:
        return load_scenario_file(path, dataset_name)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
