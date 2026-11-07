"""Select's answer for one column: the technique, its settings and the reason."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field


@dataclass
class PetChoice:
    table: str
    column: str
    pet: str
    why: str
    params: dict = field(default_factory=dict)
    output_column: str = ""
    needed_by: list = field(default_factory=list)
    tunable: bool = False

    @property
    def key(self) -> str:
        return f"{self.table}.{self.column}"

    def to_dict(self) -> dict:
        return asdict(self)
