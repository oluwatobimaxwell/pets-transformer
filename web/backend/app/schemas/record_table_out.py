from typing import Any

from pydantic import BaseModel

from app.schemas.record_column_out import RecordColumnOut


class RecordTableOut(BaseModel):
    """A released or staged table: how many rows it has and a random sample of them, in column order."""

    name: str
    total: int
    shown: int
    columns: list[RecordColumnOut]
    rows: list[list[Any]]
