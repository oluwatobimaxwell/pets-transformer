"""What the command line prints."""
from __future__ import annotations

from pathlib import Path

import pandas as pd

from ..domain.run_result import RunResult



def print_labels(labels: list) -> None:
    for label in labels:
        flag = "  needs review" if label.needs_review else ""
        print(f"{label.key:<46} {label.role:<22} {label.subtype:<18} {label.confidence:>5.2f}{flag}")


def write_labels(labels: list, dataset: str, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    pd.DataFrame([{"dataset": dataset, "table": l.table, "column": l.column, "privacy_role": l.role, "subtype": l.subtype,
                   "confidence": l.confidence, "needs_review": l.needs_review} for l in labels]).to_csv(target, index=False)


def print_result(result: RunResult) -> None:
    print(f"\nStatus: {result.status}")
    for verdict in result.verdicts:
        print(f"Attempt {verdict.attempt}: {verdict.status}")
        for failure in verdict.failures:
            print(f"  - {failure.name}: {failure.detail}")
    scores = result.summary.get("scores")
    if scores:
        print(f"Self-assessment: privacy {scores['privacy']:.2f}, utility {scores['utility']:.2f}, composite {scores['composite']:.2f}")
    rows = result.summary.get("rows") or {}
    if rows:
        print(f"Rows kept: {rows['kept']:,} of {rows['total']:,}")
    for task in result.summary.get("tasks", []):
        print(f"  {task['id']}: {'not answerable' if task['score'] is None else format(task['score'], '.2f')}")
    for risk in result.summary.get("top_risks", []):
        print(f"  Risk that remains, {risk['risk']}: {risk['value']:.2f}")
    print(f"Evidence: {result.out_dir / 'evidence'}")
    print(f"Dashboard: {result.out_dir / 'evidence' / 'dashboard.html'}")
