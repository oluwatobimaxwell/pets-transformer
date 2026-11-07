"""Finds personal data in text in layers, then swaps each value for a consistent typed placeholder."""
from __future__ import annotations

import pandas as pd

from .health_terms import health_spans
from .names import NameBook, own_value_spans
from .patterns import pattern_spans
from .span import Span
from .spoken_numbers import spoken_number_spans

_PRIORITY = {"own record": 0, "pattern": 1, "cue": 1, "spoken": 2, "name book": 3, "health terms": 4, "model": 5}


def merged(spans: list) -> list:
    """Overlaps become one span, so nothing is left half redacted."""
    ordered = sorted(spans, key=lambda s: (s.start, -s.end, _PRIORITY.get(s.layer, 9)))
    result: list = []
    for span in ordered:
        if result and span.start < result[-1].end:
            last = result[-1]
            result[-1] = Span(last.start, max(last.end, span.end), last.label, last.layer)
        else:
            result.append(span)
    return result


class TextRedactor:
    def __init__(self, book: NameBook, extra_layers: tuple = ()):
        self.book = book
        self.extra_layers = extra_layers

    def find(self, text: str, own_values: list | None = None) -> list:
        found = pattern_spans(text) + spoken_number_spans(text)
        spans = [s for s in found if not self._is_everyday_cue_hit(text, s)] + self.book.spans(text) + health_spans(text)
        if own_values:
            spans += own_value_spans(text, own_values)
        for layer in self.extra_layers:
            spans += layer(text)
        return merged(spans)

    def _is_everyday_cue_hit(self, text: str, span: Span) -> bool:
        value = text[span.start:span.end]
        return span.layer == "cue" and span.label in ("PERSON", "SECRET") and value.islower() and value.split()[0] in self.book.common and value not in self.book.forms

    def redact_column(self, frame: pd.DataFrame, column: str, group_column: str | None, values_by_row: dict | None = None) -> pd.Series:
        output, numbering = [], {}
        groups = frame[group_column].astype(str).tolist() if group_column else list(range(len(frame)))
        texts = frame[column].fillna("").astype(str).tolist()
        for row, (text, group) in enumerate(zip(texts, groups)):
            spans = self.find(text, (values_by_row or {}).get(row)) if text else []
            output.append(self._swap(text, spans, numbering.setdefault(group, {})))
        return pd.Series(output, index=frame.index)

    @staticmethod
    def _swap(text: str, spans: list, seen: dict) -> str:
        pieces, cursor = [], 0
        for span in spans:
            value = text[span.start:span.end].casefold()
            number = seen.setdefault((span.label, value), sum(1 for label, _ in seen if label == span.label) + 1)
            pieces += [text[cursor:span.start], f"[{span.label}_{number}]"]
            cursor = span.end
        pieces.append(text[cursor:])
        return "".join(pieces)
