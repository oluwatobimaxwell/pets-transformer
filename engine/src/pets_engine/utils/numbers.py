"""Reads numbers written the Finnish way too, such as "3 987,96"."""
from __future__ import annotations

import pandas as pd


def to_number(series: pd.Series) -> pd.Series:
    cleaned = series.astype(str).str.replace(r"\s", "", regex=True).str.replace(",", ".", regex=False)
    return pd.to_numeric(cleaned, errors="coerce")


def whole_numbers(frame: pd.DataFrame) -> pd.DataFrame:
    """Writes 398 instead of 398.0: float columns whose values are all whole numbers become integers, blanks kept."""
    out = frame.copy()
    for column in out.columns:
        if pd.api.types.is_float_dtype(out[column]):
            present = out[column].dropna()
            if len(present) and bool((present == present.round()).all()):
                out[column] = out[column].round().astype("Int64")
    return out
