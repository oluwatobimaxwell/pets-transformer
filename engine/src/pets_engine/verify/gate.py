"""The release gate. Every check runs, then the worst result decides."""
from __future__ import annotations

from pathlib import Path

from ..domain.scenario import Scenario
from ..domain.verdict import Verdict
from ..utils.policy import policy
from . import release_checks
from .scorecard_checks import scorecard_checks


def person_key_column(plan: list, table: str):
    for choice in plan:
        if choice.table == table and choice.pet == "keyed_pseudonym" and choice.params.get("subtype") in ("NATIONAL_ID", "CUSTOMER_ID", "PATIENT_ID"):
            return choice.output_column
    return None


def run_gate(attempt: int, config, plan: list, labels: list, release: dict, originals: dict, sources: dict, kept_share: float, folder: Path, rowmaps: dict, evidence: Path) -> tuple:
    scenario: Scenario = config.scenario
    limit = policy()["gate"]["max_suppressed_rows"]
    checks = [
        release_checks.private_files_check(folder),
        release_checks.leftover_identifiers_check(folder, plan),
        release_checks.protected_values_check(originals, release, plan),
        release_checks.row_order_check(originals, sources, labels),
        release_checks.look_alike_check(release, plan, scenario.k_required),
        release_checks.review_check(labels, plan),
        release_checks.row_loss_check(kept_share, limit),
    ]
    for table, frame in release.items():
        key = person_key_column(plan, table)
        if key:
            clues = [c.output_column for c in plan if c.table == table and c.tunable]
            checks.append(release_checks.repeat_visitor_note(frame, key, clues))
    report = None
    if config.package_root and scenario.task_ids:
        extra, report = scorecard_checks(config, folder, rowmaps, evidence)
        checks += extra
    return Verdict(attempt, checks), report
