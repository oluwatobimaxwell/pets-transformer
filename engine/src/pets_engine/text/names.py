"""Finds known names in text, including Finnish case endings such as Virtaselle or Pirkon."""
from __future__ import annotations

import re
from collections import Counter
from functools import lru_cache

from .span import Span

_WORD = re.compile(r"[^\W\d_]+(?:[-'][^\W\d_]+)*")
_SUFFIXES = ("n", "a", "ä", "lle", "lta", "ltä", "lla", "llä", "sta", "stä", "ssa", "ssä", "ksi", "na", "nä", "kin", "kaan", "s", "'s", "lta", "ta", "tä", "in")
_NEN_SUFFIXES = ("en", "ta", "tä", "elle", "elta", "eltä", "ella", "ellä", "esta", "estä", "essa", "essä", "eksi", "ena", "enä", "et")
_GRADATION = (("kk", "k"), ("pp", "p"), ("tt", "t"), ("nt", "nn"), ("lt", "ll"), ("rt", "rr"), ("mp", "mm"), ("nk", "ng"), ("ht", "hd"))
MIN_LENGTH = 3
COMMON_WORD_SHARE = 0.0006


def name_forms(name: str) -> set:
    base = name.casefold()
    forms = {base, base + "'n"}
    if len(base) < MIN_LENGTH:
        return set()
    forms |= {base + suffix for suffix in _SUFFIXES}
    if base.endswith("nen"):
        stem = base[:-3] + "s"
        forms |= {stem + suffix for suffix in _NEN_SUFFIXES}
    for strong, weak in _GRADATION:
        if strong in base[-4:]:
            cut = base[:-1] if base[-1] in "aeiouyäö" else base
            at = cut.rfind(strong)
            if at >= 0:
                softened = cut[:at] + weak + cut[at + len(strong):] + base[-1]
                forms |= {softened + suffix for suffix in ("n", "lle", "lta", "ltä", "lla", "llä", "sta", "stä", "ssa", "ssä", "ksi")}
    return forms


def name_tokens(value: str, shortest: int = MIN_LENGTH) -> list:
    return [word for word in _WORD.findall(str(value)) if len(word) >= shortest]


class NameBook:
    """All names the data owner already holds in structured columns, minus words that are also everyday language."""

    def __init__(self, names):
        self.forms: set = set()
        for name in names:
            self.forms |= name_forms(name)
        self.common: set = set()

    def learn_common_words(self, texts) -> None:
        """A word used in lowercase far more often than a name would be is ordinary language (toivon, lunta)."""
        lower, total = Counter(), 0
        for text in texts:
            words = {w for w in _WORD.findall(text) if w.islower()}
            lower.update(words)
            total += 1
        floor = max(total * COMMON_WORD_SHARE, 5)
        self.common = {word for word, count in lower.items() if count >= floor}

    def spans(self, text: str) -> list:
        found = []
        for match in _WORD.finditer(text):
            word = match.group()
            folded = word.casefold()
            if folded not in self.forms:
                continue
            if word.islower() and folded in self.common:
                continue
            if word[0].isupper() and word.casefold() in self.common and match.start() == 0:
                continue
            found.append(Span(match.start(), match.end(), "PERSON", "name book"))
        return found


@lru_cache(maxsize=100000)
def _cached_forms(name: str) -> frozenset:
    return frozenset(name_forms(name)) if len(name) >= MIN_LENGTH else frozenset({name})


def _is_bounded(text: str, start: int, end: int) -> bool:
    before = text[start - 1] if start else " "
    after = text[end] if end < len(text) else " "
    return not (before.isalnum() or after.isalnum())


def own_value_spans(text: str, values: list) -> list:
    """Values from this person's own record: name parts by whole word, other values wherever they appear intact."""
    folded = text.casefold()
    names = [value for value, label in values if label == "PERSON"]
    forms = frozenset().union(*(_cached_forms(name) for name in names)) if names else frozenset()
    found = [Span(m.start(), m.end(), "PERSON", "own record") for m in _WORD.finditer(text) if m.group().casefold() in forms]
    for value, label in values:
        if label == "PERSON":
            continue
        start = folded.find(value)
        while start >= 0:
            if _is_bounded(folded, start, start + len(value)):
                found.append(Span(start, start + len(value), label, "own record"))
            start = folded.find(value, start + len(value))
    return found
