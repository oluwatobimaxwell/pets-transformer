"""Turns a person's written questions into scored tasks, just like the challenge's own utility tasks."""
from __future__ import annotations

import numpy as np
import pandas as pd

from pets_eval.parse import score_from_rel_error, tvd
from pets_eval.utility import UtilityTask, not_answerable, result

from ..domain.scenario import Scenario
from ..utils.alignment import align_original, released_column
from ..utils.distributions import combined_key, distribution_shift
from ..utils.numbers import to_number

MIN_GROUP = 5
SHOWN_GROUPS = 10
ERROR_TOLERANCE = 0.5
SHIFT_TOLERANCE = 0.3
CORRELATION_TOLERANCE = 0.5


def _split(reference: str) -> tuple:
    table, column = reference.split(".", 1)
    return table, column


def _frames(original: dict, released: dict, table: str):
    return original.get(table), released.get(table)


def _group_keys(original: pd.DataFrame, released: pd.DataFrame, by: list):
    """Group labels for both versions at the release's level of detail, or the missing column."""
    left, right = [], []
    for reference in by:
        column = _split(reference)[1]
        shown = released_column(released, original[column], column) if column in original.columns else None
        if shown is None:
            return None, None, reference
        left.append(align_original(original[column], released[shown]))
        right.append(released[shown].astype(str))
    return combined_key(left), combined_key(right), None


def _grouped_statistic(question: dict):
    statistic = question["kind"]

    def fn(original: dict, released: dict) -> dict:
        table, column = _split(question["columns"][0])
        before, after = _frames(original, released, table)
        if after is None or column not in after.columns:
            return not_answerable([question["columns"][0]])
        left, right, missing = _group_keys(before, after, question["by"])
        if missing:
            return not_answerable([missing])
        values_before, values_after = to_number(before[column]), to_number(after[column])
        sizes = left.value_counts()
        groups = sizes[sizes >= MIN_GROUP].index
        stat_before = values_before.groupby(left).agg(statistic).reindex(groups)
        stat_after = values_after.groupby(right).agg(statistic).reindex(groups)
        errors = [abs(a - b) / max(abs(a), 1e-9) if not np.isnan(b) else 1.0 for a, b in zip(stat_before, stat_after)]
        error = float(np.mean(errors)) if errors else 1.0
        shown = sizes.reindex(groups).sort_values(ascending=False).index[:SHOWN_GROUPS]
        return result(score_from_rel_error(error, ERROR_TOLERANCE), f"mean relative error of the {statistic} per group (50% scores 0)",
                      rel_error=round(error, 4), orig=stat_before.reindex(shown).round(3).to_dict(), prot=stat_after.reindex(shown).round(3).to_dict())
    return fn


def _counts(question: dict):
    def fn(original: dict, released: dict) -> dict:
        table = _split(question["by"][0])[0]
        before, after = _frames(original, released, table)
        if after is None:
            return not_answerable([table])
        left, right, missing = _group_keys(before, after, question["by"])
        if missing:
            return not_answerable([missing])
        share_before, share_after = left.value_counts(normalize=True), right.value_counts(normalize=True)
        shift = tvd(left.value_counts(), right.value_counts())
        shown = share_before.index[:SHOWN_GROUPS]
        return result(1 - shift / SHIFT_TOLERANCE, "1 - shift in the share of rows per group / 0.3", tvd=round(shift, 4),
                      orig=share_before.reindex(shown).round(4).to_dict(), prot=share_after.reindex(shown).fillna(0).round(4).to_dict())
    return fn


def _correlation(question: dict):
    def fn(original: dict, released: dict) -> dict:
        (table, first), (_, second) = _split(question["columns"][0]), _split(question["columns"][1])
        before, after = _frames(original, released, table)
        if after is None or first not in after.columns or second not in after.columns:
            return not_answerable(question["columns"])
        rho_before = to_number(before[first]).corr(to_number(before[second]), method="spearman")
        rho_after = to_number(after[first]).corr(to_number(after[second]), method="spearman")
        return result(1 - abs(rho_before - rho_after) / CORRELATION_TOLERANCE, "1 - change in Spearman correlation / 0.5",
                      spearman_orig=round(float(rho_before), 4), spearman_prot=round(float(rho_after), 4))
    return fn


def shape_check(table: str, column: str, output: str | None = None):
    """Does one column keep its distribution? Used by `distribution` questions and by the standard checks."""
    def fn(original: dict, released: dict) -> dict:
        before, after = _frames(original, released, table)
        shown = output or (released_column(after, before[column], column) if after is not None and column in before.columns else None)
        if after is None or shown not in after.columns:
            return not_answerable([f"{table}.{column}"])
        shift = distribution_shift(before[column], after[shown])
        return result(1 - shift / SHIFT_TOLERANCE, "1 - shift in the distribution / 0.3", tvd=round(shift, 4))
    return fn


def _distribution(question: dict):
    return shape_check(*_split(question["columns"][0]))


BUILDERS = {"median": _grouped_statistic, "mean": _grouped_statistic, "count": _counts, "correlation": _correlation, "distribution": _distribution}


def _describe(question: dict) -> str:
    if question["ask"]:
        return question["ask"]
    columns = " and ".join(c.split(".")[1] for c in question["columns"])
    by = ", ".join(c.split(".")[1] for c in question["by"])
    return f"{question['kind'].capitalize()} of {columns}" + (f" by {by}" if by else "") if columns else f"Rows by {by}"


def question_tasks(scenario: Scenario) -> list:
    tasks = []
    for question in scenario.questions:
        columns = question["columns"] + question["by"]
        tasks.append(UtilityTask(question["id"], scenario.dataset, columns[0].split(".")[0], _describe(question), question["kind"],
                                 BUILDERS[question["kind"]](question), needs=[c.split(".")[1] for c in columns], scenarios=[scenario.id]))
    return tasks
