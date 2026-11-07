from pydantic import BaseModel


class ColumnOut(BaseModel):
    """What Detect found in one column."""

    key: str
    table: str
    column: str
    role: str
    subtype: str
    confidence: float
    needs_review: bool
    reasons: list[str]
    best_guess_role: str
    best_guess_subtype: str
