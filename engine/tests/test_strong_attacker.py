import pandas as pd

from pets_engine.verify.strong_attacker import attack_table


def test_clues_meeting_k_single_out_nobody_but_a_rare_fact_does():
    frame = pd.DataFrame({"age": ["40-49"] * 10, "area": ["Turku"] * 10, "diagnosis": ["J06"] * 9 + ["E84"]})
    found = attack_table(frame, ["age", "area"], ["diagnosis"])
    assert found["clues_only"] == 0.0
    assert 0 < found["with_one_fact"]["diagnosis"] <= 0.2


def test_numbers_are_only_known_roughly():
    frame = pd.DataFrame({"age": ["40-49"] * 100, "stay": [float(i) for i in range(100)]})
    found = attack_table(frame, ["age"], ["stay"])
    assert found["with_one_fact"]["stay"] == 0.0
