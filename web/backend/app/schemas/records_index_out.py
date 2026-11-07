from pydantic import BaseModel


class RecordsIndexOut(BaseModel):
    """Whether rows were released, held for review or not written ("none"), and the names of their tables."""

    status: str
    tables: list[str]
    limit: int
