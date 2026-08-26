import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { validateUsRouting } from "../src/us-routing.js";

const here = dirname(fileURLToPath(import.meta.url));
const vectors = JSON.parse(
  readFileSync(resolve(here, "../../../test-vectors/us-routing.json"), "utf8"),
) as Array<{
  input: string;
  valid: boolean;
  note: string;
  error?: string;
}>;

describe("validateUsRouting", () => {
  for (const v of vectors) {
    it(`${v.valid ? "accepts" : "rejects"} ${JSON.stringify(v.input)}`, () => {
      const result = validateUsRouting(v.input);
      expect(result.valid).toBe(v.valid);
      if (v.error) expect(result.error).toBe(v.error);
      else if (v.valid) expect(result.error).toBeNull();
    });
  }
});
