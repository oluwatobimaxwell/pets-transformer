"""Reads meaning from a column's name using the lexicon, which values alone can't reveal."""
from __future__ import annotations

import re
from dataclasses import dataclass
from functools import lru_cache
from importlib import resources

import yaml

from .features import UNINFORMATIVE_NAME


@dataclass(frozen=True)
class NameHint:
    role: str
    subtype: str
    reason: str


@lru_cache(maxsize=1)
def lexicon() -> tuple:
    text = (resources.files("pets_engine") / "data" / "name_lexicon.yaml").read_text(encoding="utf-8")
    return tuple((re.compile(rule["pattern"], re.I), rule["role"], rule["subtype"]) for rule in yaml.safe_load(text))


def singular(table: str) -> str:
    return table[:-1] if table.endswith("s") else table


def own_key_hint(table: str, column: str):
    name = column.lower()
    if name.endswith("_id") and name[:-3] and (name[:-3] in table.lower() or singular(table).lower().endswith(name[:-3])):
        return NameHint("record_key", "RECORD_ID", f"`{column}` names this table's own key")
    return None


def name_hint(table: str, column: str):
    if UNINFORMATIVE_NAME.match(column):
        return None
    own_key = own_key_hint(table, column)
    if own_key:
        return own_key
    for pattern, role, subtype in lexicon():
        if pattern.search(column):
            return NameHint(role, subtype, f"the name `{column}` suggests {subtype}")
    return None
