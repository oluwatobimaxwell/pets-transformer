from pydantic import BaseModel

from app.schemas.preview_column_out import PreviewColumnOut


class PreviewOut(BaseModel):
    """A few rows of a run, following the gate. No columns until Select decides. `before` only for synthetic challenge data."""

    table: str
    synthetic: bool
    rows: int
    columns: list[PreviewColumnOut]
