#!/usr/bin/env node
// =============================================================================
// Phase 1 seed importer — data/seed/phase-1/*.json  ->  Supabase
// =============================================================================
// Safe by default: this script performs a DRY RUN unless `--apply` is passed.
// A real import writes with the server-only service role and requires:
//   NEXT_PUBLIC_SUPABASE_URL  (public project URL)
//   SUPABASE_SERVICE_ROLE_KEY (server-only secret — used ONLY inside this
//                              trusted script; never printed)
//
// The import is deterministic and idempotent: every table upserts on its
// deterministic text id, so a second identical run creates no duplicates and
// preserves row counts and ids. Rows present remotely but absent from the seed
// are NEVER deleted — this patch is not authorized to do destructive syncs.
//
// Usage:
//   node scripts/import-phase-1-to-supabase.mjs            # dry run (no writes)
//   node scripts/import-phase-1-to-supabase.mjs --apply    # real import
// =============================================================================

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  IMPORT_ORDER,
  TABLE_DEFS,
  preflightValidate,
  hostOnly,
} from "./phase-1-shared.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const APPLY = process.argv.includes("--apply");

function log(...args) {
  console.log(...args);
}

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

// ---- Step 1: run the existing seed validator before any DB operation --------
function runSeedValidator() {
  log("Running seed validator (scripts/validate-phase-1-seed.mjs)…");
  const res = spawnSync(process.execPath, [join(HERE, "validate-phase-1-seed.mjs")], {
    stdio: "inherit",
  });
  if (res.status !== 0) fail("Seed validation failed — aborting before any database access.");
}

async function main() {
  log("=".repeat(70));
  log(`Phase 1 → Supabase importer  [${APPLY ? "APPLY (writes enabled)" : "DRY RUN (no writes)"}]`);
  log("=".repeat(70));

  runSeedValidator();

  // ---- Step 2: independent pre-flight guard (throws on any problem) ---------
  let plan;
  try {
    plan = preflightValidate();
  } catch (err) {
    fail(err.message);
  }
  const { rowsByTable, expectedCounts } = plan;

  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  // ---- Plan summary (printed in both modes) --------------------------------
  log("\nTarget Supabase host:", hostOnly(publicUrl), "(no credentials shown)");
  log("Dependency / import order and expected row counts:");
  let total = 0;
  for (const table of IMPORT_ORDER) {
    const n = expectedCounts[table];
    total += n;
    log(`  ${String(n).padStart(4)}  ${table}  (upsert on ${TABLE_DEFS[table].conflictKey})`);
  }
  log(`  ${String(total).padStart(4)}  TOTAL rows across ${IMPORT_ORDER.length} tables`);
  log("  form_enquiries: NOT seeded (future lead table).");

  if (!APPLY) {
    log("\nDRY RUN complete — no database connection was opened and NO write occurred.");
    log("Re-run with --apply (and Supabase env vars set) to perform the import.");
    return;
  }

  // ---- Step 3: APPLY path — require env, connect with service role ----------
  if (!publicUrl) fail("NEXT_PUBLIC_SUPABASE_URL is required for --apply.");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) fail("SUPABASE_SERVICE_ROLE_KEY is required for --apply.");

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(publicUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  log("\nApplying import (idempotent upserts)…");
  for (const table of IMPORT_ORDER) {
    const def = TABLE_DEFS[table];
    const rows = rowsByTable[table];
    const { error } = await supabase
      .from(table)
      .upsert(rows, { onConflict: def.conflictKey, ignoreDuplicates: false });
    if (error) fail(`Upsert into ${table} failed: ${error.message}`);
    log(`  ✓ ${table}: upserted ${rows.length} rows`);
  }

  // ---- Step 4: post-write count verification -------------------------------
  log("\nVerifying row counts…");
  let mismatch = false;
  for (const table of IMPORT_ORDER) {
    const { count, error } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true });
    if (error) fail(`Count query on ${table} failed: ${error.message}`);
    const expected = expectedCounts[table];
    const ok = count === expected;
    if (!ok) mismatch = true;
    log(`  ${ok ? "✓" : "✗"} ${table}: ${count} (expected ${expected})`);
  }
  if (mismatch) {
    fail(
      "Row counts do not match the seed. This usually means rows exist remotely " +
        "that are not in the seed. This importer does NOT delete un-seeded rows; " +
        "investigate manually."
    );
  }

  log("\n✓ Import complete. Idempotency: re-running this command upserts on id and");
  log("  will not create duplicates or change these counts.");
}

main().catch((err) => fail(err?.stack || String(err)));
