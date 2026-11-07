from pydantic import BaseModel


class GateCheckOut(BaseModel):
    """One gate check on one attempt. `severity` is what a failure costs: block, review or info."""

    name: str
    passed: bool
    severity: str
    detail: str
