# bank-lint

[![CI](https://github.com/DharmikPansuriya/bank-lint/actions/workflows/ci.yml/badge.svg)](https://github.com/DharmikPansuriya/bank-lint/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/bank-lint?label=npm)](https://www.npmjs.com/package/bank-lint)
[![PyPI](https://img.shields.io/pypi/v/bank-lint?label=pypi)](https://pypi.org/project/bank-lint/)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Validate bank and account details offline — the same way in **JavaScript/TypeScript
and Python**. No API calls, no dependencies.

The two implementations are kept in lockstep: they share the same test vectors, so
they behave identically. Validate on your Python backend and your TypeScript frontend
and get the same answer, with the same error codes.

## Status

| Validator                     | Status       |
| ----------------------------- | ------------ |
| IBAN (mod-97, 89 countries)   | ✅ available |
| US ABA routing number         | ✅ available |
| UK sort code + account number | 🚧 planned   |

## Quick start

**JavaScript / TypeScript**

    npm install bank-lint

    import { validateIban, validateUsRouting } from "bank-lint";

    validateIban("GB82 WEST 1234 5698 7654 32");
    // { valid: true, value: "GB82WEST12345698765432", error: null }

    validateIban("GB82 WEST 1234 5698 7654 33");
    // { valid: false, value: "GB82WEST12345698765433", error: "INVALID_CHECKSUM" }

    validateUsRouting("021000021");
    // { valid: true, value: "021000021", error: null }

**Python**

    pip install bank-lint

    from bank_lint import validate_iban, validate_us_routing

    validate_iban("GB82 WEST 1234 5698 7654 32")
    # ValidationResult(valid=True, value='GB82WEST12345698765432', error=None)

    validate_us_routing("021000021")
    # ValidationResult(valid=True, value='021000021', error=None)

Spaces, hyphens, and lower-case are handled for you; `value` is the normalised input.

## Result shape

Every validator returns the same structure:

| Field   | Type                 | Meaning                                  |
| ------- | -------------------- | ---------------------------------------- |
| `valid` | boolean              | whether the value passed all checks      |
| `value` | string               | normalised input (spaces removed, upper) |
| `error` | error code or `null` | why it failed, or `null` when valid      |

Error codes:

- `INVALID_FORMAT` — doesn't match the expected pattern
- `INVALID_LENGTH` — wrong length (for IBAN, wrong length for that country)
- `INVALID_CHECKSUM` — fails the checksum
- `UNSUPPORTED_COUNTRY` — IBAN country code not in the registry

## Scope

bank-lint checks the **structural** validity of a bank identifier — format,
length, and checksum. It does **not**:

- confirm the account actually exists or is open,
- do name matching or Confirmation of Payee,
- look up bank or branch details.

IBAN country lengths are sourced from the official SWIFT IBAN Registry.

## Packages

| Language | Package                                                       | Source                               |
| -------- | ------------------------------------------------------------- | ------------------------------------ |
| JS / TS  | [`bank-lint` on npm](https://www.npmjs.com/package/bank-lint) | [`packages/js`](packages/js)         |
| Python   | [`bank-lint` on PyPI](https://pypi.org/project/bank-lint/)    | [`packages/python`](packages/python) |

## Development

**JavaScript**

    cd packages/js
    npm install
    npm test

**Python**

    cd packages/python
    python3 -m venv .venv && source .venv/bin/activate
    pip install -e ".[dev]"
    python -m pytest

Reference data lives in `data/*.json` as the single source of truth; the
per-language tables are generated from it (see `scripts/`). Never hand-edit a
generated file.

## Releasing

Bump the version in **both** `packages/js/package.json` and
`packages/python/pyproject.toml` to the same number, then publish each.

**npm** (from `packages/js`)

    npm run build
    npm publish --dry-run          # sanity-check files + version
    npm publish --access public    # requires 2FA

**PyPI** (from `packages/python`)

    rm -rf dist/ build/ src/*.egg-info
    python -m build
    twine check dist/*             # must say PASSED
    twine upload dist/*            # user: __token__, password: pypi-... token

Versions are permanent on both registries — always dry-run / `twine check` first.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The core rule: any change to validation
behaviour must land in **both** languages with a matching shared test vector.

## License

[MIT](LICENSE)
