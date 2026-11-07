"""Rules for values strong enough to decide a column without the model, each with a reason a person can read."""
from __future__ import annotations

from datetime import date

from ..domain.column_profile import ColumnProfile

STRONG = 0.85
BIRTH_SPREAD_YEARS = 25  # a population's birth years span decades
ADULT_YEARS = 18  # and most were born at least this long ago
ID_ROLE, TECH_ROLE = "direct_identifier", "technical_identifier"
_RULES = [  # pattern, role, subtype, description
    ("national_id", ID_ROLE, "NATIONAL_ID", "Finnish ID number format"),
    ("iban", ID_ROLE, "IBAN", "IBAN checksum passes"),
    ("card", ID_ROLE, "PAYMENT_CARD", "card number checksum passes"),
    ("plate", ID_ROLE, "LICENSE_PLATE", "licence plate format"),
    ("mac", TECH_ROLE, "MAC_ADDRESS", "MAC address format"),
    ("ip", TECH_ROLE, "IP_ADDRESS", "IP address format"),
    ("hex_hash", TECH_ROLE, "OTHER", "hash-length hexadecimal values"),
    ("address", ID_ROLE, "STREET_ADDRESS", "street address format"),
    ("period", "non_sensitive", "DATE", "reporting period format"),
    ("money", "sensitive_attribute", "FINANCIAL_DATA", "amounts written with thousands and decimals"),
]


def _birth_dates(profile: ColumnProfile):
    share = profile.pattern_shares.get("date", 0.0)
    spread = profile.year_high - profile.year_low
    if share >= STRONG and spread >= BIRTH_SPREAD_YEARS and 0 < profile.year_mid <= date.today().year - ADULT_YEARS:
        return "quasi_identifier", "BIRTH_DATE", f"{share:.0%} of values are dates from {profile.year_low} to {profile.year_high}, the spread of birth dates"
    return None


def strong_evidence(profile: ColumnProfile):
    for pattern, role, subtype, description in _RULES:
        share = profile.pattern_shares.get(pattern, 0.0)
        if share >= STRONG:
            return role, subtype, f"{share:.0%} of values match: {description}"
    return _birth_dates(profile)


def describe_evidence(profile: ColumnProfile) -> list:
    """The strongest measured signals, for the field record."""
    ranked = sorted(profile.pattern_shares.items(), key=lambda item: -item[1])
    reasons = [f"{share:.0%} of values look like {name}" for name, share in ranked[:2] if share >= 0.3]
    if profile.mean_tokens >= 5:
        reasons.append(f"long text, about {profile.mean_tokens:.0f} words per value")
    if profile.distinct_share >= 0.95:
        reasons.append("nearly every value is unique")
    elif profile.distinct <= 12:
        reasons.append(f"only {profile.distinct} distinct values")
    return reasons
