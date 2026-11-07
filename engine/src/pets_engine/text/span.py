"""One piece of personal data found in a text."""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Span:
    start: int
    end: int
    label: str
    layer: str = ""
