"""A few rows of a run before and after the gate, for the wizard's live table.

The preview follows the gate as it works: the columns it keeps as soon as Select decides, then the protected values
once the first attempt is written, and the manifest's final word when it decides.

Original values are shown only for the challenge's synthetic datasets, which describe fictional people. For uploaded
data the preview holds protected values alone, so the API still never serves a real person's original data.
"""

import json
from pathlib import Path

import pandas as pd

from pets_eval import io
from pets_engine.utils.tables import read_text_table

from app.config import settings
from app.services import datasets
from app.services.run_job import RunJob

PREVIEW_ROWS = 6
PLANS = (Path("evidence") / "manifest.json", Path("plan.json"))  # the final word first, then the plan while the gate works
RELEASED = ("release", "staged")  # the released data, or the copy being checked or held for review
# The engine may be writing or moving a file between two reads. The next poll catches up, so treat it as not there yet.
IN_FLUX = (FileNotFoundError, json.JSONDecodeError, KeyError, ValueError, pd.errors.EmptyDataError)
NOTHING_YET = {"table": "", "synthetic": False, "rows": 0, "columns": []}


def _kept_fields(run_dir: Path) -> list:
    for name in PLANS:
        try:
            fields = json.loads((run_dir / name).read_text(encoding="utf-8"))["fields"]
        except IN_FLUX:
            continue
        return [field for field in fields if field["pet"] != "remove"]
    return []


def _main_table(fields: list) -> tuple:
    """The table with the most columns that leave, and those columns."""
    by_table: dict = {}
    for field in fields:
        by_table.setdefault(field["field"].split(".", 1)[0], []).append(field)
    table = max(by_table, key=lambda name: len(by_table[name]))
    return table, by_table[table]


def _protected_rows(run_dir: Path, table: str, originals: pd.DataFrame, key: str | None):
    """The protected rows behind the original rows shown, through the run's row map. A row the gate withheld is empty.
    Without a row map to follow, the first protected rows."""
    try:
        path = next((run_dir / name / f"{table}.csv" for name in RELEASED if (run_dir / name / f"{table}.csv").exists()), None)
        if path is None:
            return None
        protected = read_text_table(path)
        if key is None:
            return protected.head(len(originals)).reset_index(drop=True)
        rowmap = read_text_table(run_dir / "private" / f"rowmap_{table}.csv").drop_duplicates("original_record_id")
        rows = rowmap.set_index("original_record_id")["protected_row"].astype(int).reindex(originals[key].astype(str))
        return protected.reindex(rows.to_numpy()).reset_index(drop=True)
    except IN_FLUX:
        return None


def _values(frame: pd.DataFrame | None, column: str) -> list | None:
    if frame is None or column not in frame.columns:
        return None
    return [None if pd.isna(value) else value for value in frame[column]]


def preview(job: RunJob) -> dict:
    fields = _kept_fields(job.folder)
    if not fields:
        return NOTHING_YET
    table, kept = _main_table(fields)
    record = datasets.load(job.dataset_id)
    data_dir = Path(record["data_dir"])
    originals = read_text_table(data_dir / f"{table}.csv", PREVIEW_ROWS)
    key = io.record_key(io.load_catalog(settings.package_root), data_dir.name, table, originals) if record["source"] == "sample" else None
    synthetic = key is not None
    after = _protected_rows(job.folder, table, originals, key)
    columns = []
    for field in kept:
        source, output = field["field"].split(".", 1)[1], field["output_column"]
        columns.append({"field": field["field"], "output_column": output, "technique": field["pet"], "role": field.get("role", ""),
                        "before": _values(originals, source) if synthetic else None, "after": _values(after, output)})
    return {"table": table, "synthetic": synthetic, "rows": len(originals), "columns": columns}
