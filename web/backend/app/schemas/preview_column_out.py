from pydantic import BaseModel


class PreviewColumnOut(BaseModel):
    """One column that leaves: where it came from, its technique, and its first values before and after.

    `after` is empty until the protected rows are written; a single empty value is a row the gate withheld.
    """

    field: str
    output_column: str
    technique: str
    role: str
    before: list[str] | None = None
    after: list[str | None] | None = None
