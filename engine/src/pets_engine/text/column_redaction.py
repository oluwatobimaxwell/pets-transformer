"""Redacts every free-text column the plan keeps, reusing what the data owner already knows about each record."""
from __future__ import annotations

from .record_context import build_name_book, values_by_row
from .redactor import TextRedactor


LINKING_ROLES = ("record_key", "technical_identifier")


def group_column(frame, labels: list, table: str, tables: dict):
    """The key that groups rows into one conversation, so a person keeps the same placeholder throughout and the shuffle moves
    the conversation as one block. Only a linking key counts: grouping by a shared timestamp or category would keep whole hours
    or categories in time order."""
    for label in labels:
        if label.table != table or label.column not in frame.columns or label.role not in LINKING_ROLES:
            continue
        shared = any(label.column in other.columns for name, other in tables.items() if name != table)
        if shared and not frame[label.column].is_unique:
            return label.column
    return None


def redact_columns(plan: list, tables: dict, labels: list, on_event=None) -> dict:
    wanted = [choice for choice in plan if choice.pet == "redact_text"]
    if not wanted:
        return {}
    book = build_name_book(tables, labels)
    book.learn_common_words(text for choice in wanted for text in tables[choice.table][choice.column].fillna("").astype(str))
    redactor = TextRedactor(book)
    redacted = {}
    for choice in wanted:
        if on_event:
            on_event("transform", f"Redacting {choice.key}")
        frame = tables[choice.table]
        own_values = values_by_row(tables, labels, choice.table)
        redacted[choice.key] = redactor.redact_column(frame, choice.column, group_column(frame, labels, choice.table, tables), own_values)
    return redacted
