"""Finding the challenge package and its scenarios."""
from __future__ import annotations

import os
from pathlib import Path

from pets_eval import io

from ..domain.scenario import Scenario


def package_root(explicit: str | None = None, start: Path | None = None) -> Path | None:
    if explicit:
        return Path(explicit).resolve()
    if os.environ.get("PETS_ROOT"):
        return Path(os.environ["PETS_ROOT"]).resolve()
    return io.find_package_root(start)


def load_scenario(scenario_id: str, root: Path) -> Scenario:
    for raw in io.load_scenarios(root):
        if raw["id"] == scenario_id:
            return Scenario.from_dict(raw)
    raise ValueError(f"Unknown scenario {scenario_id}. Run `pets-engine scenarios` to list them.")


def custom_scenario(dataset: str, trust_level: str) -> Scenario:
    """For data outside the package: no required tasks, so only the trust level drives Select."""
    return Scenario(id=f"CUSTOM-{trust_level}", dataset=dataset, trust_level=trust_level)
