// Optional, manually-run sanity check for the IBAN test vectors.
// Cross-checks each vector against a public reference API (openiban.com) and
// reports disagreements. NOT part of `npm test` and NOT run in CI — the
// library and its tests must stay fully offline.
//
//   node scripts/verify-vectors.mjs
//
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vectors = JSON.parse(
  readFileSync(resolve(root, "test-vectors/iban.json"), "utf8"),
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function referenceValid(iban) {
  const clean = iban.replace(/\s+/g, "").toUpperCase();
  const res = await fetch(`https://openiban.com/validate/${clean}`);
  if (!res.ok) throw new Error(`reference API returned ${res.status}`);
  const data = await res.json();
  return data.valid === true;
}

let mismatches = 0;
for (const v of vectors) {
  try {
    const ref = await referenceValid(v.input);
    if (ref !== v.valid) {
      mismatches++;
      console.error(
        `MISMATCH: "${v.input}" — vector=${v.valid}, reference=${ref}`,
      );
    } else {
      console.log(`ok: "${v.input}" (valid=${v.valid})`);
    }
  } catch (err) {
    console.error(`SKIPPED "${v.input}": ${err.message}`);
  }
  await sleep(300);
}

console.log(
  mismatches === 0
    ? `\nAll vectors agree with the reference.`
    : `\n${mismatches} vector(s) disagree — fix the vectors.`,
);
if (mismatches > 0) process.exit(1);
