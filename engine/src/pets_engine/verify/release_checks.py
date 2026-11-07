"""Checks on the release itself. They work on any data, with or without the challenge package."""
from __future__ import annotations

import math
from pathlib import Path

import pandas as pd

from pets_eval.check import scan_path

from ..domain.check import BLOCK, INFO, REVIEW, Check
from ..tune.k_check import share_below_k
from ..tune.search import clue_columns
from ..utils.dates import TIME_SUBTYPES, to_moments

LIST_LIMIT = 5
MAX_CHANCE_OVERLAP = 0.005
MAX_ORDER_CORRELATION = 0.05
MIN_ROWS_FOR_ORDER = 50


def private_files_check(folder: Path) -> Check:
    leaked = [f.name for f in folder.glob("*") if f.name.startswith("rowmap_") or f.suffix in (".key", ".pem")]
    return Check("No private files in the release", not leaked, BLOCK, ", ".join(leaked) or "None found")


def leftover_identifiers_check(folder: Path, plan: list) -> Check:
    """Prefix-preserving addresses still look like addresses, so `protected_values_check` covers those instead."""
    found = scan_path(folder)
    shaped_like_original = {"IP_ADDRESS"} if any(choice.pet == "prefix_ip" for choice in plan) else set()
    counts = {name: amount for name, amount in found["totals"].items() if amount and name not in shaped_like_original}
    detail = ", ".join(f"{name}: {amount}" for name, amount in counts.items()) or "None found"
    return Check("No identifiers left in the output", not counts, BLOCK, detail)


def protected_values_check(originals: dict, release: dict, plan: list) -> Check:
    """Compares against the real values, which catches a technique that silently did nothing."""
    failing = []
    for choice in plan:
        if choice.pet not in ("keyed_pseudonym", "prefix_ip") or choice.table not in release:
            continue
        raw = set(originals[choice.table][choice.column].dropna().astype(str))
        shown = release[choice.table][choice.output_column].astype(str)
        overlap = float(shown[shown != ""].isin(raw).mean()) if len(shown) else 0.0
        if overlap > MAX_CHANCE_OVERLAP:
            failing.append(f"{choice.key}: {overlap:.1%}")
    return Check("Protected columns differ from the originals", not failing, BLOCK, ", ".join(failing[:LIST_LIMIT]) or "No original values found")


def row_order_check(originals: dict, sources: dict, labels: list) -> Check:
    """Released row position must not follow time, or position alone reveals roughly when each row happened."""
    following = []
    for table, positions in sources.items():
        times = [label.column for label in labels if label.table == table and label.subtype in TIME_SUBTYPES and label.column in originals[table].columns]
        for column in times:
            stamps = to_moments(originals[table].loc[positions, column]).reset_index(drop=True)
            if stamps.notna().sum() < MIN_ROWS_FOR_ORDER:
                continue
            rho = pd.Series(range(len(stamps))).corr(stamps.rank(), method="spearman")
            chance = max(MAX_ORDER_CORRELATION, 3 / math.sqrt(stamps.notna().sum()))  # a random order of n rows still wobbles by about 1/sqrt(n)
            if abs(rho) > chance:
                following.append(f"{table} follows {column} (correlation {rho:.2f})")
    return Check("Row order reveals nothing", not following, BLOCK, ", ".join(following[:LIST_LIMIT]) or "Released rows are not in time order")


def look_alike_check(release: dict, plan: list, k: int) -> Check:
    if not k:
        return Check("Look-alike rule", True, INFO, "This scenario states no k bar")
    worst = {table: share_below_k(frame, clue_columns(plan, table), k) for table, frame in release.items()}
    failing = {table: share for table, share in worst.items() if share > 0}
    detail = ", ".join(f"{table}: {share:.1%} of rows have fewer than {k} look-alikes" for table, share in failing.items())
    return Check("Look-alike rule", not failing, BLOCK, detail or f"Every row has at least {k} look-alikes")


def review_check(labels: list, plan: list) -> Check:
    kept = {choice.key for choice in plan if choice.pet != "remove"}
    open_items = [label.key for label in labels if label.needs_review and label.key in kept]
    return Check("Unsure columns reviewed", not open_items, REVIEW, ", ".join(open_items[:LIST_LIMIT]) or "No unsure column is kept")


def row_loss_check(kept_share: float, limit: float) -> Check:
    return Check("Row loss within limit", 1 - kept_share <= limit, REVIEW, f"{kept_share:.1%} of rows kept")


def repeat_visitor_note(frame, pseudonym: str, clues: list) -> Check:
    """Row-level k can't see that one key links a person's rows, so this states that risk as a number."""
    if pseudonym not in frame.columns or not clues:
        return Check("Risk across repeat records", True, INFO, "No person key in this table")
    linked = frame[frame[pseudonym].astype(str) != ""]
    paths = linked.groupby(pseudonym, sort=False)[clues].agg(lambda s: "|".join(sorted(s.astype(str))))
    repeaters = linked[pseudonym].value_counts()
    paths = paths.loc[repeaters[repeaters > 1].index]
    if paths.empty:
        return Check("Risk across repeat records", True, INFO, "No person appears twice")
    unique = paths.astype(str).agg("#".join, axis=1).value_counts()
    share = float((unique == 1).sum() / len(paths))
    return Check("Risk across repeat records", True, INFO, f"{share:.0%} of people with repeat records have a unique visit pattern; not covered by the row-level k check")
