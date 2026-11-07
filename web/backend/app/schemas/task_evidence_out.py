from pydantic import BaseModel

from app.schemas.comparison_row_out import ComparisonRowOut
from app.schemas.named_value_out import NamedValueOut
from app.schemas.score_band_out import ScoreBandOut


class TaskEvidenceOut(BaseModel):
    """A question the recipient must still be able to answer, how it's scored, and both answers side by side."""

    id: str
    question: str
    scoring: str
    needs: str
    score: float | None
    band: ScoreBandOut
    metric: str
    detail: list[NamedValueOut]
    comparison: list[ComparisonRowOut]
    change: str
    note: str
