# bank-lint

Validate bank and account details offline — no API calls, no dependencies.

**v0.1 supports IBAN** (ISO 7064 mod-97 checksum + per-country length across
89 countries). US routing numbers and UK sort codes are coming in later releases.

Part of a dual-language project: the same validation logic, verified against the
same test vectors, is also available for JavaScript/TypeScript as
[`bank-lint` on npm](https://www.npmjs.com/package/bank-lint).

## Install

    pip install bank-lint

## Usage

    from bank_lint import validate_iban

    validate_iban("GB82 WEST 1234 5698 7654 32")
    # ValidationResult(valid=True, value='GB82WEST12345698765432', error=None)

    validate_iban("GB82 WEST 1234 5698 7654 33")
    # ValidationResult(valid=False, value='GB82WEST12345698765433', error='INVALID_CHECKSUM')

Spaces and lower-case are handled for you; `value` is the normalised input.

## API

### `validate_iban(value: str) -> ValidationResult`

`ValidationResult` is a frozen dataclass:

    valid: bool
    value: str                    # normalised (spaces removed, upper-cased)
    error: str | None             # None when valid

`error` is one of:

- `"INVALID_FORMAT"` — doesn't match the IBAN pattern
- `"INVALID_LENGTH"` — wrong length for that country
- `"INVALID_CHECKSUM"` — fails the mod-97 check
- `"UNSUPPORTED_COUNTRY"` — country code not in the registry

## Scope

bank-lint checks the **structural** validity of a bank identifier — format,
length, and checksum. It does **not**:

- confirm the account actually exists or is open,
- do name matching or Confirmation of Payee,
- look up bank or branch details.

Country IBAN lengths are sourced from the official SWIFT IBAN Registry.

## License

MIT
