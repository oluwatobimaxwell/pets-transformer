from pydantic import BaseModel

from app.schemas.gate_check_out import GateCheckOut


class GateAttemptOut(BaseModel):
    """One pass of the gate: every check and the status they add up to."""

    attempt: int
    status: str
    checks: list[GateCheckOut]
