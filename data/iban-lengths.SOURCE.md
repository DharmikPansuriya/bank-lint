# IBAN lengths — source

- Source: SWIFT IBAN Registry (the ISO 13616 registration authority),
  IBAN length column.
- Last verified: 2026-08-23 — all 89 entries matched the registry exactly.
- Count: 89 countries (complete registry as of that date).

## How to re-verify

Get the current IBAN Registry from swift.com, diff its "IBAN length" column
against this file, update the JSON, re-run scripts/gen-iban-lengths.mjs, and
bump "Last verified".
