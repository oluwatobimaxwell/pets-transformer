from pydantic import BaseModel


class ScoreBandOut(BaseModel):
    """The engine's reading of a score: a word such as "Close", its tone and what it means."""

    word: str
    tone: str
    meaning: str = ""
