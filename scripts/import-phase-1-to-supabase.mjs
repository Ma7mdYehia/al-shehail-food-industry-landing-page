#!/usr/bin/env node
// =============================================================================
// Phase 1 seed importer — data/seed/phase-1/*.json  ->  Supabase
// =============================================================================
// The Phase 1 seed is BOOTSTRAP data, not the permanent authority once the
// dashboard is in use. This importer is safe by default:
//
//   * DRY RUN unless `--apply` is passed (no connection, no write).
//   * On `--apply` it INSERTS genuinely missing deterministic seed rows and
//     PRESERVES existing rows (ON CONFLICT DO NOTHING). It never overwrites a
//     row and never deletes a row by default, so remote tables may hold
//     additional dashboard-created content and dashboard edits are kept.
//   * `--overwrite-existing` opts in to replacing seed-owned rows (ON CONFLICT
//     DO UPDATE). This can clobber dashboard edits to seeded rows and must be
//     used deliberately (exposed as `npm run db:seed:overwrite`).
//   * `--strict-seed-counts` additionally requires each table's remote count to
//     EQUAL the seed baseline (only meaningful for a fresh bootstrap).
//
// A real import writes with the server-only service role and requires:
//   NEXT_PUBLIC_SUPABASE_URL  (public project URL)
//   SUPABASE_SERVICE_ROLE_KEY (server-only secret — used ONLY inside this
//                              trusted script; never printed)
//
// Usage:
//   node scripts/import-phase-1-to-supabase.mjs                       # dry run
//   node scripts/import-phase-1-to-supabase.mjs --apply               # safe import
//   node scripts/import-phase-1-to-supabase.mjs --apply --overwrite-existing
//   node scripts/import-phase-1-to-supabase.mjs --apply --strict-seed-counts
// =============================================================================

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  IMPORT_ORDER,
  TABLE_DEFS,
  preflightValidate,
  hostOnly,
  resolveUpsertOptions,
  evaluateCounts,
  findMissingSeedIds,
} from "./phase-1-shared.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const APPLY = argv.includes("--apply");
const OVERWRITE_EXISTING = argv.includes("--overwrite-existing");
const STRICT_SEED_COUNTS = argv.includes("--strict-seed-counts");

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
  const mode = APPLY
    ? `APPLY (${OVERWRITE_EXISTING ? "OVERWRITE existing rows" : "preserve existing rows"}${
        STRICT_SEED_COUNTS ? ", strict counts" : ""
      })`
    : "DRY RUN (no writes)";
  log("=".repeat(70));
  log(`Phase 1 → Supabase importer  [${mode}]`);
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
  log("Write mode:", OVERWRITE_EXISTING
    ? "OVERWRITE existing seed-owned rows (DO UPDATE) — may replace dashboard edits"
    : "PRESERVE existing rows (DO NOTHING) — inserts only missing seed ids, never deletes");
  log("Count check:", STRICT_SEED_COUNTS
    ? "STRICT — each table must equal the seed baseline"
    : "baseline — remote may contain extra dashboard rows (>= baseline)");
  log("Dependency / import order and seed baseline counts:");
  let total = 0;
  for (const table of IMPORT_ORDER) {
    const n = expectedCounts[table];
    total += n;
    log(`  ${String(n).padStart(4)}  ${table}  (conflict key: ${TABLE_DEFS[table].conflictKey})`);
  }
  log(`  ${String(total).padStart(4)}  TOTAL seed rows across ${IMPORT_ORDER.length} tables`);
  log("  form_enquiries: NOT seeded (grows via the future contact form).");

  if (!APPLY) {
    log("\nDRY RUN complete — no database connection was opened and NO write occurred.");
    log("Re-run with --apply (and Supabase env vars set) to perform a safe import.");
    return;
  }

  // ---- Step 3: APPLY path — require env, connect with service role ----------
  if (!publicUrl) fail("NEXT_PUBLIC_SUPABASE_URL is required for --apply.");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) fail("SUPABASE_SERVICE_ROLE_KEY is required for --apply.");

  if (OVERWRITE_EXISTING) {
    log("\n⚠  OVERWRITE mode: existing seed-owned rows will be REPLACED with seed");
    log("   values. Any dashboard edits to those deterministic ids will be lost.");
  }

  const upsertOptions = resolveUpsertOptions({ overwriteExisting: OVERWRITE_EXISTING });

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(publicUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  log(`\nApplying import (onConflict=${upsertOptions.onConflict}, ignoreDuplicates=${upsertOptions.ignoreDuplicates})…`);
  for (const table of IMPORT_ORDER) {
    const rows = rowsByTable[table];
    const { error } = await supabase.from(table).upsert(rows, upsertOptions);
    if (error) fail(`Upsert into ${table} failed: ${error.message}`);
    log(`  ✓ ${table}: ${rows.length} seed rows applied`);
  }

  // ---- Step 4: post-write verification (bootstrap-safe) --------------------
  // Confirms every deterministic seed id is present, no duplicate ids exist,
  // and the remote count is at least the seed baseline. Extra dashboard rows
  // are reported but NEVER cause a failure (unless --strict-seed-counts).
  log("\nVerifying seed presence and counts…");
  let problem = false;
  for (const table of IMPORT_ORDER) {
    const seedRows = rowsByTable[table];
    const seedIds = seedRows.map((r) => r.id);

    const { data, count, error } = await supabase
      .from(table)
      .select("id", { count: "exact" });
    if (error) fail(`Verification query on ${table} failed: ${error.message}`);

    const remoteIds = (data ?? []).map((r) => r.id);
    const missing = findMissingSeedIds({ seedIds, remoteIds });
    const dupIds = remoteIds.filter((id, i) => remoteIds.indexOf(id) !== i);
    const { ok, extras } = evaluateCounts({
      remoteCount: count,
      seedBaseline: seedIds.length,
      strict: STRICT_SEED_COUNTS,
    });

    const rowProblem = missing.length > 0 || dupIds.length > 0 || !ok;
    if (rowProblem) problem = true;
    const extraNote = extras > 0 ? ` (+${extras} dashboard rows)` : "";
    log(
      `  ${rowProblem ? "✗" : "✓"} ${table}: ${count} rows${extraNote}; ` +
        `seed present ${seedIds.length - missing.length}/${seedIds.length}` +
        (missing.length ? `; MISSING ${missing.length}` : "") +
        (dupIds.length ? `; DUPLICATES ${dupIds.length}` : "")
    );
    if (missing.length) log(`      missing ids: ${missing.slice(0, 10).join(", ")}`);
  }
  if (problem) {
    fail(
      "Post-write verification failed: a seed id is missing, duplicated, or a table " +
        (STRICT_SEED_COUNTS
          ? "does not exactly match the seed baseline (--strict-seed-counts)."
          : "fell below the seed baseline.")
    );
  }

  log("\n✓ Import complete.");
  log("  Safe re-run: this command inserts only missing seed ids, preserves");
  log("  existing rows and dashboard-created content, and creates no duplicates.");
}

main().catch((err) => fail(err?.stack || String(err)));
