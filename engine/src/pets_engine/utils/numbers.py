"""Reads numbers written the Finnish way too, such as "3 987,96"."""
from __future__ import annotations

import pandas as pd


def to_number(series: pd.Series) -> pd.Series:
    cleaned = series.astype(str).str.replace(r"\s", "", regex=True).str.replace(",", ".", regex=False)
    return pd.to_numeric(cleaned, errors="coerce")
