"""The gate's plan while it works: which columns leave and with which technique, written as soon as Select decides.

A live view reads it to show the work in progress. The manifest, written when the gate decides, is the final word.
"""
from __future__ import annotations

import json
from pathlib import Path


def write_plan(target: Path, plan: list, labels: list) -> None:
    labels_by_key = {label.key: label for label in labels}
    fields = [{"field": choice.key, "role": getattr(labels_by_key.get(choice.key), "role", ""), "pet": choice.pet, "output_column": choice.output_column}
              for choice in plan]
    staging = target.with_suffix(".tmp")
    staging.write_text(json.dumps({"fields": fields}, ensure_ascii=False), encoding="utf-8")
    staging.replace(target)  # a reader never sees half a file
