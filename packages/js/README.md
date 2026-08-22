# bank-lint

Validate bank and account details offline — no API calls, no dependencies.

**v0.1.0 supports IBAN** (ISO 7064 mod-97 checksum + per-country length across
89 countries). US routing numbers and UK sort codes are coming in later releases.

Part of a dual-language project: the same validation logic, verified against the
same test vectors, is also available for Python as [`bank-lint` on PyPI](https://pypi.org/project/bank-lint/).

## Install

    npm install bank-lint

## Usage

    import { validateIban } from "bank-lint";

    validateIban("GB82 WEST 1234 5698 7654 32");
    // { valid: true, value: "GB82WEST12345698765432", error: null }

    validateIban("GB82 WEST 1234 5698 7654 33");
    // { valid: false, value: "GB82WEST12345698765433", error: "INVALID_CHECKSUM" }

Spaces and lower-case are handled for you; `value` is the normalised input.

## API

### `validateIban(input: string): ValidationResult`

    interface ValidationResult {
      valid: boolean;
      value: string;                 // normalised (spaces removed, upper-cased)
      error: ValidationError | null; // null when valid
    }

    type ValidationError =
      | "INVALID_FORMAT"        // doesn't match the IBAN pattern
      | "INVALID_LENGTH"        // wrong length for that country
      | "INVALID_CHECKSUM"      // fails the mod-97 check
      | "UNSUPPORTED_COUNTRY";  // country code not in the registry

## Scope

bank-lint checks the **structural** validity of a bank identifier — format,
length, and checksum. It does **not**:

- confirm the account actually exists or is open,
- do name matching or Confirmation of Payee,
- look up bank or branch details.

Country IBAN lengths are sourced from the official SWIFT IBAN Registry.

## License

MIT
