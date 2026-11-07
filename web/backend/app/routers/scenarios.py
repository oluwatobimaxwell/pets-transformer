from fastapi import APIRouter

from app.schemas.scenario_out import ScenarioOut
from app.services import scenarios

router = APIRouter()


@router.get("/", response_model=list[ScenarioOut])
def list_scenarios(dataset: str | None = None):
    return scenarios.challenge_scenarios(dataset)
