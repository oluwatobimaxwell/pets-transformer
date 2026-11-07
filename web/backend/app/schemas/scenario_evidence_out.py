from pydantic import BaseModel


class ScenarioEvidenceOut(BaseModel):
    """Who the release is for and why. Data outside the challenge package has no recipient or purpose."""

    id: str
    trust_level: str
    recipient: str | None = None
    purpose: str | None = None
    k_required: int | None = None
