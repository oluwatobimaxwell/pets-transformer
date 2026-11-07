"""The techniques. Each takes a column and returns the protected column, leaving blanks blank."""
from __future__ import annotations

import hashlib
import hmac
import ipaddress
import re

import numpy as np
import pandas as pd

from pets_eval import parse

TOKEN_LENGTH = 16
TOKEN_PREFIX = "pt"  # letters stop a token that happens to be all digits from reading as a phone or card number
_LIST_SPLIT = re.compile(r"\s*[;,]\s*")
OTHER = "other"


def _is_blank(value) -> bool:
    return value is None or (isinstance(value, float) and np.isnan(value)) or str(value).strip() == ""


def token(value: str, key: bytes) -> str:
    return TOKEN_PREFIX + hmac.new(key, value.strip().lower().encode(), hashlib.sha256).hexdigest()[:TOKEN_LENGTH]


def _pseudonym(value, key: bytes):
    if _is_blank(value):
        return ""
    text = str(value)
    parts = _LIST_SPLIT.split(text) if "@" in text else [text]
    return ";".join(token(part, key) for part in parts)


def keyed_pseudonym(series: pd.Series, key: bytes) -> pd.Series:
    mapping = {value: _pseudonym(value, key) for value in series.dropna().unique()}
    return series.map(mapping).fillna("")


def _prefix_preserving(address: str, key: bytes) -> str:
    """Equal prefixes stay equal, so subnet structure survives without revealing real addresses."""
    parts, out = address.split("."), []
    for depth in range(4):
        digest = hmac.new(key, ".".join(parts[: depth + 1]).encode(), hashlib.sha256).digest()
        out.append(str(digest[0]))
    return ".".join(out)


def prefix_ip(series: pd.Series, key: bytes) -> pd.Series:
    def protect(value):
        if _is_blank(value):
            return ""
        try:
            is_v4 = ipaddress.ip_address(str(value).strip()).version == 4
        except ValueError:
            is_v4 = False
        return _prefix_preserving(str(value).strip(), key) if is_v4 else token(str(value), key)
    mapping = {value: protect(value) for value in series.dropna().unique()}
    return series.map(mapping).fillna("")


def shorten_code(series: pd.Series, length: int = 3) -> pd.Series:
    return series.astype("string").str[:length].fillna("").astype(object)


def age_band(series: pd.Series, width: int, from_birth: bool) -> pd.Series:
    ages = parse.age_from_birth(series) if from_birth else parse.parse_numeric(series)
    return parse.to_age_band(ages, width=width).astype("string").fillna("").astype(object)


def postcode_prefix(series: pd.Series, digits: int) -> pd.Series:
    prefix = parse.postcode_prefix(series, digits)
    return (prefix + "*" * (5 - digits)).where(prefix.notna(), "")


def keep_largest(series: pd.Series, top: int) -> pd.Series:
    largest = series[series.astype(str).str.strip() != ""].value_counts().index[:top]
    return series.where(series.isin(largest) | series.isna(), OTHER)


def merge_rare(series: pd.Series, minimum: int) -> pd.Series:
    counts = series.value_counts()
    return series.where(series.map(counts).fillna(minimum) >= minimum, OTHER)



TIME_FORMATS = {"minute": "%Y-%m-%d %H:%M", "hour_stamp": "%Y-%m-%d %H:00", "day": "%Y-%m-%d", "month": "%Y-%m", "year": "%Y",
                "week": "%G-W%V", "hour_of_day": "%H:00"}


def coarsen_time(series: pd.Series, level: str) -> pd.Series:
    moments = parse.to_datetime(series)
    return moments.dt.strftime(TIME_FORMATS[level]).where(moments.notna(), "")


def round_number(series: pd.Series, decimals: int) -> pd.Series:
    return parse.parse_numeric(series).round(decimals)
