"""Differentially private answers: the Laplace mechanism with each person's contribution bounded.

Guarantee, stated so it can be checked:
- unit of privacy: one person; each adds at most `bound` records, chosen at random, and the rest are left out;
- a family is a set of questions with the same kind and filter fields, so each record falls in at most one of its cells;
- counts: L1 sensitivity `bound`, so Laplace noise of scale bound / epsilon_family;
- means: values clipped to the question's bounds and centred on their midpoint, then a noisy sum and a noisy count, each
  with half the family's budget;
- families add up (sequential composition), so the total epsilon is the sum, with delta = 0.
Answers are rounded and clamped after the noise, which costs no privacy.
"""
from __future__ import annotations

import math

import numpy as np
import pandas as pd

ROW_UNIT = "row:"


def family_key(query: dict) -> tuple:
    return query["type"], query.get("value", ""), tuple(sorted(query["filters"])), tuple(query.get("bounds", ()))


def families(queries: list) -> dict:
    grouped: dict = {}
    for query in queries:
        grouped.setdefault(family_key(query), []).append(query)
    return grouped


def budget_split(grouped: dict, epsilon: float) -> dict:
    """More budget to families with more questions, by the square root of their size. It uses only the question list, never the data."""
    weights = {key: math.sqrt(len(queries)) for key, queries in grouped.items()}
    total = sum(weights.values())
    return {key: epsilon * weight / total for key, weight in weights.items()}


def bound_contributions(fields: pd.DataFrame, people: pd.Series, bound: int, rng: np.random.Generator) -> pd.DataFrame:
    """At most `bound` records per person. Records with no person ID count as a person each."""
    units = people.astype(str).str.strip()
    units = units.where(units != "", ROW_UNIT + units.index.astype(str))
    order = rng.permutation(len(fields))
    kept = units.iloc[order].groupby(units.iloc[order]).cumcount() < bound
    return fields.iloc[order][kept.to_numpy()].sort_index()


def _cells(fields: pd.DataFrame, keys: tuple) -> list:
    return [fields[key].astype(str) for key in keys]


def _cell_of(query: dict, keys: tuple):
    values = tuple(str(query["filters"][key]) for key in keys)
    return values[0] if len(values) == 1 else values


def _count_answers(fields, queries, keys, epsilon, bound, rng):
    counts = fields.groupby(_cells(fields, keys)).size()
    noisy = {}
    for query in queries:
        cell = _cell_of(query, keys)
        if cell not in noisy:
            noisy[cell] = max(0.0, float(round(counts.get(cell, 0) + rng.laplace(0, bound / epsilon))))
        yield query, noisy[cell]


def _mean_answers(fields, queries, keys, value, bounds, epsilon, bound, rng):
    low, high = bounds
    middle, half = (low + high) / 2, (high - low) / 2
    present = fields[pd.to_numeric(fields[value], errors="coerce").notna()]
    centred = pd.to_numeric(present[value]).clip(low, high) - middle
    sums = centred.groupby(_cells(present, keys)).sum()
    sizes = centred.groupby(_cells(present, keys)).size()
    noisy = {}
    for query in queries:
        cell = _cell_of(query, keys)
        if cell not in noisy:
            total = sums.get(cell, 0.0) + rng.laplace(0, bound * half / (epsilon / 2))
            size = sizes.get(cell, 0) + rng.laplace(0, bound / (epsilon / 2))
            noisy[cell] = float(np.clip(middle + total / max(size, 1.0), low, high))
        yield query, noisy[cell]


def noisy_answers(fields: pd.DataFrame, queries: list, epsilon: float, bound: int, rng: np.random.Generator) -> tuple:
    """Returns the answers as rows of id, value and description, and the budget each family received."""
    grouped = families(queries)
    budgets = budget_split(grouped, epsilon)
    rows = []
    for key, members in grouped.items():
        kind, value, filters, bounds = key
        if any(f not in fields.columns for f in filters) or (kind == "mean" and value not in fields.columns):
            continue
        answers = (_count_answers(fields, members, filters, budgets[key], bound, rng) if kind == "count"
                   else _mean_answers(fields, members, filters, value, bounds, budgets[key], bound, rng))
        rows += [{"id": q["id"], "value": a, "description": q.get("description", "")} for q, a in answers]
    return pd.DataFrame(rows, columns=["id", "value", "description"]), budgets
