from pydantic import BaseModel


class RecordColumnOut(BaseModel):
    """A released column, the technique that made it and the source column it came from. Empty for answer tables."""

    name: str
    technique: str
    source: str
    role: str
