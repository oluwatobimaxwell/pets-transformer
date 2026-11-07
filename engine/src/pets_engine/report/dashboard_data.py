"""Builds what the dashboard shows from a run's manifest, scorecard and protected files."""
from __future__ import annotations

import json
from pathlib import Path

from .. import __version__
from ..domain.run_paths import RunPaths
from ..utils.explanations import explanations, risk_wording, score_band
from .answer_notes import answer_risk_lines, family_rows, guarantee_lines, standing_risks
from .comparisons import plain_change, side_by_side
from .recoding_notes import recoding_lines
from .records import records_index, records_view


def _read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else None


def _plain_detail(detail: dict) -> list:
    return [{"name": key.replace("_", " "), "value": value} for key, value in (detail or {}).items() if isinstance(value, (int, float, str))]


def _tasks(manifest: dict) -> list:
    guide = explanations()["tasks"]
    out = []
    for task in manifest["tasks"]:
        wording = guide.get(task["id"], {})
        detail = task.get("detail") or {}
        capped = "f1_original" in detail and "f1_protected" in detail and detail["f1_protected"] > detail["f1_original"]
        out.append({"id": task["id"], "question": wording.get("question", task["description"]), "scoring": wording.get("scoring", task.get("metric", "")),
                    "needs": wording.get("needs", ""), "score": task["score"], "band": score_band(task["score"]), "metric": task.get("metric", ""),
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


def _answers(manifest: dict):
    answers = manifest.get("answers")
    return {"guarantee": guarantee_lines(answers), "families": family_rows(answers)} if answers else None


def _headline(manifest: dict) -> list:
    words = explanations()["headline"]
    scores = manifest.get("scores") or {}
    rows = manifest.get("rows") or {}
    tasks = manifest.get("tasks", [])
    working = sum(1 for t in tasks if t["score"] is not None and t["score"] >= 0.8)
    tiles = []
    answers = manifest.get("answers")
    if answers:
        tiles.append({"label": "Privacy budget", "value": answers["epsilon"], "format": "epsilon", "meaning": words["budget"]})
        tiles.append({"label": "Answers published", "value": answers["answered"], "format": "count", "total": answers["questions"], "meaning": words["answered"]})
    if scores and scores.get("privacy") is not None:
        tiles.append({"label": "Privacy", "value": scores["privacy"], "format": "score", "meaning": words["privacy"]})
    if scores and scores.get("utility") is not None:
        tiles.append({"label": "Usefulness", "value": scores["utility"], "format": "score", "meaning": words["utility"]})
    if rows.get("total"):
        tiles.append({"label": "Rows kept", "value": rows["kept"] / rows["total"], "format": "percent",
                      "meaning": f"{rows['kept']:,} of {rows['total']:,}. {words['rows']}"})
    if tasks:
        tiles.append({"label": "Questions still answered", "value": working, "format": "count", "total": len(tasks),
                      "meaning": "Required questions scoring Close or better."})
    return tiles


def _remaining(manifest: dict) -> list:
    notes = standing_risks(manifest)
    last = manifest["attempts"][-1] if manifest.get("attempts") else {"checks": []}
    notes += [c["detail"] for c in last["checks"] if c["name"] == "Risk across repeat records" and "No person" not in c["detail"]]
    notes += [f"{r['risk']}: {r['value']:.2f}, allowed because this scenario sets no bar for it." for r in manifest.get("top_risks", [])]
    return notes + (answer_risk_lines(manifest["answers"]) if manifest.get("answers") else [])


def evidence_data(run_dir: Path) -> dict:
    """Everything the dashboard shows except the rows themselves: the records hold only their tables' names."""
    paths = RunPaths(Path(run_dir))
    manifest = _read_json(paths.evidence / "manifest.json")
    if manifest is None:
        raise FileNotFoundError(f"No manifest in {paths.evidence}. Run `pets-engine run` first.")
    scorecard = _read_json(paths.evidence / "scorecard.json")
    return {"engine": __version__, "run": paths.root.name, "generated_at": manifest["generated_at"], "status": manifest["status"],
            "scenario": manifest["scenario"], "headline": _headline(manifest), "tasks": _tasks(manifest), "risks": _risks(scorecard), "attacker": _attacker(manifest),
            "remaining": _remaining(manifest), "fields": manifest["fields"], "attempts": manifest["attempts"],
            "tuning": (manifest.get("tuning") or {}).get("levels", {}), "records": records_index(paths),
            "composite": (manifest.get("scores") or {}).get("composite"), "composite_meaning": explanations()["headline"]["composite"],
            "answers": _answers(manifest), "recoding": recoding_lines(manifest.get("recoding"))}


def dashboard_data(run_dir: Path) -> dict:
    """The evidence with a sample of every released table's rows, for the self-contained dashboard file."""
    data = evidence_data(run_dir)
    return {**data, "records": records_view(RunPaths(Path(run_dir)), data["fields"])}
