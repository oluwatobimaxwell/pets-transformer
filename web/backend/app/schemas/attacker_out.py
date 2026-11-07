from pydantic import BaseModel


class AttackerOut(BaseModel):
    """The engine's own stronger attacker on one table: the share of known people it singles out with each kind of knowledge."""

    table: str
    clues: list[str]
    clues_only: float | None
    worst_fact: str
    worst_fact_value: float | None
    all_facts: float | None
    facts: list[str]
