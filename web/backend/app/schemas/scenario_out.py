from pydantic import BaseModel


class ScenarioOut(BaseModel):
    """One of the challenge's sharing scenarios."""

    id: str
    dataset: str
    title: str
    recipient: str
    purpose: str
    trust_level: str
    k: int
    task_ids: list[str]
