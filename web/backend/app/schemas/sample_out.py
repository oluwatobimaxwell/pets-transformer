from pydantic import BaseModel


class SampleOut(BaseModel):
    """A challenge dataset that can be used without uploading anything."""

    name: str
    tables: list[str]
    size_mb: float
