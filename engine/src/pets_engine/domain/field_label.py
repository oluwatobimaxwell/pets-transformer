"""Detect's answer for one column."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field


@dataclass
class FieldLabel:
    table: str
    column: str
    role: str
    subtype: str
    confidence: float
    source: str
    reasons: list = field(default_factory=list)
    needs_review: bool = False
    best_guess_role: str = ""
    best_guess_subtype: str = ""

    @property
    def key(self) -> str:
        return f"{self.table}.{self.column}"

    def to_dict(self) -> dict:
        return asdict(self)
