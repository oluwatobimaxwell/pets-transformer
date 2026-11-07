from pydantic import BaseModel

from app.schemas.answer_family_out import AnswerFamilyOut


class AnswersOut(BaseModel):
    """For a public release, which gets noisy answers instead of rows: the guarantee in plain lines and the budget per family."""

    guarantee: list[str]
    families: list[AnswerFamilyOut]
