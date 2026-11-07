"""Values that reveal a special category of personal data (GDPR Article 9), whatever the column is called."""
from __future__ import annotations

import re

import pandas as pd

from ..domain.field_label import FieldLabel
from ..utils.tables import non_blank
from .evidence import STRONG

SAMPLE_VALUES = 5000
SOURCE = "value check"
# Finnish trade unions and their federations, written as codes or short names
TRADE_UNIONS = r"AY[-_ ][A-ZÅÄÖ0-9]{1,8}|JHL|TEHY|SUPER|PAM|PRO|TEK|AKAVA|STTK|SAK|JYTY|JUKO|ERTO|YTN|OAJ"


def _union_share(values: pd.Series) -> float:
    sample = non_blank(values.head(SAMPLE_VALUES))
    return float(sample.str.fullmatch(TRADE_UNIONS, flags=re.I).mean()) if len(sample) else 0.0


def mark_special_categories(tables: dict, labels: list) -> list:
    """Trade-union membership is Article 9 data, so a column of union codes is sensitive even when the model saw a plain category."""
    out = []
    for label in labels:
        frame = tables.get(label.table)
        share = _union_share(frame[label.column]) if frame is not None else 0.0
        if share >= STRONG:
            label = FieldLabel(label.table, label.column, "sensitive_attribute", "SOCIAL_DATA", 0.99, SOURCE,
                               [f"{share:.0%} of values are trade-union codes, a special category under GDPR Article 9"])
        out.append(label)
    return out
