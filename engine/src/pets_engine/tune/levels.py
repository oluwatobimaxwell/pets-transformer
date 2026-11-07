"""One setting on a dial: how much detail a column keeps, and how much that costs."""
from __future__ import annotations

from ..transform import pets

LOSS = {"exact": 0, "rare_kept": 0, "area_all": 0, "minute": 1, "age_5": 1, "round_3": 1, "round_tens": 2, "postcode_3": 1, "rare_200": 2, "area_top_16": 2,
        "hour_stamp": 2, "age_10": 2, "round_2": 2, "day": 3, "postcode_2": 3, "area_top_8": 3, "age_20": 4, "hour_of_day": 4, "rare_binary": 4,
        "week": 4, "month": 5, "year": 6}


def apply_level(series, level: str, subtype: str):
    if level in ("exact", "rare_kept", "area_all"):
        return series
    if level.startswith("age_"):
        return pets.age_band(series, int(level[4:]), from_birth=subtype == "BIRTH_DATE")
    if level.startswith("postcode_"):
        return pets.postcode_prefix(series, int(level[-1]))
    if level.startswith("area_top_"):
        return pets.keep_largest(series, int(level[9:]))
    if level == "rare_200":
        return pets.merge_rare(series, 200)
    if level == "rare_binary":
        return pets.keep_largest(series, 1)
    if level.startswith("round_") and level != "round_tens":
        return pets.round_number(series, int(level[-1]))
    if level == "round_tens":
        return pets.round_number(series, -1)
    return pets.coarsen_time(series, level)
