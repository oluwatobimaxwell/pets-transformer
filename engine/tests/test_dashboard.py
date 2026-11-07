from pets_engine.report.dashboard import render_dashboard
from pets_engine.utils.explanations import explanations, risk_wording, score_band


def test_score_words_follow_the_bands():
    assert score_band(0.97)["word"] == "Same answer"
    assert score_band(0.88)["word"] == "Close"
    assert score_band(0.6)["word"] == "Rough"
    assert score_band(0.1)["word"] == "Broken"
    assert score_band(None)["word"] == "Can't answer"


def test_every_risk_the_scorecard_names_has_plain_wording():
    for raw in ("direct identifiers retained", "hashed ids reversible", "records with k<5", "linkage re-identification",
                "free-text identifier leakage", "trajectory unicity (card_id)", "membership inference advantage", "exact copies of original rows"):
        assert risk_wording(raw)["name"] != raw


def test_every_task_in_our_three_datasets_is_explained():
    from pets_eval.utility import all_tasks
    missing = [t.id for t in all_tasks(["health", "customer_service", "cyber"]) if t.id not in explanations()["tasks"]]
    assert missing == []


def test_page_text_cannot_break_out_of_the_data_block():
    page = render_dashboard({"note": "</script><script>alert(1)</script>"})
    assert "</script><script>alert(1)" not in page


def test_before_and_after_answers_line_up():
    from pets_engine.report.comparisons import plain_change, side_by_side
    rows = side_by_side({"rel_error": 0.003, "orig": {"A": 302.0, "B": 348.0}, "prot": {"A": 301.0, "B": 349.0}})
    assert rows[0] == {"label": "A", "before": 302.0, "after": 301.0}
    assert side_by_side({"f1_original": 0.95, "f1_protected": 0.94})[0]["label"] == "Detection F1"
    assert "1.2 points" in plain_change({"tvd": 0.012})
