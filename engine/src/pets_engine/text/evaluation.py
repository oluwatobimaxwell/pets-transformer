"""Scores redaction on text the rules were not tuned on, so the numbers stay honest."""
from __future__ import annotations

import hashlib
from pathlib import Path

from pets_eval import text as pets_text
from pets_eval.utility.customer_service import load_spans

from ..detect.detector import ColumnDetector
from ..detect.labelling import label_tables
from ..utils.tables import read_text_tables
from .record_context import build_name_book, values_by_row
from .redactor import TextRedactor

HELD_OUT_PERCENT = 20
UNTOUCHED_SETS = (("health", "clinical_notes", "note_id", "note_text"), ("public_admin", "service_requests", "request_id", "description"),
                  ("education", "counsellor_notes", "note_id", "note_text"))


def is_held_out(group: str) -> bool:
    return int(hashlib.sha256(str(group).encode()).hexdigest(), 16) % 100 < HELD_OUT_PERCENT


def _leakage(gold: dict, ids: list, texts: list, redacted: list) -> dict:
    report = pets_text.redaction_leakage({i: gold[i] for i in ids if i in gold}, dict(zip(ids, redacted)), original_texts=dict(zip(ids, texts)))
    return {"values": report["n_values"], "identifying_leakage": report["identifying_leakage_rate"], "all_labels_leakage": report["leakage_rate"],
            "by_label": {label: stats["rate"] for label, stats in report["per_label"].items()}}


def _redacted(tables: dict, labels: list, table: str, column: str, group: str | None) -> list:
    book = build_name_book(tables, labels)
    book.learn_common_words(tables[table][column].tolist())
    return TextRedactor(book).redact_column(tables[table], column, group, values_by_row(tables, labels, table)).tolist()


def evaluate_text(root: Path) -> dict:
    detector = ColumnDetector.load()
    results = {}
    tables = read_text_tables(root / "data" / "customer_service")
    labels = label_tables(tables, detector)
    turns, conversations = tables["turns"], tables["conversations"]
    redacted = _redacted(tables, labels, "turns", "text", "conversation_id")
    labelled = set(conversations.loc[conversations["split"] == "train", "conversation_id"])
    chosen = turns["conversation_id"].isin(labelled) & turns["conversation_id"].map(is_held_out)
    ids = turns.loc[chosen, "turn_id"].tolist()
    results["customer_service.turns (held-out 20%)"] = _leakage(load_spans(root / "metadata" / "pii_spans" / "customer_service__turns__text.jsonl"), ids,
                                                                turns.loc[chosen, "text"].tolist(), [redacted[i] for i in turns.index[chosen]])
    for dataset, table, key, column in UNTOUCHED_SETS:
        tables = read_text_tables(root / "data" / dataset)
        labels = label_tables(tables, detector)
        ids = tables[table][key].tolist()
        gold = load_spans(root / "metadata" / "pii_spans" / f"{dataset}__{table}__{column}.jsonl")
        results[f"{dataset}.{table} (never tuned on)"] = _leakage(gold, ids, tables[table][column].tolist(), _redacted(tables, labels, table, column, None))
    return results
