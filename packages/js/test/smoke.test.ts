import { describe, it, expect } from "vitest";
import { VERSION } from "../src/index.js";

describe("bank-lint", () => {
  it("exposes a version", () => {
    expect(VERSION).toBe("0.0.1");
  });
});
