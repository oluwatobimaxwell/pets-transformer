"""Scores the required questions on the release and turns them into gate checks. One place, whoever wrote the questions."""
from __future__ import annotations

from ..domain.check import REVIEW, Check
from ..utils.policy import policy


def score_tasks(tasks: list, original: dict, release: dict) -> list:
    results = []
    for task in tasks:
        try:
            outcome = task.fn(original, release)
        except (KeyError, ValueError, AttributeError, TypeError, IndexError, ZeroDivisionError) as error:
            outcome = {"score": None, "metric": "error", "detail": {"error": f"{type(error).__name__}: {error}"}}
        results.append({"id": task.id, "description": task.description, "kind": task.kind, "score": outcome.get("score"),
                        "metric": outcome.get("metric", ""), "detail": outcome.get("detail") or {}})
    return results


def from_scorecard(report: dict, task_ids: tuple) -> list:
    return [{"id": t["id"], "description": t.get("description", ""), "kind": t.get("kind", ""), "score": t.get("score"),
             "metric": t.get("metric", ""), "detail": t.get("detail") or {}} for t in report["utility"] if t["id"] in task_ids]


def task_checks(results: list) -> list:
    floor = policy()["gate"]["min_task_score"]
    checks = []
    for task in results:
        score = task["score"]
        answered = score is not None and score >= floor
        detail = "not answerable" if score is None else f"{score:.2f}"
        checks.append(Check(f"Task {task['id']} still works", answered, REVIEW, f"{task['description']}: {detail}"))
    return checks
