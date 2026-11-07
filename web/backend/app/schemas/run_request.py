from pydantic import BaseModel

from app.schemas.custom_scenario_in import CustomScenarioIn
from app.schemas.review_decision_in import ReviewDecisionIn


class RunRequest(BaseModel):
    """Start a release: which data, for whom, and any decisions a person made about columns."""

    dataset_id: str
    scenario_id: str | None = None
    custom: CustomScenarioIn | None = None
    review: dict[str, ReviewDecisionIn] = {}
