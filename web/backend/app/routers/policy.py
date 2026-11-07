from fastapi import APIRouter

from pets_engine.select.selector import technique_rules

from app.schemas.technique_rules_out import TechniqueRulesOut

router = APIRouter()


@router.get("/techniques/", response_model=TechniqueRulesOut)
def get_technique_rules():
    return technique_rules()
