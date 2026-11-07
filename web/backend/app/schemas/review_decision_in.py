from pydantic import BaseModel


class ReviewDecisionIn(BaseModel):
    """A person's decision about one column, overriding Detect."""

    role: str
    subtype: str
    reason: str = "Decided by a person in the web app"
