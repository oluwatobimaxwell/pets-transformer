from typing import Literal

from pydantic import BaseModel


class QuestionIn(BaseModel):
    """A question the recipient must still be able to answer. Columns are written as table.column."""

    ask: str = ""
    kind: Literal["median", "mean", "count", "correlation", "distribution"]
    columns: list[str] = []
    by: list[str] = []
