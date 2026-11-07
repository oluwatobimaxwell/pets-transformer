from pydantic import BaseModel


class NamedValueOut(BaseModel):
    """A measurement behind a score, such as "rel error: 0.0006"."""

    name: str
    value: float | str
