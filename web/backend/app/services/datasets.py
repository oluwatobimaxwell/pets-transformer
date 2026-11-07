"""Registers data for protection and reports what Detect sees in it."""

from pathlib import Path

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


async def register_upload(files: list[UploadFile]) -> dict:
    if not files:
        raise HTTPException(status_code=400, detail="Choose at least one CSV file.")
    dataset_id = new_id()
    data_dir = folder("datasets", dataset_id) / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    limit, total = settings.max_upload_mb * 1024 * 1024, 0
    for upload in files:
        if not (upload.filename or "").lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail=f"{upload.filename} isn't a CSV file.")
        with open(data_dir / f"{safe_name(upload.filename)}.csv", "wb") as out:
            while chunk := await upload.read(CHUNK):
                total += len(chunk)
                if total > limit:
                    raise HTTPException(status_code=413, detail=f"Uploads are limited to {settings.max_upload_mb} MB in total.")
                out.write(chunk)
    return _register(safe_name(files[0].filename) if len(files) == 1 else "upload", "upload", data_dir, dataset_id)


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
