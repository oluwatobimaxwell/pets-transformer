from pydantic import BaseModel


class ComparisonRowOut(BaseModel):
    """One answer to a required question, asked of the original data and of the protected data."""

    label: str
    before: float | str | None = None
    after: float | str | None = None
