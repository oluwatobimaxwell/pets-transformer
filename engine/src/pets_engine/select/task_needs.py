"""Finds what a scenario's tasks really need by removing columns and re-running the tasks."""
from __future__ import annotations

import hashlib
import json
import time
from pathlib import Path

from pets_eval.utility import UtilityTask, all_tasks

from ..domain.scenario import Scenario
from .questions import question_tasks

CACHE_DIR = Path.home() / ".cache" / "pets-engine"
TIME_BUDGET_SECONDS = 240
KEEP_SCORE = 0.97
# Most sensitive first, so that when two columns can answer a task the safer one survives.
ROLE_ORDER = {"direct_identifier": 0, "technical_identifier": 1, "free_text": 2, "quasi_identifier": 3, "sensitive_attribute": 4,
              "record_key": 5, "non_sensitive": 6}


def required_tasks(scenario: Scenario) -> list:
    if scenario.questions:
        return question_tasks(scenario)
    wanted = set(scenario.task_ids)
    return [task for task in all_tasks([scenario.dataset]) if task.id in wanted]


def task_score(task: UtilityTask, original: dict, candidate: dict):
    try:
        return task.fn(original, candidate).get("score")
    except (KeyError, ValueError, AttributeError, TypeError, IndexError, ZeroDivisionError):
        return None


def still_works(tasks: list, original: dict, candidate: dict) -> bool:
    return all((task_score(task, original, candidate) or 0.0) >= KEEP_SCORE for task in tasks)


def _quick_tasks(tasks: list) -> list:
    return [task for task in tasks if task.kind != "model"]


def _named_by_slow_tasks(tasks: list) -> set:
    return {part.strip().split(".")[-1] for task in tasks if task.kind == "model" for need in task.needs
            for part in need.replace("|", " ").replace("+", " ").split()}


def _without_table(candidate: dict, table: str) -> dict:
    return {name: frame for name, frame in candidate.items() if name != table}


def _without_column(candidate: dict, table: str, column: str) -> dict:
    trimmed = dict(candidate)
    trimmed[table] = candidate[table].drop(columns=column)
    return trimmed


def minimal_columns(scenario: Scenario, original: dict, labels: list, tasks: list) -> dict:
    """Backward elimination: drop each column unless a required task stops working."""
    cached = _read_cache(scenario)
    if cached is not None:
        return cached
    quick, slow_names = _quick_tasks(tasks), _named_by_slow_tasks(tasks)
    started = time.monotonic()
    candidate = dict(original)
    for table in list(candidate):
        trial = _without_table(candidate, table)
        if not (slow_names & set(candidate[table].columns)) and still_works(quick, original, trial):
            candidate = trial
    role_of = {label.key: label.role for label in labels}
    ranked = sorted(((table, column) for table, frame in candidate.items() for column in frame.columns),
                    key=lambda pair: ROLE_ORDER.get(role_of.get(f"{pair[0]}.{pair[1]}"), 9))
    for table, column in ranked:
        if time.monotonic() - started > TIME_BUDGET_SECONDS:
            break
        if column in slow_names:
            continue
        trial = _without_column(candidate, table, column)
        if still_works(quick, original, trial):
            candidate = trial
    needed = {table: list(frame.columns) for table, frame in candidate.items()}
    _write_cache(scenario, needed)
    return needed


def with_join_keys(needed: dict, tables: dict) -> dict:
    """Two kept tables stay linkable through a key that is unique in one of them."""
    linked = {table: list(columns) for table, columns in needed.items()}
    names = list(linked)
    for left in names:
        for right in names:
            if left == right:
                continue
            for column in set(tables[left].columns) & set(tables[right].columns):
                if tables[left][column].is_unique:
                    for table in (left, right):
                        if column not in linked[table]:
                            linked[table].append(column)
    return linked


def _cache_path(scenario: Scenario) -> Path:
    """Written questions are part of the key, so editing a scenario file never reuses a stale answer."""
    digest = hashlib.sha256(json.dumps([scenario.dataset, list(scenario.questions)], sort_keys=True).encode()).hexdigest()[:10]
    return CACHE_DIR / f"needs_{scenario.id}_{digest}.json"


def _read_cache(scenario: Scenario):
    path = _cache_path(scenario)
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else None


def _write_cache(scenario: Scenario, needed: dict) -> None:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    _cache_path(scenario).write_text(json.dumps(needed, indent=1), encoding="utf-8")


def tasks_using(table: str, column: str, tasks: list) -> list:
    return [task.id for task in tasks if column in " ".join(task.needs) or table in task.table]


