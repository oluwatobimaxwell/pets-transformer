"""Plain wording for values blanked in rows that stood out, shared by the report and the dashboard."""
from __future__ import annotations


def recoding_lines(recoding: dict | None) -> list:
    lines = []
    for table, steps in (recoding or {}).items():
        done = ", then ".join(f"{step['column']} in {step['rows']:,} rows" for step in steps)
        lines.append(f"In {table}, rows that still stood out lost one clue instead of the whole row: {done}.")
    return lines
