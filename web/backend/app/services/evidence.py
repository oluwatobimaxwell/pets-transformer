"""A finished run's evidence for its page, read from the run's evidence folder. Only released or staged rows are served."""

from pathlib import Path

from fastapi import HTTPException

from pets_engine.domain.run_paths import RunPaths
from pets_engine.report.dashboard_data import evidence_data
from pets_engine.report.records import record_table


def evidence(run_dir: Path) -> dict:
    try:
        return evidence_data(run_dir)
    except FileNotFoundError as missing:
        raise HTTPException(status_code=404, detail="The evidence appears when the run finishes.") from missing


def records(run_dir: Path, table: str) -> dict:
    table_view = record_table(RunPaths(run_dir), evidence(run_dir)["fields"], table)
    if table_view is None:
        raise HTTPException(status_code=404, detail="This run released no table by that name.")
    return table_view
