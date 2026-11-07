"""A sharing scenario: who receives the data, why, and what they must still be able to answer."""
from __future__ import annotations

import re
from dataclasses import dataclass, field

_K_BAR = re.compile(r"k\s*(?:>=|≥)\s*(\d+)", re.I)
_RECALL_BAR = re.compile(r"recall\s*(?:>=|≥)\s*(0?\.\d+)", re.I)


@dataclass(frozen=True)
class Scenario:
    id: str
    dataset: str
    trust_level: str
    recipient: str = ""
    purpose: str = ""
    targets: str = ""
    task_ids: tuple = field(default_factory=tuple)

    @classmethod
    def from_dict(cls, raw: dict) -> "Scenario":
        return cls(id=raw["id"], dataset=raw["dataset"], trust_level=raw["trust_level"], recipient=raw.get("recipient", ""),
                   purpose=raw.get("purpose", ""), targets=raw.get("suggested_privacy_targets", ""),
                   task_ids=tuple(raw.get("utility_requirements", [])))

    @property
    def is_public(self) -> bool:
        return self.trust_level == "public"

    @property
    def k_required(self) -> int:
        """The look-alike bar the scenario states; 0 means it states none."""
        found = _K_BAR.search(self.targets)
        return int(found.group(1)) if found else 0

    @property
    def text_recall_required(self) -> float:
        found = _RECALL_BAR.search(self.targets)
        return float(found.group(1)) if found else 0.95
