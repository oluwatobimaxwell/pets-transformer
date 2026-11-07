"""Rows that stand out lose a clue value, not the whole row."""
import pandas as pd

from pets_engine.domain.pet_choice import PetChoice
from pets_engine.tune.k_check import share_below_k
from pets_engine.tune.local_recoding import BLANK, recode_release


class _Task:
    """Scores how much of the area column is still filled in, so blanking age costs less than blanking area."""
    def fn(self, original, release):
        return {"score": float((release["visits"]["area"] != BLANK).mean())}


def _plan() -> list:
    return [PetChoice("visits", column, "generalise", "clue", params={"subtype": subtype}, output_column=column, tunable=True)
            for column, subtype in (("age", "AGE"), ("area", "MUNICIPALITY"))]


def test_rare_rows_keep_their_place_and_lose_the_cheapest_clue_first():
    rare_ages = ["0-9", "60-69", "70-79", "80-89", "90+"]
    visits = pd.DataFrame({"age": ["20-29"] * 10 + rare_ages, "area": ["Turku"] * 15})
    recoded, log = recode_release({"visits": visits}, _plan(), 5, [_Task()], {"visits": visits})
    out = recoded["visits"]
    assert len(out) == len(visits)
    assert (out.loc[10:, "age"] == BLANK).all() and (out.area == "Turku").all()
    assert share_below_k(out, ["age", "area"], 5) == 0.0
    assert log == {"visits": [{"column": "age", "rows": 5, "utility": 1.0}]}


def test_nothing_changes_when_every_row_already_has_look_alikes():
    visits = pd.DataFrame({"age": ["20-29"] * 10, "area": ["Turku"] * 10})
    recoded, log = recode_release({"visits": visits}, _plan(), 5, [_Task()], {"visits": visits})
    assert recoded["visits"].equals(visits) and log == {}
