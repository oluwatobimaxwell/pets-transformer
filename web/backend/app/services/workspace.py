"""Where uploads and runs live on disk. Nothing here is ever served except through the routers' allow-list."""

import json
import os
import re
import uuid
from pathlib import Path

from fastapi import HTTPException

from app.config import settings

_ID = re.compile(r"^[a-f0-9]{12}$")
_SAFE_NAME = re.compile(r"[^A-Za-z0-9_-]+")


def new_id() -> str:
    return uuid.uuid4().hex[:12]


def safe_name(name: str) -> str:
    """A file or table name with nothing that could step outside its folder."""
    cleaned = _SAFE_NAME.sub("_", Path(name).stem).strip("_")
    return cleaned[:60] or "table"


def folder(kind: str, item_id: str) -> Path:
    if not _ID.match(item_id):
        raise HTTPException(status_code=404, detail=f"No {kind[:-1]} with that id.")
    return settings.workspace / kind / item_id


def read_record(path: Path) -> dict:
    if not path.exists():
        raise HTTPException(status_code=404, detail="Not found.")
    return json.loads(path.read_text(encoding="utf-8"))


def write_record(path: Path, record: dict) -> None:
    """Written beside the record first, then swapped in whole, so a reader polling it never sees half a file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{uuid.uuid4().hex[:8]}.tmp")
    temporary.write_text(json.dumps(record, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    os.replace(temporary, path)
