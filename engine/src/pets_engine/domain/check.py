"""One Verify check and its result."""
from __future__ import annotations

from dataclasses import asdict, dataclass

BLOCK, REVIEW, INFO = "block", "review", "info"


@dataclass(frozen=True)
class Check:
    name: str
    passed: bool
    severity: str
    detail: str

    def to_dict(self) -> dict:
        return asdict(self)
