# Contributing to bank-lint

bank-lint is a dual-language library (JavaScript/TypeScript and Python) with
one guiding rule.

## The parity rule

bank-lint must behave **identically** in both languages. So any change to
validation behaviour must:

1. update or add a case in the relevant `test-vectors/*.json` file, and
2. be implemented in **both** `packages/js` and `packages/python`, and
3. keep both test suites green.

A change that touches only one language will not be merged.

## Reference data

Validation data (e.g. IBAN lengths) lives in `data/*.json` as the single
source of truth. Per-language files are generated from it via `scripts/` —
edit the JSON, re-run the generator, never hand-edit an "AUTO-GENERATED" file.

## Running the tests

JavaScript:

    cd packages/js && npm install && npm test

Python:

    cd packages/python
    python3 -m venv .venv && source .venv/bin/activate
    pip install -e ".[dev]"
    python -m pytest

## Fixing a bug

Add a failing case to `test-vectors/*.json` first (red), then fix it in both
languages until green.

## Commit messages

Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.

## Scope

bank-lint checks the **structural** validity of bank identifiers (format,
length, checksum). It does **not** confirm an account exists, do name
matching, or Confirmation of Payee. Those are out of scope.
