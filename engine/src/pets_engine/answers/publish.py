"""Publishes a public release as noisy answers to its question list, and scores them the way the challenge does."""
from __future__ import annotations

import secrets
from pathlib import Path

import numpy as np
import pandas as pd

from pets_eval import io
from pets_eval.parse import score_from_rel_error

from ..domain.verdict import Verdict
from ..select.task_needs import required_tasks
from ..utils.policy import policy
from ..verify.answer_checks import ANSWER_FILE, answers_only_check, budget_check, person_unit_check
from ..verify.task_results import score_tasks, task_checks
from .mechanism import bound_contributions, families, noisy_answers
from .workload import analysis_fields, load_workload

SMALL_COUNT = 10  # relative error on tiny counts says little, so they're left out of the accuracy measure, as in the toolkit


def person_column(labels: list, table: str) -> str | None:
    wanted = policy()["person_subtypes"]
    found = sorted((label for label in labels if label.table == table and label.subtype in wanted), key=lambda label: wanted.index(label.subtype))
    return found[0].column if found else None


def _accuracy(fields: pd.DataFrame, queries: list, answers: pd.DataFrame) -> dict:
    """For a question list the toolkit can't score: mean relative error against the exact answers."""
    exact, _ = noisy_answers(fields, queries, float("inf"), 1, np.random.default_rng(0))
    joined = exact.merge(answers, on="id", suffixes=("_exact", "_noisy"))
    counts = {q["id"] for q in queries if q["type"] == "count"}
    joined = joined[(joined.value_exact >= SMALL_COUNT) | ~joined.id.isin(counts)]
    errors = ((joined.value_noisy - joined.value_exact).abs() / joined.value_exact.abs().clip(lower=1e-9)).clip(upper=1)
    error = float(errors.mean()) if len(errors) else 1.0
    return {"id": "ANSWERS", "description": "Accuracy of the published answers", "kind": "aggregate", "score": score_from_rel_error(error, .5),
            "metric": "mean relative error against the exact answers", "detail": {"mean_rel_error": round(error, 4), "answers": len(joined)}}


def _family_record(queries: list, budgets: dict, bound: int) -> list:
    sizes = {key: len(members) for key, members in families(queries).items()}
    return [{"kind": kind, "filters": list(filters), "value": value, "questions": sizes[(kind, value, filters, bounds)], "epsilon": round(share, 4),
             "count_noise_scale": round(bound / share, 1) if kind == "count" else None}
            for (kind, value, filters, bounds), share in budgets.items()]


def publish_answers(config, labels: list, workload_file: Path, staged: Path, on_event) -> tuple:
    """Writes the answers into `staged` and returns the gate's verdict, the task results and the record of the mechanism."""
    settings = policy()["answers"]
    workload = load_workload(workload_file)
    queries = workload["queries"]
    epsilon = config.scenario.epsilon_limit or settings["epsilon"]
    bound = settings["contribution_bound"]
    tables = io.load_tables(config.data_dir)
    frame = tables[workload["table"]]
    fields = analysis_fields(workload, frame)
    person = person_column(labels, workload["table"])
    on_event("answers", f"Answering {len(queries)} questions with epsilon {epsilon:g}")
    people = frame.loc[fields.index, person].fillna("") if person else pd.Series("", index=fields.index)
    bounded = bound_contributions(fields, people, bound, np.random.default_rng(secrets.randbits(128)))
    answers, budgets = noisy_answers(bounded, queries, epsilon, bound, np.random.default_rng(secrets.randbits(128)))
    staged.mkdir(parents=True, exist_ok=True)
    answers.to_csv(staged / ANSWER_FILE, index=False)
    results = score_tasks(required_tasks(config.scenario), tables, {"dp_answers": answers}) if config.scenario.has_tasks else []
    scored = [r for r in results if r["score"] is not None] or [_accuracy(fields, queries, answers)]
    checks = [answers_only_check(staged), budget_check(sum(budgets.values()), epsilon), person_unit_check(person, bound)] + task_checks(scored)
    record = {"mechanism": "Laplace, with each person's contribution bounded", "epsilon": epsilon, "delta": 0, "contribution_bound": bound,
              "unit": f"one person, by {person}" if person else "one record", "workload": Path(workload_file).name, "questions": len(queries),
              "answered": len(answers), "families": _family_record(queries, budgets, bound),
              "not_covered": [{"id": r["id"], "description": r["description"]} for r in results if r["score"] is None]}
    return Verdict(1, checks), scored, record
