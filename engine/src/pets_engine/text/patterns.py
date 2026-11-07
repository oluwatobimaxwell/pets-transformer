"""Formats and cue phrases, in Finnish, Swedish and English."""
from __future__ import annotations

import re

from .span import Span

_SEP = r"(?:\s+(?:piste|dot|punkt)\s+)"
_AT = r"(?:\s*(?:ät|at|miukumauku|snabel[- ]?a|@)\s*)"
_WORDISH = r"[\w.åäöÅÄÖ-]+"
_SPELLED = rf"(?:{_WORDISH}{_SEP})*{_WORDISH}{_AT}{_WORDISH}(?:{_SEP}{_WORDISH})+"
_STREET = r"[\wåäöÅÄÖ-]*(?:katu|tie|kuja|polku|väylä|kaari|rinne|mäki|ranta|puisto|gränd|gatan|vägen|stigen|tori|penger|raitti|aukio|street|road|avenue|lane)"
_MONTHS = r"tammikuu|helmikuu|maaliskuu|huhtikuu|toukokuu|kesäkuu|heinäkuu|elokuu|syyskuu|lokakuu|marraskuu|joulukuu|january|february|march|april|may|june|july|august|september|october|november|december|januari|februari|mars|maj|juni|juli|augusti|oktober"
_FILLERS = r"(?:\s*,?\s*(?:on|is|är|oli|was|var|tota|joo|siis|niinku|elikkä|eli|varmaan|probably|um|uh|öh|ja|nyt|mun|my|that|sen|the|number|numero))*"
_SECRET_CUE = r"salasana(?:ni)?|salasanan|password|passcode|lösenord(?:et)?|pin(?:-?koodi|-?koden|-?kod)?|puk(?:-?koodi|-?koden)?"
_ACCOUNT_CUE = r"asiakasnumero(?:ni|n)?|sopimusnumero(?:ni|n)?|laskun ?numero|tilausnumero|viitenumero|customer number|contract number|invoice(?: number)?|order number|reference number|kundnummer|fakturanummer|avtalsnummer"
_USER_CUE = r"käyttäjätunnus|käyttäjänimi|tunnukseni|username|user name|användarnamn|login"

