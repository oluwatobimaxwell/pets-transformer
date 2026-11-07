"""Reads a scenario a person wrote: who receives the data, why, the look-alike bar, and the questions they must answer."""
from __future__ import annotations

import json
from pathlib import Path

import yaml

from ..domain.scenario import Scenario

TRUST_LEVELS = ("internal", "controlled_research", "contractual", "public")
QUESTION_KINDS = ("median", "mean", "count", "correlation", "distribution")


def _check_question(number: int, question: dict) -> dict:
    kinds = [kind for kind in QUESTION_KINDS if kind in question]
    if len(kinds) != 1:
        raise ValueError(f"Question {number} needs exactly one of: {', '.join(QUESTION_KINDS)}.")
    kind = kinds[0]
    columns = question[kind] if isinstance(question[kind], list) else [question[kind]]
    by = question.get("by", [])
    by = by if isinstance(by, list) else [by]
    for column in columns + by:
        if column is not True and "." not in str(column):
            raise ValueError(f"Question {number}: write columns as table.column, such as visits.age. Got `{column}`.")
    if kind == "correlation" and len(columns) != 2:
        raise ValueError(f"Question {number}: correlation needs exactly two columns.")
    if kind in ("median", "mean", "distribution") and len(columns) != 1:
        raise ValueError(f"Question {number}: {kind} takes one column.")
    if kind == "count" and not by:
        raise ValueError(f"Question {number}: count needs `by`, the columns to count across.")
    return {"id": str(question.get("id", f"Q{number}")), "ask": question.get("ask", ""), "kind": kind,
            "columns": [] if columns == [True] else [str(c) for c in columns], "by": [str(c) for c in by]}


def load_scenario_file(path: Path, dataset: str) -> Scenario:
    text = Path(path).read_text(encoding="utf-8")
    raw = json.loads(text) if str(path).endswith(".json") else yaml.safe_load(text)
    if not isinstance(raw, dict):
        raise ValueError("A scenario file must be a set of named fields, such as `recipient:` and `trust_level:`.")
    trust = raw.get("trust_level")
    if trust not in TRUST_LEVELS:
        raise ValueError(f"trust_level must be one of: {', '.join(TRUST_LEVELS)}.")
    questions = tuple(_check_question(n, q) for n, q in enumerate(raw.get("questions") or [], start=1))
    return Scenario(id=str(raw.get("id", f"CUSTOM-{trust}")), dataset=str(raw.get("dataset", dataset)), trust_level=trust,
                    recipient=str(raw.get("recipient", "")), purpose=str(raw.get("purpose", "")), questions=questions,
                    task_ids=tuple(q["id"] for q in questions), k=raw.get("k"), text_recall=raw.get("text_recall"))
