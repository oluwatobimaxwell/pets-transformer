"""A plain-language report for people, written next to the manifest."""
from __future__ import annotations

from pathlib import Path

from .answer_notes import answer_risk_lines, family_rows, guarantee_lines, standing_risks

STATUS_WORDS = {"release": "Released", "review": "Held for a person's review", "block": "Blocked"}


def _pet_lines(manifest: dict) -> list:
    kept = [f for f in manifest["fields"] if f["pet"] != "remove"]
    removed = [f for f in manifest["fields"] if f["pet"] == "remove"]
    lines = ["| Field | Detected as | Technique | Why |", "|---|---|---|---|"]
    lines += [f"| `{f['field']}` | {f['role'].replace('_', ' ')} | {f['pet'].replace('_', ' ')} | {f['why']} |" for f in kept]
    lines += ["", f"{len(removed)} other columns were removed because no required task uses them."]
    return lines


def _attempt_lines(manifest: dict) -> list:
    lines = []
    for attempt in manifest["attempts"]:
        lines.append(f"### Attempt {attempt['attempt']}: {attempt['status']}")
        lines += [f"- {'Pass' if c['passed'] else 'Fail'}: {c['name']}. {c['detail']}" for c in attempt["checks"]]
        lines.append("")
    return lines


def _residual_lines(manifest: dict) -> list:
    lines = ["## Risks that remain"] + [f"- {note}" for note in standing_risks(manifest)]
    last = manifest["attempts"][-1] if manifest["attempts"] else {"checks": []}
    lines += [f"- {c['detail']}" for c in last["checks"] if c["name"] == "Risk across repeat records"]
    lines += [f"- {t['id']} scored {t['score']:.2f}." for t in manifest["tasks"] if t["score"] is not None and t["score"] < 0.8]
    lines += [f"- {risk['risk']}: {risk['value']:.2f}. The gate allowed this because the scenario sets no bar for it." for risk in manifest["top_risks"]]
    for table, found in manifest.get("stronger_attacker", {}).items():
        lines.append(f"- Our stronger attacker on `{table}`: knowing the clues singles out {found['clues_only']:.0%}; adding every kept fact singles out {found['with_all_facts']:.0%}.")
    return lines


def _answer_lines(answers: dict) -> list:
    lines = ["## Published answers, not rows"] + [f"- {line}" for line in guarantee_lines(answers)]
    lines += ["", "| Questions | How many | Epsilon | Noise |", "|---|---|---|---|"]
    lines += [f"| {f['questions']} | {f['count']} | {f['epsilon']:g} | {f['noise']} |" for f in family_rows(answers)]
    return lines + [""]


def write_summary(manifest: dict, folder: Path) -> Path:
    scenario = manifest["scenario"]
    rows = manifest["rows"]
    lines = [f"# {STATUS_WORDS[manifest['status']]}: {scenario['id']}", "", f"Recipient: {scenario['recipient']}", f"Purpose: {scenario['purpose']}", ""]
    s = manifest["scores"] or {}
    if s.get("privacy") is not None:
        lines += [f"Self-assessment: privacy {s['privacy']:.2f}, utility {s['utility']:.2f}, composite {s['composite']:.2f}", ""]
    elif s.get("utility") is not None and manifest.get("answers"):
        lines += [f"Usefulness: {s['utility']:.2f}, how close the noisy answers are to the true ones", ""]
    elif s.get("utility") is not None:
        lines += [f"Usefulness: {s['utility']:.2f} (no challenge scorecard for this data)", ""]
    answers = manifest.get("answers")
    if answers:
        lines += _answer_lines(answers)
    else:
        lines += [f"Rows kept: {rows.get('kept', 0):,} of {rows.get('total', 0):,}", "", "## What happened to each field"] + _pet_lines(manifest) + [""]
    lines += ["## Gate"] + _attempt_lines(manifest)
    lines += ["## Tasks"] + [f"- {t['id']}: {'not answerable' if t['score'] is None else format(t['score'], '.2f')}. {t['description']}" for t in manifest["tasks"]]
    lines += [""] + _residual_lines(manifest) + [f"- {line}" for line in (answer_risk_lines(answers) if answers else [])]
    target = folder / "report.md"
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return target
