"""Runs the challenge scorecard on the release and turns it into gate checks."""
from __future__ import annotations

from pathlib import Path

from pets_eval.scorecard import run_scorecard

from ..domain.check import BLOCK, INFO, REVIEW, Check
from ..domain.scenario import Scenario
from ..utils.policy import policy

LINKAGE, RETAINED, HASHED, TEXT = "linkage re-identification", "direct identifiers retained", "hashed ids reversible", "free-text identifier leakage"


def _risks_named(report: dict, phrase: str) -> dict:
    return {name: value for name, value in report["risk_components"].items() if phrase in name}


def _worst(risks: dict) -> tuple:
    if not risks:
        return 0.0, "not applicable"
    name = max(risks, key=risks.get)
    return risks[name], f"{name}: {risks[name]:.3f}"


def _threshold_check(title: str, report: dict, phrase: str, limit: float) -> Check:
    worst, detail = _worst(_risks_named(report, phrase))
    return Check(title, worst <= limit, BLOCK, f"Worst {detail} (limit {limit})")


def task_checks(report: dict, scenario: Scenario) -> list:
    floor = policy()["gate"]["min_task_score"]
    checks = []
    for task in report["utility"]:
        if task["id"] not in scenario.task_ids:
            continue
        score = task.get("score")
        answered = score is not None and score >= floor
        detail = "not answerable" if score is None else f"{score:.2f}"
        checks.append(Check(f"Task {task['id']} still works", answered, REVIEW, f"{task.get('description', '')}: {detail}"))
    return checks


def scorecard_checks(config, release_dir: Path, rowmaps: dict, evidence_dir: Path) -> tuple:
    report = run_scorecard(config.data_dir, release_dir, scenario=config.scenario.id, root=config.package_root, rowmaps=rowmaps, out_dir=evidence_dir)
    gate = policy()["gate"]
    text_limit = round(1 - config.scenario.text_recall_required, 3)
    checks = [
        _threshold_check("Identifiers removed", report, RETAINED, gate["max_retained_identifiers"]),
        _threshold_check("Hashes can't be reversed", report, HASHED, 0.0),
        _threshold_check("Public attacks fail", report, LINKAGE, gate["max_reidentification"]),
        _threshold_check("Text leakage within limit", report, TEXT, text_limit),
        Check("Self-assessment scores", True, INFO, f"privacy {report['summary']['privacy']:.2f}, utility {report['summary']['utility']:.2f}, composite {report['summary']['composite']:.2f}"),
    ]
    return checks + task_checks(report, config.scenario), report
