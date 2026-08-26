# bank-lint

Validate bank and account details offline — no API calls, no dependencies.

**Supports IBAN** (ISO 7064 mod-97, 89 countries) and **US ABA routing numbers**.
UK sort codes are coming in a later release.

Part of a dual-language project: the same validation logic, verified against the
same test vectors, is also available for JavaScript/TypeScript as
[`bank-lint` on npm](https://www.npmjs.com/package/bank-lint).

## Install

    pip install bank-lint

## Usage

    from bank_lint import validate_iban, validate_us_routing

    validate_iban("GB82 WEST 1234 5698 7654 32")
    # ValidationResult(valid=True, value='GB82WEST12345698765432', error=None)

    validate_us_routing("021000021")
    # ValidationResult(valid=True, value='021000021', error=None)

Spaces and lower-case are handled for you; `value` is the normalised input.

## API

### `validate_iban(value: str) -> ValidationResult`

ISO 7064 mod-97 checksum plus per-country length.

### `validate_us_routing(value: str) -> ValidationResult`

9-digit ABA routing number: prefix range + weighted checksum.
Spaces and hyphens are stripped.

`ValidationResult` is a frozen dataclass:

    valid: bool
    value: str                    # normalised (spaces/hyphens removed)
    error: str | None             # None when valid

`error` is one of:

- `"INVALID_FORMAT"` — pattern or ABA prefix fails
- `"INVALID_LENGTH"` — wrong length
- `"INVALID_CHECKSUM"` — fails the checksum
- `"UNSUPPORTED_COUNTRY"` — IBAN country code not in the registry

## Scope

bank-lint checks the **structural** validity of a bank identifier — format,
length, and checksum. It does **not**:

- confirm the account actually exists or is open,
- do name matching or Confirmation of Payee,
- look up bank or branch details.

Country IBAN lengths are sourced from the official SWIFT IBAN Registry.

## License

MIT
