"""How far a column's distribution moved between original and release, plus the small helpers that measure it."""
from __future__ import annotations

import numpy as np
import pandas as pd

from pets_eval.parse import tvd

from .alignment import align_original
from .numbers import to_number

NUMERIC_BINS = 10


def combined_key(parts: list) -> pd.Series:
    """One label per row from several grouping columns."""
    return pd.concat(parts, axis=1).astype(str).agg(" | ".join, axis=1) if len(parts) > 1 else parts[0]


def in_bins(series: pd.Series, edges: np.ndarray) -> pd.Series:
    return pd.cut(series, edges, include_lowest=True).astype(str)


def distribution_shift(before: pd.Series, after: pd.Series) -> float:
    """Numbers are compared in the original's deciles; categories at the release's level of detail."""
    numbers_before, numbers_after = to_number(before), to_number(after)
    if numbers_before.notna().mean() > 0.9 and numbers_before.nunique() > NUMERIC_BINS * 2:
        edges = np.unique(np.nanquantile(numbers_before, np.linspace(0, 1, NUMERIC_BINS + 1)))
        return tvd(in_bins(numbers_before, edges).value_counts(), in_bins(numbers_after, edges).value_counts())
    return tvd(align_original(before, after).value_counts(), after.astype(str).value_counts())
