"""Handles the secret. Each recipient gets a key derived from the master, so two releases can't be joined."""
from __future__ import annotations

import hashlib
import hmac
import os

KEY_VARIABLE = "PETS_ENGINE_KEY"
MIN_KEY_LENGTH = 16


def recipient_key(scenario_id: str, master: str | None = None) -> bytes:
    secret = master if master is not None else os.environ.get(KEY_VARIABLE, "")
    if len(secret) < MIN_KEY_LENGTH:
        raise ValueError(f"Set {KEY_VARIABLE} to a secret of at least {MIN_KEY_LENGTH} characters. It must stay outside the output.")
    return hmac.new(secret.encode(), scenario_id.encode(), hashlib.sha256).digest()
