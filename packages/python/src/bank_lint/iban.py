"""IBAN validation using the ISO 7064 mod-97 checksum."""

from __future__ import annotations

import re

from bank_lint.result import ValidationResult, ok, fail
from bank_lint.iban_lengths import IBAN_LENGTHS

IBAN_RE = re.compile(r"^[A-Z]{2}[0-9]{2}[A-Z0-9]+$")


def validate_iban(value: str) -> ValidationResult:
    """Validate an IBAN using the ISO 7064 mod-97 checksum."""
    clean = "".join(value.split()).upper()

    # 2. Overall format.
    if not IBAN_RE.match(clean):
        return fail(clean, "INVALID_FORMAT")

    # 3. Country code must be known, and length must match that country.
    country = clean[:2]
    if country not in IBAN_LENGTHS:
        return fail(clean, "UNSUPPORTED_COUNTRY")
    if len(clean) != IBAN_LENGTHS[country]:
        return fail(clean, "INVALID_LENGTH")

    # 4. Move the first four characters to the end.
    rearranged = clean[4:] + clean[:4]

    # 5. Replace each letter with two digits (A=10 … Z=35); digits stay.
    converted = ""
    for ch in rearranged:
        if ch.isdigit():
            converted += ch          # keep digits as-is
        else:
            converted += str(ord(ch) - 55) 

    # 6-7. Valid when the whole number leaves remainder 1 mod 97.
    if int(converted) % 97 == 1:
        return ok(clean)
    return fail(clean, "INVALID_CHECKSUM")