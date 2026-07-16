#!/usr/bin/env node
// =============================================================================
// Focused safety tests for the bootstrap-safe seed apply/verify logic.
// =============================================================================
// Dependency-free and DB-free: exercises the pure helpers in phase-1-shared.mjs
// (which encode the real importer/verifier semantics) plus static source
// inspection of the verifier. Proves the production-safety guarantees without
// connecting to any Supabase project.
// =============================================================================

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  resolveUpsertOptions,
  evaluateCounts,
  findMissingSeedIds,
  simulateApply,
} from "./phase-1-shared.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
let failures = 0;
function assert(name, condition, detail = "") {
  const ok = !!condition;
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

console.log("Seed safety tests\n" + "-".repeat(60));

// Fixtures: a "remote" table that already holds a dashboard-created product and
// a dashboard EDIT to a seeded product.
const seedRows = [
  { id: "prod_arabic_bread", sort_order: 0, name: "Arabic Bread" },
  { id: "prod_toast", sort_order: 1, name: "Toast" },
];
const remoteRows = [
  { id: "prod_arabic_bread", sort_order: 99, name: "Arabic Bread (dashboard edit)" },
  { id: "prod_toast", sort_order: 1, name: "Toast" },
  { id: "prod_dashboard_new", sort_order: 5, name: "Dashboard-created product" },
];

// 1. An extra dashboard-created product does not fail verification.
{
  const remoteCount = remoteRows.length; // 3
  const seedBaseline = seedRows.length; // 2
  const { ok, extras } = evaluateCounts({ remoteCount, seedBaseline });
  const missing = findMissingSeedIds({
    seedIds: seedRows.map((r) => r.id),
    remoteIds: remoteRows.map((r) => r.id),
  });
  assert("1. extra dashboard product does not fail verification", ok && missing.length === 0, `extras=${extras}`);
}

// 2. An edited seeded product is NOT overwritten by safe default apply.
{
  const after = simulateApply({ remoteRows, seedRows, overwriteExisting: false });
  const bread = after.find((r) => r.id === "prod_arabic_bread");
  assert(
    "2. safe default apply preserves dashboard edit to seeded row",
    bread.sort_order === 99 && bread.name.includes("dashboard edit"),
    `sort_order=${bread.sort_order}`
  );
}

// 3. A missing seed ID is inserted by safe default apply.
{
  const remoteMissingToast = remoteRows.filter((r) => r.id !== "prod_toast");
  const after = simulateApply({ remoteRows: remoteMissingToast, seedRows, overwriteExisting: false });
  const toast = after.find((r) => r.id === "prod_toast");
  assert("3. missing seed id is inserted", !!toast, toast ? "prod_toast present" : "absent");
}

// 4. A second apply creates no duplicates and preserves counts.
{
  const first = simulateApply({ remoteRows, seedRows, overwriteExisting: false });
  const second = simulateApply({ remoteRows: first, seedRows, overwriteExisting: false });
  const ids = second.map((r) => r.id);
  const uniqueIds = new Set(ids);
  assert(
    "4. second apply creates no duplicates / stable count",
    ids.length === uniqueIds.size && second.length === first.length,
    `count=${second.length}`
  );
}

// 5. Default verifier performs NO writes (static source inspection).
// 6. No UPDATE or DELETE targets a real seeded product.
{
  const verifierSrc = readFileSync(join(HERE, "verify-phase-1-supabase.mjs"), "utf8");
  // .update( / .delete( must never appear on content tables. The only delete is
  // the synthetic form_enquiries cleanup inside the gated write probe.
  const updateCalls = [...verifierSrc.matchAll(/\.update\(/g)].length;
  const deleteCalls = [...verifierSrc.matchAll(/\.delete\(/g)].length;
  const insertCalls = [...verifierSrc.matchAll(/\.insert\(/g)].length;
  assert("5a. verifier has no .update() calls at all", updateCalls === 0, `found ${updateCalls}`);
  // Any insert/delete must be within the write-probe function, which is gated
  // by --allow-write-probes and operates on form_enquiries only.
  const gated = /ALLOW_WRITE_PROBES/.test(verifierSrc) && /formEnquiriesWriteProbe/.test(verifierSrc);
  assert("5b. any write is gated behind --allow-write-probes", gated && insertCalls <= 1 && deleteCalls <= 1,
    `insert=${insertCalls}, delete=${deleteCalls}`);
  // No write call references a product id.
  const productWrite = /\.(update|delete)\([^)]*\)[\s\S]{0,120}prod_/.test(verifierSrc) ||
    /prod_arabic_bread[\s\S]{0,60}\.(update|delete)\(/.test(verifierSrc);
  assert("6. no UPDATE/DELETE probe targets a real seeded product", !productWrite);
  // The write probe (if present) only names form_enquiries as its write target.
  const deleteTargetsFormEnquiries = deleteCalls === 0 ||
    /from\("form_enquiries"\)\s*\.delete\(/.test(verifierSrc.replace(/\s+/g, " "));
  assert("6b. the only delete targets form_enquiries", deleteTargetsFormEnquiries);
}

// 7. Additional form_enquiries rows do not fail verification.
// form_enquiries is never count-checked; simulate the baseline rule directly.
{
  const { ok } = evaluateCounts({ remoteCount: 25, seedBaseline: 0 });
  assert("7. extra form_enquiries rows do not fail verification", ok, "25 >= 0 baseline");
}

// 8. Overwrite mode cannot run accidentally (must be explicit).
{
  const dflt = resolveUpsertOptions({});
  const overwrite = resolveUpsertOptions({ overwriteExisting: true });
  assert(
    "8a. default apply preserves existing rows (ignoreDuplicates=true)",
    dflt.ignoreDuplicates === true && dflt.onConflict === "id"
  );
  assert(
    "8b. overwrite is opt-in only (ignoreDuplicates=false)",
    overwrite.ignoreDuplicates === false
  );
  // The db:seed:apply script must NOT contain --overwrite-existing.
  const pkg = JSON.parse(readFileSync(join(HERE, "..", "package.json"), "utf8"));
  const applyScript = pkg.scripts["db:seed:apply"] || "";
  const overwriteScript = pkg.scripts["db:seed:overwrite"] || "";
  assert(
    "8c. db:seed:apply does not enable overwrite",
    !/--overwrite-existing/.test(applyScript) && /--overwrite-existing/.test(overwriteScript)
  );
}

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} safety test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ All seed-safety tests passed.");
