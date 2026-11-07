"""The question list a public release answers: from the scenario, or the one the challenge package ships for the dataset."""
from __future__ import annotations

import importlib
import json
from pathlib import Path

import pandas as pd

from ..domain.scenario import Scenario

PACKAGE_WORKLOAD = "dp_query_workload_{dataset}.json"
TRUSTED_FIELD_MODULES = "pets_eval.utility."


def workload_path(scenario: Scenario, package_root: Path | None) -> Path | None:
    if scenario.workload:
        return Path(scenario.workload)
    if package_root:
        found = Path(package_root) / "metadata" / PACKAGE_WORKLOAD.format(dataset=scenario.dataset)
        return found if found.exists() else None
    return None


def public_output(scenario: Scenario, package_root: Path | None) -> str | None:
    """What a public recipient gets: noisy answers when there is a question list, otherwise nothing. None for other recipients."""
    if not scenario.is_public:
        return None
    return "answers" if workload_path(scenario, package_root) else "blocked"


def load_workload(path: Path) -> dict:
    workload = json.loads(Path(path).read_text(encoding="utf-8"))
    if not workload.get("table") or not workload.get("queries"):
        raise ValueError(f"{path} needs `table` and `queries`, as in the challenge toolkit's DP workload files.")
    return workload


def analysis_fields(workload: dict, frame: pd.DataFrame) -> pd.DataFrame:
    """The fields the questions filter on. A package workload names the toolkit module that derives them, such as week or
    age band; only toolkit modules are trusted with that. Any other workload filters on the table's own columns."""
    module_name = workload.get("evaluate_with", "").split("(")[0].rpartition(".")[0]
    if module_name.startswith(TRUSTED_FIELD_MODULES):
        derive = getattr(importlib.import_module(module_name), "derive", None)
        if derive:
            return derive(frame)
    return frame
