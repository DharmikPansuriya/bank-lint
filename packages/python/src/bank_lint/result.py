"""Shared result type returned by every validator."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, Optional

ValidationError = Literal[
    "INVALID_FORMAT",
    "INVALID_LENGTH",
    "INVALID_CHECKSUM",
    "UNSUPPORTED_COUNTRY",
]


@dataclass(frozen=True)
class ValidationResult:
    valid: bool
    value: str
    error: Optional[ValidationError] = None


def ok(value: str) -> ValidationResult:
    return ValidationResult(valid=True, value=value, error=None)


def fail(value: str, error: ValidationError) -> ValidationResult:
    return ValidationResult(valid=False, value=value, error=error)