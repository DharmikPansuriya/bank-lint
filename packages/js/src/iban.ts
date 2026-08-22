import { ok, fail, type ValidationResult } from "./result.js";
import { IBAN_LENGTHS } from "./iban-lengths.js";

const IBAN_RE = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;

/** Validate an IBAN using the ISO 7064 mod-97 checksum. */
export function validateIban(input: string): ValidationResult {
  const clean = input.replace(/\s+/g, "").toUpperCase();

  // 2. Overall format.
  if (!IBAN_RE.test(clean)) return fail(clean, "INVALID_FORMAT");

  // 3. Country code must be known, and length must match that country.
  const country = clean.slice(0, 2);
  if (!(country in IBAN_LENGTHS)) return fail(clean, "UNSUPPORTED_COUNTRY");
  if (clean.length !== IBAN_LENGTHS[country])
    return fail(clean, "INVALID_LENGTH");

  // 4. Move the first four characters to the end.
  const rearranged = clean.slice(4) + clean.slice(0, 4);

  // 5. Replace each letter with two digits (A=10 … Z=35); digits stay.
  let converted = "";
  for (const ch of rearranged) {
    converted += /[0-9]/.test(ch) ? ch : String(ch.charCodeAt(0) - 55);
  }

  // 6-7. Valid when the whole number leaves remainder 1 mod 97.
  return BigInt(converted) % 97n === 1n
    ? ok(clean)
    : fail(clean, "INVALID_CHECKSUM");
}
