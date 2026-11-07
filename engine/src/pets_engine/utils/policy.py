"""Loads the readable policy file."""
from __future__ import annotations

from functools import lru_cache
from importlib import resources

import yaml


@lru_cache(maxsize=1)
def policy() -> dict:
    text = (resources.files("pets_engine") / "data" / "rules.yaml").read_text(encoding="utf-8")
    return yaml.safe_load(text)
