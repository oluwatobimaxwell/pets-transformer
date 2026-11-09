"""Registers data for protection and reports what Detect sees in it."""

import codecs
import shutil
from pathlib import Path

import pandas as pd
from fastapi import HTTPException, UploadFile

from pets_engine.detect.detector import ColumnDetector
from pets_engine.detect.labelling import label_tables
from pets_engine.utils.tables import read_text_table, read_text_tables, table_files

from app.config import settings
from app.services.workspace import folder, new_id, read_record, safe_name, write_record

RECORD, LABELS, PREVIEW_ROWS = "dataset.json", "columns.json", 5
CHUNK = 1024 * 1024


def samples() -> list:
    data = settings.package_root / "data"
    if not data.exists():
        return []
    found = []
    for path in sorted(p for p in data.iterdir() if p.is_dir()):
        files = table_files(path)
        if files:
            found.append({"name": path.name, "tables": [f.stem for f in files], "size_mb": round(sum(f.stat().st_size for f in files) / 1e6, 1)})
    return found


def _tables(data_dir: Path) -> list:
    return [{"name": f.stem, "columns": list(read_text_table(f, PREVIEW_ROWS).columns)} for f in table_files(data_dir)]


def _register(name: str, source: str, data_dir: Path, dataset_id: str) -> dict:
    record = {"id": dataset_id, "name": name, "source": source, "data_dir": str(data_dir)}
    write_record(folder("datasets", dataset_id) / RECORD, record)
    return {**record, "tables": _tables(data_dir)}


def register_sample(name: str) -> dict:
    data_dir = settings.package_root / "data" / safe_name(name)
    if not table_files(data_dir):
        raise HTTPException(status_code=404, detail=f"No sample dataset called {name}.")
    return _register(data_dir.name, "sample", data_dir, new_id())


def _table_names(files: list[UploadFile]) -> None:
    """Every file must be a CSV and become a table of its own. Two names that clean up the same would overwrite each
    other, and on macOS or Windows two that differ only in case are the same file."""
    seen: dict = {}
    for upload in files:
        filename = upload.filename or ""
        if not filename.lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail=f"{filename} isn't a CSV file.")
        table = safe_name(filename)
        if table.casefold() in seen:
            raise HTTPException(status_code=400, detail=f"{seen[table.casefold()]} and {filename} would both become the table {table}. Rename one of them.")
        seen[table.casefold()] = filename


def _check_text(decoder, chunk: bytes, filename: str, final: bool = False) -> None:
    try:
        decoder.decode(chunk, final)
    except UnicodeDecodeError as error:
        raise HTTPException(status_code=400, detail=f"{filename} isn't saved as UTF-8 text. In Excel, save it as CSV UTF-8, then upload it again.") from error


def _check_table(path: Path, filename: str) -> None:
    try:
        read_text_table(path, PREVIEW_ROWS)
    except pd.errors.EmptyDataError as error:
        raise HTTPException(status_code=400, detail=f"{filename} is empty.") from error
    except pd.errors.ParserError as error:
        raise HTTPException(status_code=400, detail=f"{filename} can't be read as a table: {str(error).strip()}") from error


async def register_upload(files: list[UploadFile]) -> dict:
    if not files:
        raise HTTPException(status_code=400, detail="Choose at least one CSV file.")
    _table_names(files)
    dataset_id = new_id()
    root = folder("datasets", dataset_id)
    data_dir = root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    limit, total = settings.max_upload_mb * 1024 * 1024, 0
    try:
        for upload in files:
            path, decoder = data_dir / f"{safe_name(upload.filename)}.csv", codecs.getincrementaldecoder("utf-8")()
            with open(path, "wb") as out:
                while chunk := await upload.read(CHUNK):
                    total += len(chunk)
                    if total > limit:
                        raise HTTPException(status_code=413, detail=f"Uploads are limited to {settings.max_upload_mb} MB in total.")
                    _check_text(decoder, chunk, upload.filename)
                    out.write(chunk)
                _check_text(decoder, b"", upload.filename, final=True)
            _check_table(path, upload.filename)
        return _register(safe_name(files[0].filename) if len(files) == 1 else "upload", "upload", data_dir, dataset_id)
    except Exception:
        shutil.rmtree(root, ignore_errors=True)  # a refused upload leaves nothing half-written behind
        raise


def load(dataset_id: str) -> dict:
    record = read_record(folder("datasets", dataset_id) / RECORD)
    return {**record, "tables": _tables(Path(record["data_dir"]))}


def data_dir(dataset_id: str) -> Path:
    return Path(read_record(folder("datasets", dataset_id) / RECORD)["data_dir"])


def columns(dataset_id: str) -> list:
    """Detect is slow on big tables, so its answer is kept with the dataset."""
    cache = folder("datasets", dataset_id) / LABELS
    if cache.exists():
        return read_record(cache)["columns"]
    labels = label_tables(read_text_tables(data_dir(dataset_id)), ColumnDetector.load())
    found = [{**label.to_dict(), "key": label.key} for label in labels]
    write_record(cache, {"columns": found})
    return found
