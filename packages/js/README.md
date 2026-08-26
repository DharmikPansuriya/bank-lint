# bank-lint

Validate bank and account details offline — no API calls, no dependencies.

**Supports IBAN** (ISO 7064 mod-97, 89 countries) and **US ABA routing numbers**.
UK sort codes are coming in a later release.

Part of a dual-language project: the same validation logic, verified against the
same test vectors, is also available for Python as [`bank-lint` on PyPI](https://pypi.org/project/bank-lint/).

## Install

    npm install bank-lint

## Usage

    import { validateIban, validateUsRouting } from "bank-lint";

    validateIban("GB82 WEST 1234 5698 7654 32");
    // { valid: true, value: "GB82WEST12345698765432", error: null }

    validateUsRouting("021000021");
    // { valid: true, value: "021000021", error: null }

Spaces and lower-case are handled for you; `value` is the normalised input.

## API

### `validateIban(input: string): ValidationResult`

ISO 7064 mod-97 checksum plus per-country length.

### `validateUsRouting(input: string): ValidationResult`

9-digit ABA routing number: prefix range + weighted checksum.
Spaces and hyphens are stripped.

    interface ValidationResult {
      valid: boolean;
      value: string;                 // normalised (spaces/hyphens removed)
      error: ValidationError | null; // null when valid
    }

    type ValidationError =
      | "INVALID_FORMAT"        // pattern or ABA prefix fails
      | "INVALID_LENGTH"        // wrong length
      | "INVALID_CHECKSUM"      // fails the checksum
      | "UNSUPPORTED_COUNTRY";  // IBAN country code not in the registry

## Scope

bank-lint checks the **structural** validity of a bank identifier — format,
length, and checksum. It does **not**:

- confirm the account actually exists or is open,
- do name matching or Confirmation of Payee,
- look up bank or branch details.

Country IBAN lengths are sourced from the official SWIFT IBAN Registry.

## License

MIT
