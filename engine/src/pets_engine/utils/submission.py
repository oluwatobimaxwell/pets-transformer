"""Builds the outputs the organisers can score: `unseen` labels and the redacted evaluation turns."""
from __future__ import annotations

import shutil
from pathlib import Path

import pandas as pd

from ..detect.detector import ColumnDetector
from ..detect.labelling import label_tables
from ..text.record_context import build_name_book, values_by_row
from ..text.redactor import TextRedactor
from .tables import read_text_tables


def write_unseen_labels(root: Path, out: Path) -> int:
    tables = read_text_tables(root / "data" / "unseen")
    labels = label_tables(tables, ColumnDetector.load())
    pd.DataFrame([{"column": l.column, "privacy_role": l.best_guess_role or l.role, "subtype": l.best_guess_subtype or l.subtype} for l in labels]).to_csv(
        out / "unseen_field_labels.csv", index=False)
    return len(labels)


def write_redacted_evaluation(root: Path, out: Path) -> int:
    tables = read_text_tables(root / "data" / "customer_service")
    labels = label_tables(tables, ColumnDetector.load())
    turns, conversations = tables["turns"], tables["conversations"]
    book = build_name_book(tables, labels)
    book.learn_common_words(turns["text"].tolist())
    redacted = TextRedactor(book).redact_column(turns, "text", "conversation_id", values_by_row(tables, labels, "turns"))
    evaluation = set(conversations.loc[conversations["split"] == "eval", "conversation_id"])
    keep = turns["conversation_id"].isin(evaluation)
    pd.DataFrame({"turn_id": turns.loc[keep, "turn_id"], "text": redacted[keep]}).to_csv(out / "customer_service_eval_redacted.csv", index=False)
    return int(keep.sum())


def copy_released_run(run: Path, dataset: str, out: Path) -> int:
    """The organisers' hidden attackers need the tables and row maps, so this folder must only go to them."""
    target = out / dataset
    target.mkdir(parents=True, exist_ok=True)
    files = list((run / "release").glob("*.csv")) + list((run / "private").glob("rowmap_*.csv"))
    for file in files:
        shutil.copy2(file, target / file.name)
    return len(files)


def build_submission(root: Path, out: Path, runs: dict | None = None) -> dict:
    out.mkdir(parents=True, exist_ok=True)
    copied = {dataset: copy_released_run(run, dataset, out) for dataset, run in (runs or {}).items()}
    return {"unseen_columns": write_unseen_labels(root, out), "evaluation_turns": write_redacted_evaluation(root, out), "released_files": copied, "folder": str(out)}
