"""Finds numbers said in words, such as "nolla neljä nolla", which digit patterns can't see."""
from __future__ import annotations

import re

from .span import Span

DIGIT_WORDS = {
    "nolla", "yksi", "yks", "kaksi", "kaks", "kolme", "neljä", "viisi", "viis", "kuusi", "kuus", "seitsemän", "seittemän", "kahdeksan",
    "kaheksan", "yhdeksän", "yheksän", "kymmenen", "kymppi", "sata", "tuhat",
    "zero", "oh", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "noll", "ett", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio",
}
JOINERS = {"viiva", "väliviiva", "dash", "hyphen", "streck", "ja", "and", "och", "plus", "piste", "pilkku"}
SINGLE_LETTERS = re.compile(r"^[a-zåäö]$|^aa$|^bee$|^cee$|^dee$|^ee$|^äf$|^gee$|^hoo$|^ii$|^jii$|^koo$|^äl$|^äm$|^än$|^oo$|^pee$|^kuu$|^är$|^äs$|^tee$|^uu$|^vee$|^xx$|^yy$", re.I)
WORD = re.compile(r"[^\W_]+", re.UNICODE)
MIN_RUN = 3
SHORT_RUN = 2
SHORT_TURN_WORDS = 7
CUE_LABELS = (
    (re.compile(r"hetu|henkilötunnus|henkilotunnus|sotu|personnummer|personbeteckning|personal id|identity code|social security", re.I), "NATIONAL_ID"),
    (re.compile(r"iban|tilinumero|tilin numero|kontonummer|account number|bank account", re.I), "IBAN"),
    (re.compile(r"kortti|kortin|card|kort", re.I), "PAYMENT_CARD"),
    (re.compile(r"asiakasnumero|sopimusnumero|laskun|tilausnumero|customer number|contract number|invoice|order number|kundnummer|fakturanummer", re.I), "ACCOUNT_NUMBER"),
    (re.compile(r"pin|puk|salasana|password|lösenord", re.I), "SECRET"),
)
DEFAULT_LABEL = "PHONE"


def _is_number_token(word: str) -> bool:
    return word.lower() in DIGIT_WORDS or word.isdigit()


def _label_from_context(text: str, start: int) -> str:
    before = text[max(0, start - 70):start]
    for pattern, label in CUE_LABELS:
        if pattern.search(before):
            return label
    return DEFAULT_LABEL


def spoken_number_spans(text: str) -> list:
    tokens = list(WORD.finditer(text))
    spans, i = [], 0
    while i < len(tokens):
        if not _is_number_token(tokens[i].group()):
            i += 1
            continue
        j, count, last = i, 0, i
        while j < len(tokens):
            word = tokens[j].group()
            if _is_number_token(word):
                count, last = count + 1, j
            elif not (word.lower() in JOINERS or SINGLE_LETTERS.match(word)):
                break
            j += 1
        start, end = tokens[i].start(), tokens[last].end()
        label = _label_from_context(text, start)
        fragment_of_a_number = count >= SHORT_RUN and (label != DEFAULT_LABEL or len(tokens) <= SHORT_TURN_WORDS)
        if count >= MIN_RUN or fragment_of_a_number:
            spans.append(Span(start, end, label, "spoken"))
        i = last + 1
    return spans
