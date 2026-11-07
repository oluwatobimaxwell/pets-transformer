"""Loads the plain-language wording the dashboard uses."""
from __future__ import annotations

from functools import lru_cache
from importlib import resources

import yaml


@lru_cache(maxsize=1)
def explanations() -> dict:
    text = (resources.files("pets_engine") / "data" / "explanations.yaml").read_text(encoding="utf-8")
    return yaml.safe_load(text)


def score_band(score) -> dict:
    guide = explanations()
    if score is None:
        return guide["not_answerable"]
    return next(band for band in guide["bands"] if score >= band["min"])


def risk_wording(raw_name: str) -> dict:
    for phrase, wording in explanations()["risks"].items():
        if phrase in raw_name:
            return wording
    return {"name": raw_name, "meaning": ""}
