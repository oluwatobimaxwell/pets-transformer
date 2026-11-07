"""Builds what the dashboard shows from a run's manifest, scorecard and protected files."""
from __future__ import annotations

import json
from pathlib import Path

from .. import __version__
from ..domain.run_paths import RunPaths
from ..utils.explanations import explanations, risk_wording, score_band
from .comparisons import plain_change, side_by_side
from .records import records_view


def _read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else None


def _plain_detail(detail: dict) -> list:
    return [{"name": key.replace("_", " "), "value": value} for key, value in (detail or {}).items() if isinstance(value, (int, float, str))]


def _tasks(manifest: dict, scorecard: dict | None) -> list:
    raw = {t["id"]: t for t in (scorecard or {}).get("utility", [])}
    guide = explanations()["tasks"]
    out = []
    for task in manifest["tasks"]:
        wording = guide.get(task["id"], {})
        full = raw.get(task["id"], {})
        detail = full.get("detail") or {}
        capped = "f1_original" in detail and "f1_protected" in detail and detail["f1_protected"] > detail["f1_original"]
        out.append({"id": task["id"], "question": wording.get("question", task["description"]), "scoring": wording.get("scoring", full.get("metric", "")),
                    "needs": wording.get("needs", ""), "score": task["score"], "band": score_band(task["score"]), "metric": full.get("metric", ""),
                    "detail": _plain_detail(detail), "comparison": side_by_side(detail), "change": plain_change(detail),
                    "note": "The rule scored higher on the protected data than on the original, so the score is capped at 1.00. Check that it isn't finding false alarms." if capped else ""})
    return out


def _risks(scorecard: dict | None) -> list:
    out = []
    for raw_name, value in (scorecard or {}).get("risk_components", {}).items():
        table, _, metric = raw_name.partition(": ")
        wording = risk_wording(metric)
        out.append({"table": table, "metric": metric, "name": wording["name"], "meaning": wording["meaning"], "value": value})
    return sorted(out, key=lambda r: (-r["value"], r["table"]))


def _attacker(manifest: dict) -> list:
    rows = []
    for table, found in (manifest.get("stronger_attacker") or {}).items():
        facts = found.get("with_one_fact") or {}
        worst = max(facts, key=facts.get) if facts else ""
        rows.append({"table": table, "clues": found["clues"], "clues_only": found["clues_only"], "worst_fact": worst,
                     "worst_fact_value": facts.get(worst), "all_facts": found["with_all_facts"], "facts": list(facts)})
    return rows


def _headline(manifest: dict) -> list:
    words = explanations()["headline"]
    scores = manifest.get("scores") or {}
    rows = manifest.get("rows") or {}
    tasks = manifest.get("tasks", [])
    working = sum(1 for t in tasks if t["score"] is not None and t["score"] >= 0.8)
    tiles = []
    if scores:
        tiles += [{"label": "Privacy", "value": scores["privacy"], "format": "score", "meaning": words["privacy"]},
                  {"label": "Usefulness", "value": scores["utility"], "format": "score", "meaning": words["utility"]}]
    if rows.get("total"):
        tiles.append({"label": "Rows kept", "value": rows["kept"] / rows["total"], "format": "percent",
                      "meaning": f"{rows['kept']:,} of {rows['total']:,}. {words['rows']}"})
    if tasks:
        tiles.append({"label": "Questions still answered", "value": working, "format": "count", "total": len(tasks),
                      "meaning": "Required questions scoring Close or better."})
    return tiles


def _remaining(manifest: dict) -> list:
    notes = ["Only the public attackers were tested. The organisers hold stronger hidden ones.", "Scores are self-assessment from pets-eval, not official judging."]
    last = manifest["attempts"][-1] if manifest.get("attempts") else {"checks": []}
    notes += [c["detail"] for c in last["checks"] if c["name"] == "Risk across repeat records" and "No person" not in c["detail"]]
    notes += [f"{r['risk']}: {r['value']:.2f}, allowed because this scenario sets no bar for it." for r in manifest.get("top_risks", [])]
    return notes


def dashboard_data(run_dir: Path) -> dict:
    paths = RunPaths(Path(run_dir))
    manifest = _read_json(paths.evidence / "manifest.json")
    if manifest is None:
        raise FileNotFoundError(f"No manifest in {paths.evidence}. Run `pets-engine run` first.")
    scorecard = _read_json(paths.evidence / "scorecard.json")
    return {"engine": __version__, "run": paths.root.name, "generated_at": manifest["generated_at"], "status": manifest["status"],
            "scenario": manifest["scenario"], "headline": _headline(manifest), "tasks": _tasks(manifest, scorecard), "risks": _risks(scorecard), "attacker": _attacker(manifest),
            "remaining": _remaining(manifest), "fields": manifest["fields"], "attempts": manifest["attempts"],
            "tuning": (manifest.get("tuning") or {}).get("levels", {}), "records": records_view(paths, manifest["fields"]),
            "composite": (manifest.get("scores") or {}).get("composite"), "composite_meaning": explanations()["headline"]["composite"]}
