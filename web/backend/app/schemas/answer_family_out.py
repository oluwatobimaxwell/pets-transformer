from pydantic import BaseModel


class AnswerFamilyOut(BaseModel):
    """A family of published questions, how many there are, its share of the budget and the noise it gets."""

    questions: str
    count: int
    epsilon: float
    noise: str
