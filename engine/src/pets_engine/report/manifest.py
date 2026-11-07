"""The field-by-field record of what happened and why."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from ..utils.explanations import score_band


TOP_RISKS = 5
NOTABLE_RISK = 0.1


def top_risks(report: dict | None) -> list:
    if not report:
        return []
    ranked = sorted(report["risk_components"].items(), key=lambda item: -item[1])
    return [{"risk": name, "value": round(value, 3)} for name, value in ranked[:TOP_RISKS] if value >= NOTABLE_RISK]


def _scores(report: dict | None, results: list):
    if report:
        return report["summary"]
    answered = [t["score"] or 0.0 for t in results]
    return {"utility": round(sum(answered) / len(answered), 4)} if answered else None


def build_manifest(config, labels: list, plan: list, tuned, verdicts: list, report: dict | None, rows: dict, attack: dict, results: list,
                   answers: dict | None = None, recoding: dict | None = None) -> dict:
    labels_by_key = {label.key: label for label in labels}
    fields = []
    for choice in plan:
        label = labels_by_key.get(choice.key)
        fields.append({"field": choice.key, "role": label.role if label else "", "subtype": label.subtype if label else "",
                       "confidence": label.confidence if label else None, "detected_by": label.source if label else "",
                       "evidence": label.reasons if label else [], "needs_review": label.needs_review if label else False,
                       "pet": choice.pet, "output_column": choice.output_column, "why": choice.why, "needed_by": choice.needed_by})
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "scenario": {"id": config.scenario.id, "recipient": config.scenario.recipient, "purpose": config.scenario.purpose,
                     "trust_level": config.scenario.trust_level, "k_required": config.scenario.k_required},
        "status": verdicts[-1].status if verdicts else "block",
        "fields": fields,
        "tuning": tuned.to_dict() if tuned else None,
        "rows": rows,
        "attempts": [verdict.to_dict() for verdict in verdicts],
        "scores": _scores(report, results),
        "top_risks": top_risks(report),
        "stronger_attacker": attack,
        "tasks": [{**task, "band": {key: score_band(task["score"])[key] for key in ("word", "tone")}} for task in results],
        "answers": answers,
        "recoding": recoding or {},
    }


def write_manifest(manifest: dict, folder: Path) -> Path:
    target = folder / "manifest.json"
    target.write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    return target
