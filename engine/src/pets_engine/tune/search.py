"""Finds the settings with the least data loss that still meets the privacy bar, using real task scores."""
from __future__ import annotations

from itertools import product

from ..domain.scenario import Scenario
from ..domain.tune_result import TuneResult
from ..select.standard_checks import STANDARD
from ..select.task_needs import task_score
from ..utils.policy import policy
from .k_check import share_below_k
from .levels import LOSS

MAX_COMBINATIONS = 4000
TASK_TRIALS = 8
UTILITY_MARGIN = 0.01
SUPPRESSION_COST = 50  # losing 1% of rows costs about as much as one coarser step on a dial


def clue_columns(plan: list, table: str) -> list:
    return [c.output_column for c in plan if c.table == table and c.tunable]


def _dials(plan: list, scenario: Scenario) -> dict:
    fixed = policy()["scenario_overrides"].get(scenario.id, {}).get("fixed_levels", {})
    ladders = policy()["ladders"]
    subtypes = sorted({c.params["subtype"] for c in plan if c.tunable})
    return {s: [fixed[s]] if s in fixed else ladders.get(s, ladders["DEFAULT"]) for s in subtypes}


def _worst_below_k(release: dict, plan: list, k: int) -> float:
    return max((share_below_k(frame, clue_columns(plan, table), k) for table, frame in release.items()), default=0.0)


def _combinations(dials: dict) -> list:
    names = list(dials)
    combos = [dict(zip(names, values)) for values in product(*(dials[n] for n in names))]
    return combos[:MAX_COMBINATIONS]


def _mean_utility(tasks: list, original: dict, release: dict) -> float:
    scores = [task_score(task, original, release) or 0.0 for task in tasks]
    return sum(scores) / max(len(scores), 1)


def _shortlist(transformer, plan: list, combos: list, k: int) -> list:
    measured = []
    for levels in combos:
        below = _worst_below_k(transformer.build(levels), plan, k)
        measured.append((below, sum(LOSS.get(level, 3) for level in levels.values()), levels))
    limit = policy()["gate"]["max_suppressed_rows"]
    feasible = [m for m in measured if m[0] <= limit] or measured
    return sorted(feasible, key=lambda m: m[1] + m[0] * SUPPRESSION_COST)[:TASK_TRIALS]


def _gentlest_settings(transformer, dials: dict, tasks: list, original: dict) -> TuneResult:
    """With no k bar, start from the most detail and coarsen each dial only while the tasks hold.

    Standard checks compare shapes at the release's own detail, so they can't see detail being lost. With only those, nothing is coarsened.
    """
    levels = {name: ladder[0] for name, ladder in dials.items()}
    if all(task.kind == STANDARD for task in tasks):
        return TuneResult(levels, 0.0, round(_mean_utility(tasks, original, transformer.build(levels)), 4) if tasks else 0.0, 1, [])
    best = _mean_utility(tasks, original, transformer.build(levels))
    scored = [{"levels": dict(levels), "below_k": 0.0, "utility": round(best, 4)}]
    for name, ladder in dials.items():
        for level in ladder[1:]:
            trial = {**levels, name: level}
            utility = _mean_utility(tasks, original, transformer.build(trial))
            scored.append({"levels": trial, "below_k": 0.0, "utility": round(utility, 4)})
            if utility < best - UTILITY_MARGIN:
                break
            levels = trial
    return TuneResult(levels, 0.0, round(_mean_utility(tasks, original, transformer.build(levels)), 4), len(scored), scored)


def tune(transformer, plan: list, scenario: Scenario, tasks: list, original: dict) -> TuneResult:
    dials = _dials(plan, scenario)
    k = scenario.k_required
    if not k:
        return _gentlest_settings(transformer, dials, tasks, original)
    combos = _combinations(dials)
    scored = []
    for below, _, levels in _shortlist(transformer, plan, combos, k):
        utility = _mean_utility(tasks, original, transformer.build(levels))
        scored.append({"levels": levels, "below_k": round(below, 4), "utility": round(utility, 4)})
    best = max(scored, key=lambda s: s["utility"] - s["below_k"] * 0.5)
    return TuneResult(best["levels"], best["below_k"], best["utility"], len(combos), scored)
