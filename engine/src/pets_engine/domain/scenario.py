"""A sharing scenario: who receives the data, why, and what they must still be able to answer."""
from __future__ import annotations

import re
from dataclasses import dataclass, field

_K_BAR = re.compile(r"k\s*(?:>=|≥)\s*(\d+)", re.I)
_RECALL_BAR = re.compile(r"recall\s*(?:>=|≥)\s*(0?\.\d+)", re.I)
_EPSILON_BAR = re.compile(r"(?:ε|epsilon)\s*(?:<=|≤|=)\s*(\d+(?:\.\d+)?)", re.I)


@dataclass(frozen=True)
class Scenario:
    id: str
    dataset: str
    trust_level: str
    recipient: str = ""
    purpose: str = ""
    targets: str = ""
    task_ids: tuple = field(default_factory=tuple)
    questions: tuple = field(default_factory=tuple)
    k: int | None = None
    text_recall: float | None = None
    epsilon: float | None = None
    workload: str = ""  # a question list for a public release, in the challenge toolkit's format

    @classmethod
    def from_dict(cls, raw: dict) -> "Scenario":
        return cls(id=raw["id"], dataset=raw["dataset"], trust_level=raw["trust_level"], recipient=raw.get("recipient", ""),
                   purpose=raw.get("purpose", ""), targets=raw.get("suggested_privacy_targets", ""),
                   task_ids=tuple(raw.get("utility_requirements", [])))

    @property
    def is_public(self) -> bool:
        return self.trust_level == "public"

    @property
    def has_tasks(self) -> bool:
        return bool(self.task_ids or self.questions)

    @property
    def k_required(self) -> int:
        """The look-alike bar: set directly, or stated in the targets text. 0 means none."""
        if self.k is not None:
            return self.k
        found = _K_BAR.search(self.targets)
        return int(found.group(1)) if found else 0

    @property
    def text_recall_required(self) -> float:
        if self.text_recall is not None:
            return self.text_recall
        found = _RECALL_BAR.search(self.targets)
        return float(found.group(1)) if found else 0.95

    @property
    def epsilon_limit(self) -> float | None:
        """The privacy budget for a public release: set directly, or stated in the targets text. None means the policy default."""
        if self.epsilon is not None:
            return float(self.epsilon)
        found = _EPSILON_BAR.search(self.targets)
        return float(found.group(1)) if found else None
