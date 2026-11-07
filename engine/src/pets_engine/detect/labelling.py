"""Runs Detect over a set of tables and applies any decisions a person made."""
from __future__ import annotations

import json
from pathlib import Path

from ..domain.field_label import FieldLabel
from .detector import ColumnDetector
from .hash_reversal import reverse_hashes
from .profiler import profile_column


def label_tables(tables: dict, detector: ColumnDetector) -> list:
    profiles = [profile_column(table, column, frame[column]) for table, frame in tables.items() for column in frame.columns]
    return reverse_hashes(tables, detector.label(profiles))


def apply_review(labels: list, review_file: Path | None) -> list:
    """A review file maps `table.column` to {"role": ..., "subtype": ...}. A person's decision always wins."""
    if review_file is None:
        return labels
    decisions = json.loads(Path(review_file).read_text(encoding="utf-8"))
    reviewed = []
    for label in labels:
        decision = decisions.get(label.key)
        if decision:
            reviewed.append(FieldLabel(label.table, label.column, decision["role"], decision.get("subtype", label.subtype), 1.0, "person",
                                       [decision.get("reason", "decided by a person")]))
        else:
            reviewed.append(label)
    return reviewed
