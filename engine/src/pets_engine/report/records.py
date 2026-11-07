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


def record_table(paths: RunPaths, fields: list, name: str) -> dict | None:
    """One released or staged table: its size, its columns with the technique behind each, and a sample of its rows."""
    folder, _ = records_folder(paths)
    path = next((p for p in table_files(Path(folder)) if p.stem == name), None) if folder else None
    if path is None:
        return None
    frame = read_text_table(path)
    shown = _sample(frame)
    return {"name": name, "total": len(frame), "shown": len(shown), "columns": _column_notes(name, list(frame.columns), fields),
            "rows": shown.values.tolist()}


def records_index(paths: RunPaths) -> dict:
    """Whether rows were released, held or not written, and the names of their tables, without reading any of them."""
    folder, status = records_folder(paths)
    return {"status": status, "tables": [path.stem for path in table_files(Path(folder))] if folder else [], "limit": ROWS_PER_TABLE}


def records_view(paths: RunPaths, fields: list) -> dict:
    index = records_index(paths)
    return {**index, "tables": [record_table(paths, fields, name) for name in index["tables"]]}
