"""The field-by-field record of what happened and why."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path


TOP_RISKS = 5
NOTABLE_RISK = 0.1


def top_risks(report: dict | None) -> list:
    if not report:
        return []
    ranked = sorted(report["risk_components"].items(), key=lambda item: -item[1])
    return [{"risk": name, "value": round(value, 3)} for name, value in ranked[:TOP_RISKS] if value >= NOTABLE_RISK]


def build_manifest(config, labels: list, plan: list, tuned, verdicts: list, report: dict | None, rows: dict, attack: dict) -> dict:
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
        "scores": report["summary"] if report else None,
        "top_risks": top_risks(report),
        "stronger_attacker": attack,
        "tasks": [{"id": t["id"], "score": t.get("score"), "description": t.get("description", "")} for t in (report["utility"] if report else [])
                  if t["id"] in config.scenario.task_ids],
    }


def write_manifest(manifest: dict, folder: Path) -> Path:
    target = folder / "manifest.json"
    target.write_text(json.dumps(manifest, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    return target
