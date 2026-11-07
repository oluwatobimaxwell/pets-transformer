import pandas as pd
import pytest

from pets_engine.transform import pets
from pets_engine.transform.keys import recipient_key
from pets_eval.attacks import hash_dictionary_attack


def test_pseudonym_is_consistent_and_keeps_blanks(visits):
    out = pets.keyed_pseudonym(visits.patient, recipient_key("HEALTH-S1"))
    assert out[0] == out[1] and out[0] != out[2] and out[3] == ""


def test_each_recipient_gets_different_tokens(visits):
    one = pets.keyed_pseudonym(visits.patient, recipient_key("A"))
    two = pets.keyed_pseudonym(visits.patient, recipient_key("B"))
    assert one[0] != two[0]


def test_missing_key_refuses_to_run(monkeypatch):
    monkeypatch.delenv("PETS_ENGINE_KEY")
    with pytest.raises(ValueError):
        recipient_key("A")


def test_tokens_resist_the_hash_dictionary_attack(visits):
    out = pets.keyed_pseudonym(visits.patient, recipient_key("A"))
    attack = hash_dictionary_attack(out[out != ""], list(visits.patient))
    assert attack.get("share_values_reversed", 0) == 0


def test_prefix_ip_keeps_subnets_together():
    key = recipient_key("A")
    out = pets.prefix_ip(pd.Series(["10.1.2.3", "10.1.2.9", "10.9.0.1"]), key)
    assert out[0].split(".")[:3] == out[1].split(".")[:3]
    assert out[0].split(".")[1] != out[2].split(".")[1] or out[0].split(".")[2] != out[2].split(".")[2]


def test_time_levels_use_accepted_formats(visits):
    assert pets.coarsen_time(visits.ts, "hour_of_day")[0] == "09:00"
    assert pets.coarsen_time(visits.ts, "month")[0] == "2025-01"


def test_merging_small_areas_keeps_the_largest():
    out = pets.keep_largest(pd.Series(["Turku"] * 5 + ["Salo"] * 3 + ["Rusko"]), 2)
    assert set(out) == {"Turku", "Salo", "other"}
