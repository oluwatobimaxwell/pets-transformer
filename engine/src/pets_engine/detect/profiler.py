"""Measures a column from its values, with no reliance on its name."""
from __future__ import annotations

import re

import numpy as np
import pandas as pd

from ..domain.column_profile import ColumnProfile
from ..utils.tables import non_blank
from .patterns import PATTERNS

SAMPLE_VALUES = 2000
SEED = 7


def value_shape(value: str) -> str:
    return re.sub(r"[a-zåäö]+", "a", re.sub(r"[A-ZÅÄÖ]+", "A", re.sub(r"\d", "9", value)))


def to_number(series: pd.Series) -> pd.Series:
    cleaned = series.str.replace(r"\s", "", regex=True).str.replace(",", ".", regex=False)
    return pd.to_numeric(cleaned, errors="coerce")


def profile_column(table: str, column: str, values: pd.Series) -> ColumnProfile:
    rows = len(values)
    present = non_blank(values)
    sample = present.sample(min(SAMPLE_VALUES, len(present)), random_state=SEED) if len(present) else present
    distinct = int(present.nunique())
    lengths = sample.str.len()
    shapes = sample.map(value_shape)
    numbers = to_number(sample)
    is_number = numbers.notna()
    finite = numbers[is_number & np.isfinite(numbers)]
    char_total = max(int(lengths.sum()), 1)
    joined = "".join(sample.tolist())
    return ColumnProfile(
        table=table, column=column, rows=rows,
        blank_share=round(1 - len(present) / max(rows, 1), 4),
        distinct=distinct,
        distinct_share=round(distinct / max(len(present), 1), 4),
        mean_length=round(float(lengths.mean()), 2) if len(sample) else 0.0,
        max_length=int(lengths.max()) if len(sample) else 0,
        length_spread=round(float(lengths.std()), 2) if len(sample) > 1 else 0.0,
        mean_tokens=round(float(sample.str.split().str.len().mean()), 2) if len(sample) else 0.0,
        digit_share=round(sum(c.isdigit() for c in joined) / char_total, 4),
        alpha_share=round(sum(c.isalpha() for c in joined) / char_total, 4),
        numeric_share=round(float(is_number.mean()), 4) if len(sample) else 0.0,
        integer_share=round(float((finite % 1 == 0).mean()), 4) if len(finite) else 0.0,
        numeric_min=float(finite.min()) if len(finite) else 0.0,
        numeric_max=float(finite.max()) if len(finite) else 0.0,
        top_value_share=round(float(present.value_counts(normalize=True).iloc[0]), 4) if len(present) else 0.0,
        top_shape_share=round(float(shapes.value_counts(normalize=True).iloc[0]), 4) if len(shapes) else 0.0,
        shape_count=int(shapes.nunique()),
        pattern_shares={name: round(float(sample.map(test).mean()), 4) if len(sample) else 0.0
                        for name, test in PATTERNS.items()},
    )
