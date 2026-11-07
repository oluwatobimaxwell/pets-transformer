"""Rows that still stand out lose one clue value at a time instead of the whole row.

Each step blanks one clue column, only in rows whose group is still smaller than k, and the column chosen is the one that
keeps the required questions best answered. A blank is its own value for the look-alike check, so blanked rows group together.
Rows that stand out even with every clue blanked are left for suppression.
"""
from __future__ import annotations

from operator import itemgetter

from .k_check import group_sizes
from .search import clue_columns, mean_utility

BLANK = ""


def _blank_small_groups(frame, columns: list, column: str, k: int):
    small = group_sizes(frame, columns) < k
    out = frame.copy()
    out.loc[small, column] = BLANK
    return out, int(small.sum())


def recode_table(release: dict, table: str, plan: list, k: int, tasks: list, originals: dict) -> tuple:
    """Returns the table with values blanked, and the steps taken."""
    columns = clue_columns(plan, table)
    frame, steps, remaining = release[table], [], list(columns)
    while remaining and bool((group_sizes(frame, columns) < k).any()):
        trials = []
        for column in remaining:
            candidate, rows = _blank_small_groups(frame, columns, column, k)
            trials.append((mean_utility(tasks, originals, {**release, table: candidate}), column, candidate, rows))
        utility, column, frame, rows = max(trials, key=itemgetter(0))
        steps.append({"column": column, "rows": rows, "utility": round(utility, 4)})
        remaining.remove(column)
    return frame, steps


def recode_release(release: dict, plan: list, k: int, tasks: list, originals: dict) -> tuple:
    recoded, log = dict(release), {}
    for table in release:
        if k and clue_columns(plan, table):
            recoded[table], steps = recode_table(recoded, table, plan, k, tasks, originals)
            if steps:
                log[table] = steps
    return recoded, log
