import pandas as pd

from pets_engine.detect.evidence import strong_evidence
from pets_engine.detect.name_hints import name_hint
from pets_engine.detect.patterns import PATTERNS
from pets_engine.detect.profiler import profile_column


def test_national_id_accepts_the_messy_unseen_formats():
    for value in ("241094-9670", "090205A9135", "200278907W", "HETU 241094-9670"):
        assert PATTERNS["national_id"](value)
    assert not PATTERNS["national_id"]("991394-9670")


def test_values_decide_when_the_column_name_is_meaningless():
    profile = profile_column("export", "c05", pd.Series(["241094-9670", "090205A9135", "200278907W"] * 20))
    assert strong_evidence(profile)[1] == "NATIONAL_ID"


def test_meaningless_names_give_no_hint():
    assert name_hint("export", "c13") is None


def test_name_meaning_finds_sensitive_columns():
    assert name_hint("ed_visits", "icd10_primary").role == "sensitive_attribute"
    assert name_hint("visits", "visit_id").role == "record_key"


def test_addresses_and_money_are_decided_by_their_values():
    address = profile_column("export", "c07", pd.Series(["Ahdekuja 47 A 4, 21110 Naantali", "Purjemäki 31 A 1, 21500 Kaarina"] * 20))
    money = profile_column("export", "c11", pd.Series(["3 987,96", "5 451,19"] * 20))
    assert strong_evidence(address)[1] == "STREET_ADDRESS"
    assert strong_evidence(money)[1] == "FINANCIAL_DATA"


def test_decimal_amounts_are_not_hostnames_and_note_type_is_not_free_text():
    assert not PATTERNS["hostname"]("49.85") and PATTERNS["hostname"]("mail.meridian.example")
    assert name_hint("clinical_notes", "note_type") is None or name_hint("clinical_notes", "note_type").role != "free_text"
    assert name_hint("conversations", "agent_note").role == "free_text"