RULES = (
    ("EMAIL", re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")),
    ("URL", re.compile(r"https?://\S+|www\.\S+", re.I)),
    ("NATIONAL_ID", re.compile(r"(?<![\dA-Za-z])\d{6}\s?[-+A-FU-Ya-fu-y]\s?\d{3}\s?[0-9A-Ya-y](?![\dA-Za-z])")),
    ("NATIONAL_ID", re.compile(r"(?<!\d)\d{6}[-+](?!\d)")),
    ("NATIONAL_ID", re.compile(r"(?<![\w-])[-+a-fu-yA-FU-Y]\d{3}[0-9a-yA-Y](?![\w-])")),
    ("IBAN", re.compile(r"\b[A-Za-z]{2}\s?\d{2}(?:[ -]?\d{4}){2,7}(?:[ -]?\d{1,4})?\b")),
    ("PROPERTY_ID", re.compile(r"\b\d{3}-\d{3}-\d{1,4}-\d{1,4}\b")),
    ("IP_ADDRESS", re.compile(r"\b\d{1,3}(?:\.\d{1,3}){3}\b")),
    ("DEVICE_ID", re.compile(r"\b[0-9A-Fa-f]{2}(?:[:-][0-9A-Fa-f]{2}){5}\b")),
    ("LICENSE_PLATE", re.compile(r"\b[A-ZÅÄÖa-zåäö]{3}-\d{1,3}\b")),
    ("DATE", re.compile(r"\b(?:[0-2]?\d|3[01])\.\s?(?:0?[1-9]|1[0-2])\.(?:\s?\d{2,4})?(?!\d)")),
    ("DATE", re.compile(r"\b\d{4}-\d{2}-\d{2}\b")),
    ("DATE", re.compile(rf"\b\d{{1,2}}\.?\s(?:{_MONTHS})\w*(?:\s\d{{4}})?\b|\b(?:{_MONTHS})\s\d{{1,2}}(?:st|nd|rd|th)?\b", re.I)),
    ("AGE", re.compile(r"\b\d{1,3}(?=\s?-?\s?(?:vuotias|vuotiaana|v\.|vuotta|years? old|year-old|y/o|åring|år gammal))", re.I)),
    ("ADDRESS", re.compile(rf"\b{_STREET}\s\d{{1,4}}(?:\s?[A-Za-z]\b)?(?:\s\d{{1,3}}\b)?(?:,?\s\d{{5}}(?:\s[\wåäöÅÄÖ-]+)?)?", re.I)),
    ("ADDRESS", re.compile(r"\b\d{5}\s[A-ZÅÄÖ][\wåäö-]+")),
    ("ADDRESS", re.compile(r"\b[\wåäöÅÄÖ-]{4,}\s\d{1,3}(?:\s?[A-Za-z]\b)?(?:\s\d{1,3}\b)?,\s\d{5}\s[\wåäöÅÄÖ-]+")),
    ("PAYMENT_CARD", re.compile(r"(?<![\d-])(?:\d[ -]?){12,18}\d(?![\d-])")),
    ("PHONE", re.compile(r"(?<![\d+])(?:\+\d{1,3}|00\d{1,3}|0)[\s-]?\(?\d{1,3}\)?(?:[\s-]?\d{2,5}){1,4}(?!\d)")),
    ("ACCOUNT_NUMBER", re.compile(r"(?<![\dA-Za-z-])[A-Z]{0,4}-?\d{6,12}(?![\dA-Za-z-])")),
    ("ACCOUNT_NUMBER", re.compile(r"(?<![\d-])\d{4}\s\d{4}(?![\d-])")),
    ("SECRET", re.compile(r"\b[A-ZÅÄÖa-zåäö]{4,}[A-ZÅÄÖa-zåäö]*\d{1,4}\b")),
)
# The value sits right after a cue word, and only group 1 is redacted.
CUE_RULES = (
    ("SPELLED_EMAIL", re.compile(rf"({_SPELLED})", re.I)),
    ("SECRET", re.compile(rf"(?:{_SECRET_CUE}){_FILLERS}[\s:=]+[\"'“]?([^\s\"'”,.;]+)", re.I)),
    ("ACCOUNT_NUMBER", re.compile(rf"(?:{_ACCOUNT_CUE}){_FILLERS}[\s:#]*([A-Za-z]{{0,4}}-?\d[\d -]{{2,}}\d)", re.I)),
    ("PHONE", re.compile(rf"(?:numero|numeero|number|numret|numrret|nummer|puhelin\w*|phone){_FILLERS}\s+(\+?\d[\d -]{{1,}}\d)", re.I)),
    ("USERNAME", re.compile(rf"(?:{_USER_CUE})(?:\s+(?:on|is|är))?[\s:]+([\w.@-]{{3,}})", re.I)),
    ("PAYMENT_CARD", re.compile(r"(?:ending(?: in)?|loppu(?:u|nsa)?|päättyy|slutar på|last four(?: digits)?|viimeiset numerot)[\s:]+(\d{4})\b", re.I)),
    ("ORG", re.compile(r"\b([A-ZÅÄÖ][\wåäö&-]+(?:\s[A-ZÅÄÖ][\wåäö&-]+){0,3}\s(?:Oy|Oyj|Ab|Ltd|Inc|Ky|ry))\b")),
)
_NAME_WORD = r"[A-ZÅÄÖa-zåäöéü][a-zåäöéü'-]+"
_KIN = (r"\w*(?:äiti|äidi|isä|vaimo|miehe|mieheni|puoliso|tyttär|tytär|poika|poja|sisko|sisare|veli|velje|naapuri|ystävä|kollega|esihenkilö|esimies|omainen|"
        r"lääkäri|hoitaja)\w*|my (?:um |uh )?(?:wife|husband|partner|mother|father|daughter|son|neighbour|sister|brother|friend)|"
        r"min (?:fru|man|mamma|pappa|dotter|son|syster|bror|granne)|dr\.?|tri")
PERSON_CUES = re.compile(rf"(?:nimeni on|mun nimi on|nimi on|nimellä|my name is|name is|jag heter|mitt namn är|{_KIN})\s+({_NAME_WORD}(?:\s{_NAME_WORD})?)", re.I)
INTRODUCTIONS = re.compile(r"(?:minä olen|olen|tässä|täällä on|this is|i am|i'm|det är)\s+([A-ZÅÄÖ][a-zåäöéü'-]+(?:\s[A-ZÅÄÖ][a-zåäöéü'-]+)?)")
SIGNATURE = re.compile(r"(?:(?<=/)|(?<=\s))(?<!Triage )([A-ZÅÄÖ]\.\s?[A-ZÅÄÖ][a-zåäö'-]+)")
NOT_NAMES = {"nyt", "täällä", "vain", "kyllä", "ihan", "tosi", "todella", "soittamassa", "yhteydessä", "asiakas", "here", "calling", "not", "very", "the", "a", "an",
             "sorry", "glad", "happy", "looking", "trying", "just", "so", "ei", "se", "että", "jo", "myös", "muuttanut", "muuttamassa", "ringer", "inte", "på", "som", "en", "ett", "här",
             "aava", "aallokon", "aallokolta", "aallokko", "syntynyt", "soittanut", "soittaa", "transferring", "contacting", "on", "hidas", "really", "slow", "moving", "fel", "åtgärdat", "sai", "sairastaa",
             "in", "out", "on", "kuoli", "passed", "kirjattu", "ja", "and", "och", "is", "was", "oli", "ole", "tarvitsee", "needs", "has", "had", "the", "my"}
GENERIC_IPS = ("192.168.", "10.0.0.", "127.0.0.")


def pattern_spans(text: str) -> list:
    found = [Span(m.start(), m.end(), label, "pattern") for label, rule in RULES for m in rule.finditer(text)]
    for label, rule in CUE_RULES:
        found += [Span(m.start(1), m.end(1), "EMAIL" if label == "SPELLED_EMAIL" else label, "cue") for m in rule.finditer(text)]
    for rule in (PERSON_CUES, INTRODUCTIONS):
        for m in rule.finditer(text):
            words = m.group(1).split()
            if words[0].lower() in NOT_NAMES:
                continue
            end = m.start(1) + len(words[0]) if len(words) > 1 and words[1].lower() in NOT_NAMES else m.end(1)
            found.append(Span(m.start(1), end, "PERSON", "cue"))
    found += [Span(m.start(1), m.end(1), "PERSON", "cue") for m in SIGNATURE.finditer(text)]
    return [span for span in found if not (span.label == "IP_ADDRESS" and text[span.start:span.end].startswith(GENERIC_IPS))]
