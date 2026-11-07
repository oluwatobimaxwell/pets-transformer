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

    def create(self) -> None:
        for folder in (self.staged, self.private, self.evidence):
            folder.mkdir(parents=True, exist_ok=True)
