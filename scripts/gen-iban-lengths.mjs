// Generates the per-language IBAN length tables from data/iban-lengths.json.
// Run from the repo root:  node scripts/gen-iban-lengths.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(
  readFileSync(resolve(root, "data/iban-lengths.json"), "utf8"),
);
const rows = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));

const ts = `// AUTO-GENERATED from data/iban-lengths.json — do not edit by hand.
export const IBAN_LENGTHS: Record<string, number> = {
${rows.map(([k, v]) => `  ${k}: ${v},`).join("\n")}
};
`;
writeFileSync(resolve(root, "packages/js/src/iban-lengths.ts"), ts);

const py = `"""AUTO-GENERATED from data/iban-lengths.json — do not edit by hand."""

IBAN_LENGTHS = {
${rows.map(([k, v]) => `    "${k}": ${v},`).join("\n")}
}
`;
writeFileSync(
  resolve(root, "packages/python/src/bank_lint/iban_lengths.py"),
  py,
);

console.log(`Generated IBAN_LENGTHS for ${rows.length} countries.`);
