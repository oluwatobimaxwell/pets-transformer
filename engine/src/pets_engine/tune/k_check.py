"""The fast look-alike check. It counts every kept clue column, including derived ones such as age."""
from __future__ import annotations

import pandas as pd


def group_sizes(frame: pd.DataFrame, columns: list) -> pd.Series:
    keys = frame[columns].astype(str)
    return keys.groupby(columns, sort=False)[columns[0]].transform("size")


def share_below_k(frame: pd.DataFrame, columns: list, k: int) -> float:
    if not columns or frame.empty:
        return 0.0
    return float((group_sizes(frame, columns) < k).mean())
