"""The gate's decision for one attempt."""
from __future__ import annotations

from dataclasses import dataclass, field

from .check import BLOCK, REVIEW, Check

RELEASE_STATUS, REVIEW_STATUS, BLOCK_STATUS = "release", "review", "block"


@dataclass
class Verdict:
    attempt: int
    checks: list = field(default_factory=list)

    @property
    def status(self) -> str:
        failed = [c for c in self.checks if not c.passed]
        if any(c.severity == BLOCK for c in failed):
            return BLOCK_STATUS
        if any(c.severity == REVIEW for c in failed):
            return REVIEW_STATUS
        return RELEASE_STATUS

    @property
    def failures(self) -> list:
        return [c for c in self.checks if not c.passed and c.severity in (BLOCK, REVIEW)]

    def has_failed(self, name: str) -> bool:
        return any(c.name == name and not c.passed for c in self.checks)

    def to_dict(self) -> dict:
        return {"attempt": self.attempt, "status": self.status, "checks": [c.to_dict() for c in self.checks]}


__all__ = ["Verdict", "Check", "RELEASE_STATUS", "REVIEW_STATUS", "BLOCK_STATUS"]
