"""US ABA routing transit number validation."""

from __future__ import annotations

import re

from bank_lint.result import ValidationResult, ok, fail

_DIGITS = re.compile(r"^\d+$")


def validate_us_routing(value: str) -> ValidationResult:
    """Validate a US ABA routing transit number.

    Checks (in order):
      1. Normalise (strip spaces and hyphens).
      2. Digits only (INVALID_FORMAT).
      3. Exactly 9 digits (INVALID_LENGTH).
      4. First two digits in an ABA prefix range (INVALID_FORMAT):
           00–12, 21–32, 61–72, or 80.
      5. Weighted checksum (INVALID_CHECKSUM):
           (3*(d1+d4+d7) + 7*(d2+d5+d8) + 1*(d3+d6+d9)) mod 10 == 0
    """
    clean = "".join(value.split()).replace("-", "")

    if not _DIGITS.match(clean):
        return fail(clean, "INVALID_FORMAT")
    if len(clean) != 9:
        return fail(clean, "INVALID_LENGTH")

    prefix = int(clean[:2])
    prefix_ok = (
        0 <= prefix <= 12
        or 21 <= prefix <= 32
        or 61 <= prefix <= 72
        or prefix == 80
    )
    if not prefix_ok:
        return fail(clean, "INVALID_FORMAT")

    d = [int(ch) for ch in clean]
    total = (
        3 * (d[0] + d[3] + d[6])
        + 7 * (d[1] + d[4] + d[7])
        + (d[2] + d[5] + d[8])
    )
    if total % 10 == 0:
        return ok(clean)
    return fail(clean, "INVALID_CHECKSUM")
