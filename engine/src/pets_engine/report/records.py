"""A sample of the protected rows for the records browser. It reads only what was released or staged, never private files."""
from __future__ import annotations

from pathlib import Path

import pandas as pd

from ..domain.run_paths import RunPaths
from ..utils.tables import read_text_table, table_files

ROWS_PER_TABLE = 5000
SEED = 11


def records_folder(paths: RunPaths) -> tuple:
    if paths.release.exists():
        return paths.release, "released"
    if paths.staged.exists():
        return paths.staged, "held"
    return None, "none"


def _column_notes(table: str, columns: list, fields: list) -> list:
    by_output = {(f["field"].split(".")[0], f["output_column"]): f for f in fields if f["pet"] != "remove"}
    notes = []
    for column in columns:
        field = by_output.get((table, column), {})
        notes.append({"name": column, "technique": field.get("pet", "").replace("_", " "), "source": field.get("field", ""),
                      "role": field.get("role", "").replace("_", " ")})
    return notes


def _sample(frame: pd.DataFrame) -> pd.DataFrame:
    return frame.sample(min(ROWS_PER_TABLE, len(frame)), random_state=SEED) if len(frame) > ROWS_PER_TABLE else frame


def records_view(paths: RunPaths, fields: list) -> dict:
    folder, status = records_folder(paths)
    if folder is None:
        return {"status": status, "tables": []}
    tables = []
    for path in table_files(Path(folder)):
        frame = read_text_table(path)
        shown = _sample(frame)
        tables.append({"name": path.stem, "total": len(frame), "shown": len(shown), "columns": _column_notes(path.stem, list(frame.columns), fields),
                       "rows": shown.values.tolist()})
    return {"status": status, "tables": tables, "limit": ROWS_PER_TABLE}
