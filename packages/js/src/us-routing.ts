import { ok, fail, type ValidationResult } from "./result.js";

/**
 * Validate a US ABA routing transit number.
 *
 * Checks (in order):
 *   1. Normalise (strip spaces and hyphens).
 *   2. Digits only (INVALID_FORMAT).
 *   3. Exactly 9 digits (INVALID_LENGTH).
 *   4. First two digits in an ABA prefix range (INVALID_FORMAT):
 *        00–12, 21–32, 61–72, or 80.
 *   5. Weighted checksum (INVALID_CHECKSUM):
 *        (3*(d1+d4+d7) + 7*(d2+d5+d8) + 1*(d3+d6+d9)) mod 10 === 0
 */
export function validateUsRouting(input: string): ValidationResult {
  const clean = input.replace(/[\s-]+/g, "");

  if (!/^\d+$/.test(clean)) return fail(clean, "INVALID_FORMAT");
  if (clean.length !== 9) return fail(clean, "INVALID_LENGTH");

  const prefix = Number(clean.slice(0, 2));
  const prefixOk =
    (prefix >= 0 && prefix <= 12) ||
    (prefix >= 21 && prefix <= 32) ||
    (prefix >= 61 && prefix <= 72) ||
    prefix === 80;
  if (!prefixOk) return fail(clean, "INVALID_FORMAT");

  const d = clean.split("").map(Number);
  const sum =
    3 * (d[0]! + d[3]! + d[6]!) +
    7 * (d[1]! + d[4]! + d[7]!) +
    (d[2]! + d[5]! + d[8]!);
  return sum % 10 === 0 ? ok(clean) : fail(clean, "INVALID_CHECKSUM");
}
