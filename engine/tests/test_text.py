import pandas as pd

from pets_engine.text.names import NameBook, name_forms, own_value_spans
from pets_engine.text.patterns import pattern_spans
from pets_engine.text.redactor import TextRedactor, merged
from pets_engine.text.span import Span
from pets_engine.text.spoken_numbers import spoken_number_spans


def labels_in(text):
    return {span.label for span in pattern_spans(text)}


def test_typed_identifiers_are_found():
    assert "NATIONAL_ID" in labels_in("hetu on 210814A966S")
    assert "EMAIL" in labels_in("aino.v@kotiposti.example")
    assert "IBAN" in labels_in("FI49 9123 4567 8901 23")


def test_spelled_out_email_is_found():
    assert "EMAIL" in labels_in("se on aino piste v ät kotiposti piste example")


def test_ordinary_phrases_are_left_alone():
    assert "IBAN" not in labels_in("jono on 12 minuuttia")
    assert "DATE" not in labels_in("hinta on 34.90.")
    assert "IP_ADDRESS" not in labels_in("avaa 192.168.1.1 selaimessa")


def test_spoken_numbers_are_found_in_three_languages():
    for text in ("numero on nolla neljä nolla kolme", "my number is zero four zero three", "numret är noll fyra noll tre"):
        assert spoken_number_spans(text)


def test_finnish_case_endings_are_known():
    assert "pirkon" in name_forms("Pirkko")
    assert "virtaselle" in name_forms("Virtanen")


def test_own_record_match_uses_whole_words():
    text = "paperi on ari"
    assert [text[s.start:s.end] for s in own_value_spans(text, [("ari", "PERSON")])] == ["ari"]


def test_overlaps_merge_into_one_span():
    assert merged([Span(0, 5, "PERSON", "cue"), Span(3, 8, "PHONE", "pattern")]) == [Span(0, 8, "PERSON", "cue")]


def test_placeholders_stay_consistent_within_a_conversation():
    frame = pd.DataFrame({"text": ["Aino soitti", "Aino vastasi", "Aino taas"], "conv": ["a", "a", "b"]})
    out = TextRedactor(NameBook(["Aino"])).redact_column(frame, "text", "conv")
    assert out[0].split()[0] == out[1].split()[0] == "[PERSON_1]"


def spans_of(text):
    return [text[span.start:span.end] for span in pattern_spans(text)]


def test_triage_level_is_not_read_as_a_signature():
    assert not any("Lapsella" in found for found in spans_of("Triage C. Lapsella kuumetta."))
    assert "H.Eriksson" in spans_of("Odotustilaan. /H.Eriksson")


def test_an_address_stops_at_its_last_part():
    assert "Laaksopolku 38" in spans_of("osoitteen Laaksopolku 38 kohdalla")
    assert "Koivukatu 12 B 14" in spans_of("Koivukatu 12 B 14 on koti")
