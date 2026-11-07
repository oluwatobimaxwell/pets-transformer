"""Turns profiles into numbers for the classifier. The name is optional, so the model also learns to work without it."""
from __future__ import annotations

import math
import re

import numpy as np
from scipy.sparse import csr_matrix, hstack
from sklearn.feature_extraction.text import HashingVectorizer

from ..domain.column_profile import ColumnProfile
from .patterns import PATTERNS

NAME_HASHER = HashingVectorizer(analyzer="char_wb", ngram_range=(2, 5), n_features=1024, alternate_sign=False, norm=None)
UNINFORMATIVE_NAME = re.compile(r"^(c|col|column|field|f|v|var|x)[-_]?\d+$", re.I)


def signed_log(value: float) -> float:
    return math.copysign(math.log1p(abs(value)), value)


def value_features(p: ColumnProfile) -> list:
    return [p.blank_share, p.distinct_share, math.log1p(p.distinct), p.mean_length, math.log1p(p.max_length), p.length_spread,
            p.mean_tokens, p.digit_share, p.alpha_share, p.numeric_share, p.integer_share, signed_log(p.numeric_min),
            signed_log(p.numeric_max), p.top_value_share, p.top_shape_share, math.log1p(p.shape_count)] + \
        [p.pattern_shares.get(name, 0.0) for name in PATTERNS]


def readable_name(p: ColumnProfile, use_name: bool) -> str:
    if not use_name or UNINFORMATIVE_NAME.match(p.column):
        return ""
    return f"{p.column} ".lower().replace("_", " ")


def build_matrix(profiles: list, use_name: bool = True):
    numbers = csr_matrix(np.array([value_features(p) for p in profiles], dtype=float))
    names = NAME_HASHER.transform([readable_name(p, use_name) for p in profiles])
    return hstack([numbers, names]).tocsr()
