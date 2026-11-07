from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.question_in import QuestionIn


class CustomScenarioIn(BaseModel):
    """A scenario written by the person releasing the data."""

    recipient: str = Field(min_length=1)
    purpose: str = ""
    trust_level: Literal["internal", "controlled_research", "contractual", "public"]
    k: int | None = Field(default=None, ge=2, le=100)
    questions: list[QuestionIn] = []
