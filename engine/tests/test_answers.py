"""Public releases: noisy answers with a stated guarantee, never rows."""
import json
from pathlib import Path

import numpy as np
import pandas as pd

from pets_engine.answers.mechanism import bound_contributions, budget_split, families, noisy_answers
from pets_engine.domain.run_config import RunConfig
from pets_engine.pipeline import run_release
from pets_engine.utils.scenario_file import load_scenario_file

QUERIES = [{"id": f"N-{area}", "type": "count", "filters": {"area": area}} for area in ("north", "south")] + \
          [{"id": "N-north-again", "type": "count", "filters": {"area": "north"}},
           {"id": "M-north", "type": "mean", "value": "amount", "filters": {"area": "north"}, "bounds": [0, 100]},
           {"id": "W-1", "type": "count", "filters": {"area": "north", "week": "1"}}]


def visits(rows: int = 400, people: int = 100) -> pd.DataFrame:
    return pd.DataFrame({"person": [f"P{i % people}" if i % 10 else "" for i in range(rows)], "area": ["north", "south"] * (rows // 2),
                         "week": [str(i % 4) for i in range(rows)], "amount": [float(i % 50) for i in range(rows)]})


def test_the_budget_adds_up_and_bigger_families_get_more():
    budgets = budget_split(families(QUERIES), 1.0)
    assert abs(sum(budgets.values()) - 1.0) < 1e-9
    by_size = {len(members): budgets[key] for key, members in families(QUERIES).items()}
    assert by_size[3] > by_size[1]


def test_each_person_counts_at_most_the_bound_and_blank_ids_count_alone():
    frame = visits()
    kept = bound_contributions(frame, frame.person, 2, np.random.default_rng(1))
    named = kept[kept.person != ""]
    assert named.person.value_counts().max() <= 2
    assert (kept.person == "").sum() == (frame.person == "").sum()


def test_answers_are_close_with_a_large_budget_and_a_repeated_question_gets_one_answer():
    frame = visits()
    answers, _ = noisy_answers(frame, QUERIES, 1e6, 1, np.random.default_rng(2))
    got = dict(zip(answers.id, answers.value))
    assert got["N-north"] == 200 and got["N-north"] == got["N-north-again"]
    assert abs(got["M-north"] - frame[frame.area == "north"].amount.mean()) < 0.01


def test_a_public_scenario_with_a_question_list_releases_answers_only(tmp_path):
    folder = tmp_path / "shop"
    folder.mkdir()
    visits(2000, people=700).rename(columns={"person": "customer_email"}).assign(
        customer_email=lambda f: f.customer_email.where(f.customer_email == "", f.customer_email + "@kotiposti.example")).to_csv(folder / "visits.csv", index=False)
    (tmp_path / "workload.json").write_text(json.dumps({"table": "visits", "queries": QUERIES}))
    (tmp_path / "scenario.yaml").write_text("recipient: Anyone\ntrust_level: public\nepsilon: 50\nworkload: workload.json\n")
    result = run_release(RunConfig(folder, tmp_path / "run", load_scenario_file(tmp_path / "scenario.yaml", "shop")))
    manifest = json.loads((tmp_path / "run" / "evidence" / "manifest.json").read_text())
    assert result.status == "release"
    assert [f.name for f in (tmp_path / "run" / "release").iterdir()] == ["dp_answers.csv"]
    assert manifest["answers"]["epsilon"] == 50 and manifest["answers"]["unit"] == "one person, by customer_email"
    assert manifest["tasks"][0]["id"] == "ANSWERS" and manifest["tasks"][0]["score"] > 0.9


def test_a_public_scenario_with_no_question_list_is_still_blocked(tmp_path):
    folder = tmp_path / "shop"
    folder.mkdir()
    visits().to_csv(folder / "visits.csv", index=False)
    (tmp_path / "scenario.yaml").write_text("recipient: Anyone\ntrust_level: public\n")
    result = run_release(RunConfig(folder, tmp_path / "run", load_scenario_file(tmp_path / "scenario.yaml", "shop")))
    assert result.status == "block" and not (tmp_path / "run" / "release").exists()
