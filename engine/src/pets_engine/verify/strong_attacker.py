"""Our own stronger attacker, standing in for the organisers' hidden ones.

It targets people known to be in the release and assumes the attacker knows their clue columns exactly, as the
method is public. It then adds side facts an insider could know, such as urgency level or a rough length of stay,
with numbers only known to within a tenth of their range. A target is singled out when exactly one released row matches.
"""
from __future__ import annotations

import pandas as pd

TARGETS = 2000
SEED = 13
APPROXIMATE_BINS = 10
SIDE_ROLES = ("sensitive_attribute", "non_sensitive")
SKIP_PETS = ("remove", "redact_text", "keyed_pseudonym", "prefix_ip")


def _approximate(series: pd.Series) -> pd.Series:
    numbers = pd.to_numeric(series, errors="coerce")
    if numbers.notna().mean() < 0.9 or numbers.nunique() <= APPROXIMATE_BINS:
        return series.astype(str)
    return pd.qcut(numbers.rank(method="first"), APPROXIMATE_BINS, labels=False).astype(str)


def _singled_out(known: pd.DataFrame, targets: pd.Index) -> float:
    sizes = known.astype(str).groupby(list(known.columns), sort=False)[known.columns[0]].transform("size")
    return float((sizes.loc[targets] == 1).mean())


def attack_table(frame: pd.DataFrame, clues: list, side_facts: list) -> dict:
    if not clues or frame.empty:
        return {}
    targets = frame.sample(min(TARGETS, len(frame)), random_state=SEED).index
    known = frame[clues].copy()
    result = {"clues": clues, "clues_only": _singled_out(known, targets), "with_one_fact": {}}
    for fact in side_facts:
        result["with_one_fact"][fact] = _singled_out(known.assign(**{fact: _approximate(frame[fact])}), targets)
    everything = known.assign(**{fact: _approximate(frame[fact]) for fact in side_facts})
    result["with_all_facts"] = _singled_out(everything, targets) if side_facts else result["clues_only"]
    return result


def stronger_attacker(release: dict, plan: list, labels: list) -> dict:
    roles = {label.key: label.role for label in labels}
    report = {}
    for table, frame in release.items():
        mine = [c for c in plan if c.table == table and c.pet not in SKIP_PETS]
        clues = [c.output_column for c in mine if c.tunable]
        facts = [c.output_column for c in mine if not c.tunable and roles.get(c.key) in SIDE_ROLES and c.output_column in frame.columns]
        found = attack_table(frame, clues, facts)
        if found:
            report[table] = found
    return report
