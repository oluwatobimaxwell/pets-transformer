import pandas as pd
import pytest

from pets_engine.domain.scenario import Scenario
from pets_engine.select.questions import question_tasks
from pets_engine.select.standard_checks import standard_tasks
from pets_engine.domain.pet_choice import PetChoice
from pets_engine.domain.field_label import FieldLabel
from pets_engine.utils.alignment import align_original
from pets_engine.utils.scenario_file import load_scenario_file

GOOD = """
id: DEMO-1
recipient: Researchers
trust_level: controlled_research
k: 5
questions:
  - ask: Median stay by urgency
    median: visits.stay
    by: [visits.urgency]
  - count: true
    by: [visits.area]
  - correlation: [visits.stay, visits.temp]
"""


def write(tmp_path, text):
    path = tmp_path / "scenario.yaml"
    path.write_text(text)
    return path


def test_a_written_scenario_sets_k_and_questions(tmp_path):
    scenario = load_scenario_file(write(tmp_path, GOOD), "demo")
    assert scenario.k_required == 5 and scenario.has_tasks
    assert [q["kind"] for q in scenario.questions] == ["median", "count", "correlation"]


@pytest.mark.parametrize("broken, message", [
    ("trust_level: friends", "trust_level"),
    ("trust_level: public\nquestions:\n  - median: stay", "table.column"),
    ("trust_level: public\nquestions:\n  - count: true", "needs `by`"),
    ("trust_level: public\nquestions:\n  - correlation: [t.a]", "exactly two"),
])
def test_mistakes_in_a_scenario_file_say_how_to_fix_them(tmp_path, broken, message):
    with pytest.raises(ValueError, match=message):
        load_scenario_file(write(tmp_path, broken), "demo")


def test_birth_dates_are_compared_at_the_release_age_bands():
    born = pd.Series(["1976-02-10", "14.8.1979", "1995-05-01"])
    bands = pd.Series(["40-49", "40-49", "30-39"])
    assert align_original(born, bands).tolist() == ["40-49", "40-49", "30-39"]


def test_questions_score_one_when_the_answer_is_unchanged_and_none_when_a_column_is_gone(tmp_path):
    scenario = load_scenario_file(write(tmp_path, GOOD), "demo")
    visits = pd.DataFrame({"stay": [100, 120, 90, 300, 310, 290] * 5, "urgency": ["A", "A", "A", "B", "B", "B"] * 5,
                           "area": ["Turku", "Salo"] * 15, "temp": [36.5, 37.0, 38.0, 36.6, 39.0, 37.5] * 5})
    tasks = question_tasks(scenario)
    same = {t.id: t.fn({"visits": visits}, {"visits": visits})["score"] for t in tasks}
    assert all(score == pytest.approx(1.0) for score in same.values())
    assert tasks[0].fn({"visits": visits}, {"visits": visits.drop(columns="stay")})["score"] is None


def test_standard_checks_cover_kept_columns_but_not_identifiers():
    plan = [PetChoice("t", "age", "generalise", "", output_column="age", tunable=True), PetChoice("t", "id", "keyed_pseudonym", "", output_column="id")]
    labels = [FieldLabel("t", "age", "quasi_identifier", "AGE", 1, ""), FieldLabel("t", "id", "direct_identifier", "NATIONAL_ID", 1, "")]
    assert [task.needs for task in standard_tasks(plan, labels)] == [["age"]]


def test_k_set_directly_wins_over_the_targets_text():
    assert Scenario("X", "d", "contractual", targets="k>=5", k=10).k_required == 10
