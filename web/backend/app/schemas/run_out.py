from pydantic import BaseModel

from app.schemas.run_event_out import RunEventOut


class RunOut(BaseModel):
    """A release in progress or finished. `status` is queued, running, release, review, block or error."""

    id: str
    dataset_id: str
    scenario_id: str
    status: str
    events: list[RunEventOut]
    summary: dict
    error: str = ""
    has_release: bool = False
