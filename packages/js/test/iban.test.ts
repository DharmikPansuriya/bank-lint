import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { validateIban } from "../src/iban.js";

const here = dirname(fileURLToPath(import.meta.url));
const vectors = JSON.parse(
  readFileSync(resolve(here, "../../../test-vectors/iban.json"), "utf8"),
) as Array<{ input: string; valid: boolean; note: string }>;

describe("validateIban", () => {
  for (const v of vectors) {
    it(`${v.valid ? "accepts" : "rejects"} ${v.input}`, () => {
      expect(validateIban(v.input).valid).toBe(v.valid);
    });
  }
});
