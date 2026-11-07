"""The outcome of a whole run."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class RunResult:
    status: str
    out_dir: Path
    verdicts: list = field(default_factory=list)
    summary: dict = field(default_factory=dict)

    @property
    def exit_code(self) -> int:
        return {"release": 0, "review": 2, "block": 3}[self.status]
