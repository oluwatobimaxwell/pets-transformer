"""What one run was asked to do."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from .scenario import Scenario


@dataclass(frozen=True)
class RunConfig:
    data_dir: Path
    out_dir: Path
    scenario: Scenario
    package_root: Path | None = None
    review_file: Path | None = None
    keep: tuple = field(default_factory=tuple)

    @property
    def dataset(self) -> str:
        return self.scenario.dataset
