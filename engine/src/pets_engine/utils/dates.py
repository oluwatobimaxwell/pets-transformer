"""Years from dates written the ISO, Finnish or short way: 2025-01-31, 31.1.2025 or 31/01/25."""
from __future__ import annotations

import re
from datetime import date

import pandas as pd

from pets_eval import parse

_ISO = re.compile(r"^(\d{4})-\d{1,2}-\d{1,2}")
_DAY_FIRST = re.compile(r"^\d{1,2}[./]\d{1,2}[./](\d{4}|\d{2})\b")
PERCENTILES = (0.05, 0.5, 0.95)
TIME_SUBTYPES = ("TIMESTAMP", "DATE")  # the column types that say when something happened
AGE_REFERENCE = "2025-12-31"  # the toolkit's reference day for ages
UNREADABLE = (ValueError, OverflowError, TypeError)  # pandas' date errors, such as an out-of-range year, are ValueErrors


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


def to_moments(values: pd.Series) -> pd.Series:
    """Dates and times from a column Detect called a time. The toolkit reads them first, so results match its scoring; when it
    can't, such as a school year written 2022-23 or a date before year 1677, each unreadable value becomes missing instead of
    stopping the run."""
    try:
        return parse.to_datetime(values)
    except UNREADABLE:
        return pd.to_datetime(values.astype("string"), errors="coerce", format="mixed")


def ages_from_birth(values: pd.Series) -> pd.Series:
    """Age in years on the toolkit's reference day, with the same fallback for birth dates it can't read."""
    try:
        return parse.age_from_birth(values)
    except UNREADABLE:
        return (pd.Timestamp(AGE_REFERENCE) - to_moments(values)).dt.days / 365.25
