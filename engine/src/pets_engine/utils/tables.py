"""Reading tables as text, because IDs, phones and postcodes break when parsed as numbers."""
from __future__ import annotations

from pathlib import Path

import pandas as pd

_PRIVATE_PREFIXES = ("rowmap_", "_")


def table_files(folder: Path) -> list:
    return [f for f in sorted(Path(folder).glob("*.csv")) if not f.stem.startswith(_PRIVATE_PREFIXES)]


def read_text_table(path: Path, rows: int | None = None) -> pd.DataFrame:
    return pd.read_csv(path, dtype=str, keep_default_na=False, nrows=rows)


def read_text_tables(folder: Path, rows: int | None = None) -> dict:
    return {f.stem: read_text_table(f, rows) for f in table_files(folder)}


def non_blank(series: pd.Series) -> pd.Series:
    text = series.astype(str).str.strip()
    return text[text != ""]
