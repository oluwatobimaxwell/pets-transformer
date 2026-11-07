"""One release run: its inputs, progress and outcome, saved next to its files so a restart doesn't lose it."""

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path

from app.services.workspace import write_record

RECORD = "run.json"


@dataclass
class RunJob:
    id: str
    dataset_id: str
    scenario_id: str
    folder: Path
    status: str = "queued"
    events: list = field(default_factory=list)
    summary: dict = field(default_factory=dict)
    error: str = ""

    def log(self, stage: str, message: str) -> None:
        self.events.append({"stage": stage, "message": message, "at": datetime.now(timezone.utc).isoformat(timespec="seconds")})
        self.save()

    def save(self) -> None:
        write_record(self.folder / RECORD, {**asdict(self), "folder": str(self.folder)})

    @property
    def has_release(self) -> bool:
        return (self.folder / "release").is_dir()

    def to_out(self) -> dict:
        return {"id": self.id, "dataset_id": self.dataset_id, "scenario_id": self.scenario_id, "status": self.status, "events": self.events,
                "summary": self.summary, "error": self.error, "has_release": self.has_release}
