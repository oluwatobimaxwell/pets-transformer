"""Value tests. Each returns True when one value looks like that kind of data, checksums included where they exist."""
from __future__ import annotations

import re

from pets_eval.check import iban_ok, ip_ok, luhn_ok

_NATIONAL_ID = re.compile(r"^(?:[A-Za-zÄÖäö]{2,8}:?\s+)?(\d{2})(\d{2})(\d{2})[-+A-FU-Y]?(\d{3})[0-9A-Y]$")
_EMAIL = re.compile(r"^[\w.+-]+@[\w-]+(\.[\w-]+)+$")
_PHONE = re.compile(r"^(?:\+\d{2,3}|00\d{2,3}|0)[\s-]?\d{1,3}(?:[\s-]?\d{2,5}){1,3}$")
_IPV4 = re.compile(r"^\d{1,3}(\.\d{1,3}){3}$")
_MAC = re.compile(r"^[0-9A-Fa-f]{2}([:-][0-9A-Fa-f]{2}){5}$")
_PLATE = re.compile(r"^[A-ZÅÄÖ]{2,3}-\d{1,3}$")
_URL = re.compile(r"^(?:https?|ftp)://\S+$", re.I)
_UUID = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.I)
_HEX_HASH = re.compile(r"^(?:[0-9a-fA-F]{32}|[0-9a-fA-F]{40}|[0-9a-fA-F]{64})$")
_POSTCODE = re.compile(r"^\d{5}$")
_COORDINATE = re.compile(r"^-?\d{1,3}\.\d{3,}$")
_TIMESTAMP = re.compile(r"^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}|^\d{1,2}\.\d{1,2}\.\d{4} \d{1,2}[:.]\d{2}")
_DATE = re.compile(r"^(?:\d{4}-\d{2}-\d{2}|\d{1,2}\.\d{1,2}\.\d{2,4}|\d{2}/\d{2}/\d{2,4})$")
_PERIOD = re.compile(r"^\d{4}-\d{2}(?:/\d)?$|^\d{4}-?W\d{2}$|^\d{4}Q\d$")
_TIME_ONLY = re.compile(r"^\d{1,2}:\d{2}(:\d{2})?$")
_PERSON = re.compile(r"^[A-ZÅÄÖ][a-zåäöéü'-]+(?:[ -][A-ZÅÄÖ][a-zåäöéü'-]+){1,3}$|^[A-ZÅÄÖ'-]{3,}(?: [A-ZÅÄÖa-zåäö'-]+){1,3}$")
_ADDRESS = re.compile(r"^[A-ZÅÄÖ][\wåäöÅÄÖ-]*(?:\s[\wåäöÅÄÖ-]+)?\s\d{1,4}(?:\s?[A-Z])?(?:\s\d{1,3})?(?:,.*)?$")
_ICD10 = re.compile(r"^[A-TV-Z]\d{2}(?:\.\d{1,2})?$")
_DECIMAL_COMMA = re.compile(r"^-?\d[\d ]*,\d+$")
_MONEY = re.compile(r"^-?\d{1,3}(?: \d{3})+,\d{2}$")
_USER_AGENT = re.compile(r"^(?:Mozilla|curl|python-requests|Outlook|okhttp)/?", re.I)
_HOSTNAME = re.compile(r"^(?:[A-Z]{2,5}-[A-Z0-9-]{3,}|(?=[^.]*[a-z])[a-z0-9-]+(?:\.[a-z0-9-]+)+)$")  # needs a letter, so 49.85 isn't a host
_CODE_ID = re.compile(r"^[A-Za-z]{1,6}[-_]?\d{3,}$")
_FILE_PATH = re.compile(r"^(?:[A-Za-z]:\\|/[\w.-]+/)")


def is_national_id(value: str) -> bool:
    found = _NATIONAL_ID.match(value)
    if not found:
        return False
    day, month = int(found.group(1)), int(found.group(2))
    return 1 <= day <= 31 and 1 <= month <= 12


def is_card(value: str) -> bool:
    return bool(re.fullmatch(r"[\d -]{13,23}", value)) and luhn_ok(value)


def is_ip(value: str) -> bool:
    return bool(_IPV4.match(value) or ":" in value) and ip_ok(value)


def is_iban(value: str) -> bool:
    return value[:2].isalpha() and iban_ok(value.upper())


PATTERNS = {
    "national_id": is_national_id,
    "email": lambda v: bool(_EMAIL.match(v)),
    "phone": lambda v: bool(_PHONE.match(v)),
    "iban": is_iban,
    "card": is_card,
    "ip": is_ip,
    "mac": lambda v: bool(_MAC.match(v)),
    "plate": lambda v: bool(_PLATE.match(v)),
    "url": lambda v: bool(_URL.match(v)),
    "uuid": lambda v: bool(_UUID.match(v)),
    "hex_hash": lambda v: bool(_HEX_HASH.match(v)),
    "postcode": lambda v: bool(_POSTCODE.match(v)),
    "coordinate": lambda v: bool(_COORDINATE.match(v)),
    "timestamp": lambda v: bool(_TIMESTAMP.match(v)),
    "date": lambda v: bool(_DATE.match(v)),
    "period": lambda v: bool(_PERIOD.match(v)),
    "time_only": lambda v: bool(_TIME_ONLY.match(v)),
    "person": lambda v: bool(_PERSON.match(v)),
    "address": lambda v: bool(_ADDRESS.match(v)),
    "icd10": lambda v: bool(_ICD10.match(v)),
    "decimal_comma": lambda v: bool(_DECIMAL_COMMA.match(v)),
    "money": lambda v: bool(_MONEY.match(v)),
    "user_agent": lambda v: bool(_USER_AGENT.match(v)),
    "hostname": lambda v: bool(_HOSTNAME.match(v)),
    "code_id": lambda v: bool(_CODE_ID.match(v)),
    "file_path": lambda v: bool(_FILE_PATH.match(v)),
}
