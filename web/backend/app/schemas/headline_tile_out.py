from pydantic import BaseModel


class HeadlineTileOut(BaseModel):
    """One headline number of a release. `format` says how to show `value`: score, percent, count (of `total`) or epsilon."""

    label: str
    value: float
    format: str
    meaning: str
    total: int | None = None
