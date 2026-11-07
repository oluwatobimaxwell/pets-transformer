from pydantic import BaseModel


class FieldEvidenceOut(BaseModel):
    """One source column: what Detect saw, the technique Select chose, why, and which questions need it."""

    field: str
    role: str
    subtype: str | None = None
    confidence: float | None = None
    detected_by: str = ""
    evidence: list[str] = []
    needs_review: bool = False
    pet: str
    output_column: str = ""
    why: str
    needed_by: list[str] = []
