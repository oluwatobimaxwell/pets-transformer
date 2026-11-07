"""Spots record keys that leak time because they count upward in arrival order."""
from __future__ import annotations

import pandas as pd

from ..utils.dates import TIME_SUBTYPES, to_moments

MIN_CORRELATION = 0.98


def time_ordered_keys(tables: dict, labels: list) -> set:
    found = set()
    for table, frame in tables.items():
        here = [label for label in labels if label.table == table]
        keys = [label for label in here if label.role in ("record_key", "technical_identifier") and label.column in frame.columns]
        times = [label for label in here if label.subtype in TIME_SUBTYPES and label.column in frame.columns]
        for key in keys:
            digits = pd.to_numeric(frame[key.column].astype(str).str.extract(r"(\d+)\D*$")[0], errors="coerce")
            if digits.nunique() < 0.9 * max(len(frame), 1):
                continue
            for moment in times:
                stamp = to_moments(frame[moment.column])
                if digits.corr(stamp.rank(), method="spearman") >= MIN_CORRELATION:
                    found.add(key.key)
    leaking_names = {key.split(".", 1)[1] for key in found}
    return found | {label.key for label in labels if label.column in leaking_names}
