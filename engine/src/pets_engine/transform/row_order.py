"""Shuffles released rows with the secret key, because rows left in arrival order reveal roughly when each happened.

Rows that belong together, such as the turns of one conversation, move as a block and keep their own order.
"""
from __future__ import annotations

import hashlib
import hmac

import numpy as np
import pandas as pd


def _generator(key: bytes, table: str) -> np.random.Generator:
    seed = int.from_bytes(hmac.new(key, f"row-order:{table}".encode(), hashlib.sha256).digest()[:8], "big")
    return np.random.default_rng(seed)


def shuffled_positions(frame: pd.DataFrame, key: bytes, table: str, group_column: str | None = None) -> np.ndarray:
    """Positions into `frame`, in their new order."""
    rng = _generator(key, table)
    if not group_column or group_column not in frame.columns:
        return rng.permutation(len(frame))
    groups = pd.factorize(frame[group_column].astype(str), sort=False)[0]
    new_rank = rng.permutation(groups.max() + 1 if len(groups) else 0)
    return np.lexsort((np.arange(len(frame)), new_rank[groups]))
