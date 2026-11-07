from pydantic import BaseModel

from app.schemas.table_out import TableOut


class DatasetOut(BaseModel):
    """Data registered for protection: an upload, or a challenge sample."""

    id: str
    name: str
    source: str
    tables: list[TableOut]
