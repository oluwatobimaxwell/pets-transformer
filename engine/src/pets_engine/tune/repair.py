"""Brings a removed column back when coarsening broke a required task.

Elimination can drop a column because another one could answer the task, and Tune can then coarsen that other column.
Only non-identifying columns come back, so a repair never reopens an identifier.
"""
from __future__ import annotations

from dataclasses import replace

from ..domain.scenario import Scenario
from ..select.selector import choice_for_needed
from ..select.task_needs import task_score
from ..utils.policy import policy

REPAIR_BELOW = 0.8
MIN_GAIN = 0.1
SAFE_ROLES = ("non_sensitive", "sensitive_attribute", "quasi_identifier")  # most harmless first; clue columns still go through Tune


def _candidates(plan: list, labels: dict, tables_in_use: set) -> list:
    removed = [c for c in plan if c.pet == "remove" and c.table in tables_in_use and labels[c.key].role in SAFE_ROLES]
    return sorted(removed, key=lambda c: SAFE_ROLES.index(labels[c.key].role))


def _groups(candidates: list, labels: dict) -> list:
    """Columns that only work together, such as latitude and longitude, come back as one."""
    grouped: dict = {}
    for choice in candidates:
        grouped.setdefault((choice.table, labels[choice.key].subtype), []).append(choice)
    singles = [[choice] for choice in candidates]
    return singles + [group for group in grouped.values() if len(group) > 1]


def _with_columns(plan: list, group: list, labels: dict, scenario: Scenario, task_id: str) -> list:
    restored = {c.key: replace(choice_for_needed(labels[c.key], scenario, set(), [task_id]), why=f"brought back because {task_id} failed without it") for c in group}
    return [restored.get(c.key, c) for c in plan]


def _levels_for(trial: list, levels: dict) -> dict:
    """A restored clue column starts at the mildest setting on its dial."""
    ladders = policy()["ladders"]
    return {**{c.params["subtype"]: ladders.get(c.params["subtype"], ladders["DEFAULT"])[0] for c in trial if c.tunable}, **levels}


def repair_plan(transformer, plan: list, labels: list, levels: dict, tasks: list, original: dict, scenario: Scenario) -> tuple:
    by_key = {label.key: label for label in labels}
    repaired = []
    for task in tasks:
        score = task_score(task, original, transformer.build(_levels_for(plan, levels))) or 0.0
        if score >= REPAIR_BELOW:
            continue
        in_use = {c.table for c in plan if c.pet != "remove"}
        for group in _groups(_candidates(plan, by_key, in_use), by_key):
            trial = _with_columns(plan, group, by_key, scenario, task.id)
            transformer.use_plan(trial)
            improved = task_score(task, original, transformer.build(_levels_for(trial, levels))) or 0.0
            if improved >= score + MIN_GAIN:
                plan, score = trial, improved
                repaired.append(f"{', '.join(c.key for c in group)} for {task.id}")
                if score >= REPAIR_BELOW:
                    break
            else:
                transformer.use_plan(plan)
    return plan, repaired
