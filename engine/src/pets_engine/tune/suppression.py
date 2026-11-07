"""Removes rows that still stand out, and removes their linked rows from other tables too."""
from __future__ import annotations

import pandas as pd

from .k_check import group_sizes


def rows_to_keep(frame: pd.DataFrame, columns: list, k: int) -> pd.Series:
    if not columns or not k:
        return pd.Series(True, index=frame.index)
    return group_sizes(frame, columns) >= k


def linked_keep_masks(originals: dict, primary: str, key_column: str, keep: pd.Series) -> dict:
    """Keep masks for every table sharing the primary table's key."""
    kept_keys = set(originals[primary].loc[keep, key_column].astype(str))
    masks = {primary: keep}
    for table, frame in originals.items():
        if table != primary and key_column in frame.columns:
            masks[table] = frame[key_column].astype(str).isin(kept_keys)
    return masks
