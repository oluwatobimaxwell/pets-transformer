"""Years from dates written the ISO, Finnish or short way: 2025-01-31, 31.1.2025 or 31/01/25."""
from __future__ import annotations

import re
from datetime import date

import pandas as pd

_ISO = re.compile(r"^(\d{4})-\d{1,2}-\d{1,2}")
_DAY_FIRST = re.compile(r"^\d{1,2}[./]\d{1,2}[./](\d{4}|\d{2})\b")
PERCENTILES = (0.05, 0.5, 0.95)


def year_of(value: str) -> float:
    found = _ISO.match(value) or _DAY_FIRST.match(value)
    if not found:
        return float("nan")
    year = int(found.group(1))
    if year < 100:  # two digits: the latest century that doesn't put the date in the future
        year += 2000 if 2000 + year <= date.today().year else 1900
    return float(year)


def year_percentiles(values: pd.Series) -> tuple:
    """5th, 50th and 95th percentile of the years, or zeros when no value reads as a date."""
    found = values.astype(str).str.strip().map(year_of).dropna()
    return tuple(int(found.quantile(q)) for q in PERCENTILES) if len(found) else (0, 0, 0)
