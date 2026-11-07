"""What Tune settled on, and what it tried on the way."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field


@dataclass
class TuneResult:
    levels: dict
    below_k: float
    utility: float
    tried: int
    scored: list = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)
