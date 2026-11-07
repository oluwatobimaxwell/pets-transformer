"""When nobody wrote questions, check that every kept column keeps its shape. This can't tell how much detail a recipient needs."""
from __future__ import annotations

from pets_eval.utility import UtilityTask

from .questions import shape_check

STANDARD = "standard"
CHECKED_ROLES = ("quasi_identifier", "sensitive_attribute", "non_sensitive")


def standard_tasks(plan: list, labels: list) -> list:
    roles = {label.key: label.role for label in labels}
    kept = [c for c in plan if c.pet not in ("remove", "redact_text", "keyed_pseudonym", "prefix_ip") and roles.get(c.key) in CHECKED_ROLES]
    return [UtilityTask(f"S{n}", "", c.table, f"{c.column} keeps its shape", STANDARD, shape_check(c.table, c.column, c.output_column),
                        needs=[c.column]) for n, c in enumerate(kept, start=1)]
