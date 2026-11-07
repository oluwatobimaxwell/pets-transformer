"""Health details in non-clinical text, which CS-S1 asks to remove."""
from __future__ import annotations

import re

from .span import Span

HEALTH = re.compile(
    r"\b(?:kuulolaite\w*|kuulovamm\w*|näkövamm\w*|sairaala\w*|syöpä\w*|syöv\w*|diabet\w*|masennu\w*|muistisairau\w*|muistisairas|dementia\w*|alzheimer\w*|"
    r"pyörätuoli\w*|rollaattori\w*|dialyysi\w*|leikkau\w*|sydän\w*|sydäm\w*|aivoinfarkti\w*|mielenterveys\w*|raskaus\w*|raskaana|lääkity\w*|"
    r"hearing aid\w*|wheelchair|cancer|diabetes|dementia|depression|chemotherapy|surgery|hospital\w*|pregnan\w*|stroke|dialysis|heart condition|"
    r"hörapparat\w*|rullstol\w*|cancer|sjukhus\w*|diabetes|demens|depression|gravid\w*|operation\w*)\b", re.I)


def health_spans(text: str) -> list:
    return [Span(m.start(), m.end(), "HEALTH", "health terms") for m in HEALTH.finditer(text)]
