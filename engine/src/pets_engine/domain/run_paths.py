"""Where a run writes. Only `release` is ever meant to leave the machine."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class RunPaths:
    root: Path

    @property
    def staged(self) -> Path:
        return self.root / "staged"

    @property
    def release(self) -> Path:
        return self.root / "release"

    @property
    def private(self) -> Path:
        return self.root / "private"

    @property
    def evidence(self) -> Path:
        return self.root / "evidence"

    @property
    def plan(self) -> Path:
        """The plan while the gate works, for a live view. Outside release and evidence, so it is never shared."""
        return self.root / "plan.json"

    def create(self) -> None:
        for folder in (self.staged, self.private, self.evidence):
            folder.mkdir(parents=True, exist_ok=True)
