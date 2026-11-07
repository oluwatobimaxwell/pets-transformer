from pydantic import BaseModel


class RiskOut(BaseModel):
    """One scorecard risk for one table, from 0 (none found) to 1 (every record exposed)."""

    table: str
    metric: str
    name: str
    meaning: str
    value: float
