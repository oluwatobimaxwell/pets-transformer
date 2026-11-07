"""Brings original values to the same level of detail as the release, so answers are compared like for like.

If the release turned birth dates into age bands, the original birth dates are turned into the same bands first.
The level is found by trying the engine's own settings and keeping the one whose values match the release best.
"""
from __future__ import annotations

import pandas as pd

from pets_eval import parse

from ..transform.pets import OTHER
from ..tune.levels import apply_level

GOOD_MATCH = 0.98
CACHE_LIMIT = 256
CANDIDATES = (("exact", "CATEGORY"), ("age_5", "BIRTH_DATE"), ("age_10", "BIRTH_DATE"), ("age_20", "BIRTH_DATE"), ("age_5", "AGE"),
              ("age_10", "AGE"), ("age_20", "AGE"), ("postcode_3", "POSTCODE"), ("postcode_2", "POSTCODE"), ("minute", "TIMESTAMP"),
              ("hour_stamp", "TIMESTAMP"), ("day", "TIMESTAMP"), ("week", "TIMESTAMP"), ("month", "TIMESTAMP"), ("year", "TIMESTAMP"),
              ("hour_of_day", "TIMESTAMP"))
_CACHE: dict = {}


def _values(series: pd.Series) -> pd.Series:
    text = series.astype(str).str.strip()
    return text[(text != "") & (text != "nan")]


def align_original(original: pd.Series, released: pd.Series) -> pd.Series:
    target = set(_values(released))
    slot = (id(original), len(original), hash(frozenset(target)))
    cached = _CACHE.get(slot)
    if cached is not None and cached[0] is original:  # the stored series keeps its id from being reused by another object
        return cached[1]
    best, best_share = original.astype(str), -1.0
    for level, subtype in CANDIDATES:
        try:
            mapped = apply_level(original, level, subtype).astype(str)
        except (ValueError, TypeError):
            continue
        present = _values(mapped)
        share = float(present.isin(target).mean()) if len(present) else 0.0
        if share > best_share:
            best, best_share = mapped, share
        if share >= GOOD_MATCH:
            break
    if OTHER in target:
        best = best.where(best.isin(target) | (best.str.strip() == ""), OTHER)
    if len(_CACHE) >= CACHE_LIMIT:
        _CACHE.clear()
    _CACHE[slot] = (original, best)
    return best


def released_column(released: pd.DataFrame, original: pd.Series, column: str):
    """The release may rename a column: birth dates become `age`."""
    if column in released.columns:
        return column
    if "age" in released.columns and parse.age_from_birth(original).notna().mean() > 0.8:
        return "age"
    return None
