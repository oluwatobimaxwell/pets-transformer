"""Plain wording for a release made of answers, shared by the report and the dashboard."""
from __future__ import annotations

from ..utils.explanations import explanations


def guarantee_lines(answers: dict) -> list:
    return [f"Mechanism: {answers['mechanism']}.",
            f"Budget: epsilon {answers['epsilon']:g} for this release, delta {answers['delta']}.",
            f"Unit of privacy: {answers['unit']}, adding at most {answers['contribution_bound']} records.",
            "Each family of questions gets a share of the budget by the square root of its size, and the shares add up to the total.",
            f"{answers['answered']} of {answers['questions']} questions answered, from {answers['workload']}."]


def family_rows(answers: dict) -> list:
    return [{"questions": f"{f['kind']} by {', '.join(f['filters'])}" + (f" of {f['value']}" if f["value"] else ""), "count": f["questions"],
             "epsilon": f["epsilon"], "noise": f"about ±{f['count_noise_scale']:g} per count" if f["count_noise_scale"] else "noisy sum and count"}
            for f in answers["families"]]


def standing_risks(manifest: dict) -> list:
    """Caveats for every release. Attackers don't apply to answers, whose guarantee is the mechanism itself."""
    words = explanations()["standing_risks"]
    return ([] if manifest.get("answers") else [words["attackers"]]) + [words["self_assessment"]]


def answer_risk_lines(answers: dict) -> list:
    uncovered = [f"{t['id']} isn't answered: it needs row-level data, which a public release can't contain. {t['description']}." for t in answers["not_covered"]]
    return explanations()["answer_risks"] + uncovered
