"""Hash columns anyone can undo: an unkeyed hash of another column in the same table, tested on this machine only."""
from __future__ import annotations

import hashlib

import pandas as pd

from ..domain.field_label import FieldLabel
from ..utils.tables import non_blank
from .evidence import STRONG
from .patterns import PATTERNS

DIGESTS = {32: ("MD5", hashlib.md5), 40: ("SHA-1", hashlib.sha1), 64: ("SHA-256", hashlib.sha256)}
SAMPLE_VALUES = 5000
MATCH_SHARE = 0.2
SOURCE = "hash check"


def _spellings(value: str) -> set:
    """How a value is usually written down before someone hashes it."""
    trimmed = value.strip()
    return {value, trimmed, trimmed.upper(), trimmed.lower(), trimmed.replace(" ", "")}


def _is_hash_column(values: pd.Series) -> bool:
    sample = non_blank(values.head(SAMPLE_VALUES))
    return len(sample) > 0 and float(sample.map(PATTERNS["hex_hash"]).mean()) >= STRONG


def _hashed_source(frame: pd.DataFrame, column: str):
    """The column whose values hash to this one's, with the algorithm and the share of its values found."""
    hashes = non_blank(frame[column]).str.lower()
    digest = DIGESTS.get(int(hashes.str.len().mode().iloc[0]))
    if digest is None:
        return None
    algorithm, hash_fn = digest
    known = set(hashes)
    best = None
    for other in frame.columns:
        values = non_blank(frame[other]).unique()[:SAMPLE_VALUES] if other != column else []
        if not len(values):
            continue
        found = sum(1 for value in values if any(hash_fn(s.encode()).hexdigest() in known for s in _spellings(value)))
        share = found / len(values)
        if share >= MATCH_SHARE and (best is None or share > best[2]):
            best = (other, algorithm, share)
    return best


def reverse_hashes(tables: dict, labels: list) -> list:
    """A hash with no key reveals exactly what its source does, so it takes the source's label."""
    by_key = {label.key: label for label in labels}
    out = []
    for label in labels:
        frame = tables.get(label.table)
        found = _hashed_source(frame, label.column) if frame is not None and _is_hash_column(frame[label.column]) else None
        if not found:
            out.append(label)
            continue
        other, algorithm, share = found
        source = by_key[f"{label.table}.{other}"]
        out.append(FieldLabel(label.table, label.column, source.role, source.subtype, 0.99, SOURCE,
                              [f"{algorithm} of {other} with no key: {share:.0%} of its values hash to values here, so anyone can undo it"]))
    return out
