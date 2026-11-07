from pets_engine.domain.field_label import FieldLabel
from pets_engine.domain.scenario import Scenario
from pets_engine.select.key_order import time_ordered_keys
from pets_engine.select.selector import select_pets
from pets_engine.select.task_needs import with_join_keys
import pandas as pd

RESEARCH = Scenario("TEST", "demo", "controlled_research", targets="k>=5 on age")


def label(column, role, subtype, table="t"):
    return FieldLabel(table, column, role, subtype, 0.9, "test")


def test_anything_no_task_needs_is_removed_whatever_its_label():
    choices = select_pets([label("weather", "non_sensitive", "CATEGORY")], {"t": []}, RESEARCH, set(), {})
    assert choices[0].pet == "remove"


def test_same_column_gets_a_pet_from_the_rules_when_needed():
    choices = select_pets([label("hetu", "direct_identifier", "NATIONAL_ID")], {"t": ["hetu"]}, RESEARCH, set(), {})
    assert choices[0].pet == "keyed_pseudonym"


def test_clue_columns_go_to_tune():
    choices = select_pets([label("dob", "quasi_identifier", "BIRTH_DATE")], {"t": ["dob"]}, RESEARCH, set(), {})
    assert choices[0].tunable and choices[0].output_column == "age"


def test_scenario_states_its_bar():
    assert RESEARCH.k_required == 5
    assert Scenario("X", "d", "public").is_public


def test_time_ordered_key_is_flagged_in_every_table():
    visits = pd.DataFrame({"visit_id": [f"V{i:03}" for i in range(50)], "ts": pd.date_range("2025-01-01", periods=50, freq="h").astype(str)})
    labs = pd.DataFrame({"visit_id": ["V001", "V002"], "value": [1, 2]})
    labels = [label("visit_id", "record_key", "RECORD_ID", "visits"), label("ts", "quasi_identifier", "TIMESTAMP", "visits"), label("visit_id", "technical_identifier", "RECORD_ID", "labs")]
    assert time_ordered_keys({"visits": visits, "labs": labs}, labels) == {"visits.visit_id", "labs.visit_id"}


def test_join_key_stays_in_both_kept_tables():
    tables = {"a": pd.DataFrame({"key": [1, 2], "x": [1, 2]}), "b": pd.DataFrame({"key": [1, 1], "y": [3, 4]})}
    assert with_join_keys({"a": ["x"], "b": ["y"]}, tables) == {"a": ["x", "key"], "b": ["y", "key"]}
