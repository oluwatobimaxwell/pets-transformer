"""Connects text to its structured record, so a person's own details can be found in what they wrote."""
from __future__ import annotations

import pandas as pd

from ..utils.tables import non_blank
from .names import NameBook, name_tokens

PERSON_SUBTYPES = ("PERSON_NAME",)
OWN_LABELS = {"PERSON_NAME": "PERSON", "PHONE": "PHONE", "EMAIL": "EMAIL", "STREET_ADDRESS": "ADDRESS", "IBAN": "IBAN", "NATIONAL_ID": "NATIONAL_ID",
              "CUSTOMER_ID": "ACCOUNT_NUMBER", "USERNAME": "USERNAME", "LICENSE_PLATE": "LICENSE_PLATE", "MUNICIPALITY": "LOCATION"}


def build_name_book(tables: dict, labels: list) -> NameBook:
    names: set = set()
    for label in labels:
        if label.subtype in PERSON_SUBTYPES and label.table in tables and label.column in tables[label.table].columns:
            for value in non_blank(tables[label.table][label.column]).unique():
                names.update(name_tokens(value))
    return NameBook(names)


def _shared_key(left: pd.DataFrame, right: pd.DataFrame, labels_right: list):
    for label in labels_right:
        if label.column in left.columns and label.role in ("record_key", "technical_identifier") and right[label.column].is_unique:
            return label.column
    return None


def _record_values(row: dict, labels: list) -> list:
    values = []
    for label in labels:
        raw = row.get(label.column)
        if raw is None or str(raw).strip() == "" or str(raw) == "nan":
            continue
        if label.subtype == "PERSON_NAME":
            values += [(word.casefold(), "PERSON") for word in name_tokens(raw, shortest=2)]
        else:
            values.append((str(raw).casefold(), OWN_LABELS[label.subtype]))
    return values


def _table_lookup(frame: pd.DataFrame, labels: list, key: str) -> dict:
    wanted = [label for label in labels if label.subtype in OWN_LABELS and label.column in frame.columns]
    columns = [key] + [label.column for label in wanted if label.column != key]
    return {row[key]: _record_values(row, wanted) for row in frame[columns].astype(object).to_dict("records")}


def values_by_row(tables: dict, labels: list, text_table: str) -> dict:
    """Every row of the text table, mapped to identifying values reachable through its keys, up to two tables away."""
    frame = tables[text_table]
    own_labels = [label for label in labels if label.table == text_table and label.subtype in OWN_LABELS]
    rows = [_record_values(row, own_labels) for row in frame[[label.column for label in own_labels]].astype(object).to_dict("records")] \
        if own_labels else [[] for _ in range(len(frame))]
    linked = []
    for other, other_frame in tables.items():
        if other == text_table:
            continue
        other_labels = [label for label in labels if label.table == other]
        key = _shared_key(frame, other_frame, other_labels)
        if key:
            linked.append((other, other_frame, other_labels, key, frame[key].tolist()))
    for other, other_frame, other_labels, key, link_values in list(linked):
        for far, far_frame in tables.items():
            if far in (text_table, other):
                continue
            far_labels = [label for label in labels if label.table == far]
            far_key = _shared_key(other_frame, far_frame, far_labels)
            if far_key:
                hop = dict(zip(other_frame[key], other_frame[far_key]))
                linked.append((far, far_frame, far_labels, far_key, [hop.get(v) for v in link_values]))
    for _, other_frame, other_labels, key, link_values in linked:
        lookup = _table_lookup(other_frame, other_labels, key)
        for i, value in enumerate(link_values):
            rows[i] = rows[i] + lookup.get(value, [])
    return {i: sorted(set(values), key=lambda item: -len(item[0])) for i, values in enumerate(rows) if values}
