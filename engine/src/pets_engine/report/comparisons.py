"""Turns a task's raw detail into the original and protected answers side by side, or one plain sentence when only an error is reported."""
from __future__ import annotations

MAX_ROWS = 10
PAIRED_DICTS = (("orig", "prot"), ("original", "protected"))
PAIRED_NUMBERS = (("f1_original", "f1_protected", "Detection F1"), ("spearman_orig", "spearman_prot", "Correlation"),
                  ("rho_original", "rho_protected", "Correlation"), ("auc_orig", "auc_prot", "Model AUC"))
COUNT_WORDS = {"tp": "Attacks caught", "fp": "False alarms", "fn": "Attacks missed"}


def _rounded(value):
    return round(value, 4) if isinstance(value, float) else value


def side_by_side(detail: dict) -> list:
    rows = []
    for before, after in PAIRED_DICTS:
        if isinstance(detail.get(before), dict) and isinstance(detail.get(after), dict):
            for group, value in list(detail[before].items())[:MAX_ROWS]:
                rows.append({"label": COUNT_WORDS.get(group, str(group)), "before": _rounded(value), "after": _rounded(detail[after].get(group))})
    for before, after, label in PAIRED_NUMBERS:
        if before in detail and after in detail:
            rows.insert(0, {"label": label, "before": _rounded(detail[before]), "after": _rounded(detail[after])})
    return rows


def plain_change(detail: dict) -> str:
    if "tvd" in detail or "mean_tvd" in detail:
        shift = detail.get("tvd", detail.get("mean_tvd"))
        return f"The distribution moved by {shift * 100:.1f} points out of 100 between original and protected."
    if "rel_error" in detail:
        return f"Protected answers are off by {detail['rel_error'] * 100:.1f}% on average."
    if "mape" in detail:
        return f"Protected answers are off by {detail['mape'] * 100:.1f}% on average."
    if "mae" in detail:
        return f"Rates differ by {detail['mae'] * 100:.1f} points on average."
    if "retained" in detail:
        return f"{detail['retained'] * 100:.1f}% of everyday words survived."
    if "same_user_same_value" in detail:
        return f"{detail['same_user_same_value'] * 100:.0f}% of users kept one code across logs; {detail['different_users_different_value'] * 100:.0f}% of different users got different codes."
    return ""
