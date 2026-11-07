"""Gate checks for a public release made of answers, not rows."""
from __future__ import annotations

from pathlib import Path

from ..domain.check import BLOCK, REVIEW, Check

ANSWER_FILE = "dp_answers.csv"


def answers_only_check(folder: Path) -> Check:
    others = sorted(f.name for f in folder.glob("*") if f.name != ANSWER_FILE)
    return Check("Only answers leave, no rows", not others, BLOCK, ", ".join(others) or f"The release holds {ANSWER_FILE} alone.")


def budget_check(spent: float, limit: float) -> Check:
    return Check("Privacy budget within the limit", spent <= limit + 1e-9, BLOCK, f"epsilon {spent:g} spent of {limit:g} allowed, delta 0")


def person_unit_check(person_column: str | None, bound: int) -> Check:
    if person_column:
        return Check("Each person counts a bounded number of times", True, REVIEW,
                     f"Unit of privacy: one person, by {person_column}, adding at most {bound} records.")
    return Check("Each person counts a bounded number of times", False, REVIEW,
                 "No person ID was found, so the unit of privacy is one record. Someone with many records is less protected.")
