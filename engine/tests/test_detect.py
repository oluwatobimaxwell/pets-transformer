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


def test_birth_dates_in_mixed_formats_are_found_from_their_values():
    dates = pd.Series(["15.3.1987", "02/11/64", "1999-07-30", "4.12.1952", "28.02.2001", "19/06/78"] * 20)
    role, subtype, reason = strong_evidence(profile_column("export", "c06", dates))
    assert (role, subtype) == ("quasi_identifier", "BIRTH_DATE") and "1952" in reason


def test_recent_event_dates_are_not_birth_dates():
    events = pd.Series(["2025-01-03", "2025-06-30", "14.11.2025", "2024-12-31"] * 20)
    assert strong_evidence(profile_column("export", "c23", events)) is None


def test_an_unkeyed_hash_of_an_id_takes_the_id_label():
    import hashlib

    from pets_engine.detect.hash_reversal import reverse_hashes
    from pets_engine.domain.field_label import FieldLabel

    ids = ["241094-9670", "090205A9135", "200278907W", "131052-308T"] * 5
    frame = pd.DataFrame({"c05": ids, "c20": [hashlib.sha256(v.encode()).hexdigest() for v in ids],
                          "c21": [hashlib.sha256(f"other-{i}".encode()).hexdigest() for i in range(len(ids))]})
    labels = [FieldLabel("export", "c05", "direct_identifier", "NATIONAL_ID", 0.99, "validator"),
              FieldLabel("export", "c20", "technical_identifier", "OTHER", 0.99, "validator"),
              FieldLabel("export", "c21", "technical_identifier", "OTHER", 0.99, "validator")]
    hashed, unrelated = reverse_hashes({"export": frame}, labels)[1:]
    assert (hashed.role, hashed.subtype, hashed.source) == ("direct_identifier", "NATIONAL_ID", "hash check")
    assert "SHA-256 of c05" in hashed.reasons[0]
    assert (unrelated.role, unrelated.subtype) == ("technical_identifier", "OTHER")
