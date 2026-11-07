from pydantic import BaseModel

from app.schemas.answers_out import AnswersOut
from app.schemas.attacker_out import AttackerOut
from app.schemas.field_evidence_out import FieldEvidenceOut
from app.schemas.gate_attempt_out import GateAttemptOut
from app.schemas.headline_tile_out import HeadlineTileOut
from app.schemas.records_index_out import RecordsIndexOut
from app.schemas.risk_out import RiskOut
from app.schemas.scenario_evidence_out import ScenarioEvidenceOut
from app.schemas.task_evidence_out import TaskEvidenceOut


class EvidenceOut(BaseModel):
    """Everything behind a finished run's decision, for its page. The rows themselves come one table at a time."""

    engine: str
    run: str
    generated_at: str
    status: str
    scenario: ScenarioEvidenceOut
    headline: list[HeadlineTileOut]
    composite: float | None = None
    composite_meaning: str
    tasks: list[TaskEvidenceOut]
    risks: list[RiskOut]
    attacker: list[AttackerOut]
    remaining: list[str]
    answers: AnswersOut | None = None
    fields: list[FieldEvidenceOut]
    tuning: dict[str, str]
    recoding: list[str]
    attempts: list[GateAttemptOut]
    records: RecordsIndexOut
