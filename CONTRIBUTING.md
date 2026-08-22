# Contributing to bank-lint

Thanks for your interest in bank-lint. This is a dual-language library
(JavaScript/TypeScript and Python) with one guiding rule.

## The parity rule

bank-lint must behave **identically** in both languages. So:

1. Behaviour is defined by the shared vectors in `test-vectors/*.json`.
2. Any change to validation behaviour must:
   - update or add a case in the relevant `test-vectors/*.json` file, and
   - be implemented in **both** `packages/js` and `packages/python`, and
   - keep both test suites green.

A change that touches only one language will not be merged.

## Reference data

Validation data (e.g. IBAN lengths, UK modulus tables) lives in `data/*.json`
as the single source of truth. The per-language files are generated from it —
edit the JSON, then re-run the generator in `scripts/`. Never hand-edit a
generated file (they carry an "AUTO-GENERATED" header).

## Running the tests

JavaScript:

    cd packages/js
    npm install
    npm test

Python:

    cd packages/python
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -e ".[dev]"
    python -m pytest

## Fixing a bug

Add a failing case to the relevant `test-vectors/*.json` first (red), then fix
it in both languages until green. That case becomes a permanent regression test.

## Commit messages

Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`.
Keep commits small and focused.

## Scope

bank-lint checks the **structural** validity of bank identifiers (format,
length, checksum). It does **not** confirm an account exists or is open, do
name matching, or Confirmation of Payee. Those are out of scope.
