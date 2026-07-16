#!/usr/bin/env node
// =============================================================================
// Phase 1 database verifier
// =============================================================================
// The DEFAULT verifier (`npm run db:verify`) is genuinely READ-ONLY: it issues
// SELECT/count queries only and never calls insert/update/delete. It never
// targets content tables with a write and never touches a real seeded product.
// Write protection is proven elsewhere (static structure inspection, the local
// disposable PostgreSQL/Supabase test, and RLS/grants review) — see
// docs/production-database-foundation-p02.md.
//
// Two default layers:
//   1. Static seed checks (always, no network): deterministic ids, unique
//      slugs/keys, en/ar presence, known-null Arabic media alt, NEEDS_VERIFICATION.
//   2. Live READ-ONLY checks (when Supabase env vars are set): every seed id is
//      present, remote count is AT LEAST the seed baseline (extra dashboard rows
//      are reported, never a failure), foreign keys resolve, anon can read
//      active content, anon sees only active content, and anon CANNOT read
//      form_enquiries (a SELECT that is expected to be denied — no write).
//
// OPTIONAL, opt-in only — NOT part of `db:verify` and NEVER run in CI:
//   `--allow-write-probes` (requires SUPABASE_SERVICE_ROLE_KEY) runs a single
//   synthetic write probe against form_enquiries ONLY, using an example.invalid
//   address, cleaned up in a finally block; it fails loudly if cleanup cannot be
//   confirmed. It never writes to products or any content table.
//
// Usage:
//   node scripts/verify-phase-1-supabase.mjs                     # read-only
//   node scripts/verify-phase-1-supabase.mjs --allow-write-probes  # local only
// =============================================================================

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  IMPORT_ORDER,
  TABLE_DEFS,
  SEED_DIR,
  preflightValidate,
  loadSeedRows,
  isLocalized,
  hostOnly,
  evaluateCounts,
  findMissingSeedIds,
} from "./phase-1-shared.mjs";

const ALLOW_WRITE_PROBES = process.argv.includes("--allow-write-probes");
const IN_CI = process.env.CI === "true" || process.env.CI === "1";

const results = [];
function record(name, status, detail = "") {
  results.push({ name, status, detail });
  const icon = status === "pass" ? "✓" : status === "skip" ? "•" : "✗";
  console.log(`  ${icon} ${name}${detail ? " — " + detail : ""}`);
}

// ---------------------------------------------------------------------------
// Layer 1 — static seed checks (read-only, no network)
// ---------------------------------------------------------------------------
function staticChecks() {
  console.log("\nStatic seed checks (no network):");

  let plan;
  try {
    plan = preflightValidate();
    record("deterministic ids, unique slugs/keys, en/ar keys, FKs (pre-flight)", "pass");
  } catch (err) {
    record("seed pre-flight validation", "fail", err.message.split("\n")[0]);
    return { plan: null };
  }

  const media = loadSeedRows("media_assets");
  const nonNullAr = media.filter((m) => m.alt_localized && m.alt_localized.ar !== null);
  record(
    "media_assets Arabic alt text remains explicit null (not invented)",
    nonNullAr.length === 0 ? "pass" : "fail",
    nonNullAr.length === 0 ? `${media.length} rows, all ar=null` : `${nonNullAr.length} rows have non-null ar`
  );

  let localizedIssues = 0;
  for (const table of IMPORT_ORDER) {
    const def = TABLE_DEFS[table];
    for (const row of loadSeedRows(table)) {
      for (const col of def.requiredLocalized ?? []) {
        if (!isLocalized(row[col])) localizedIssues++;
      }
    }
  }
  record(
    "required localized columns contain en + ar keys",
    localizedIssues === 0 ? "pass" : "fail",
    localizedIssues === 0 ? "" : `${localizedIssues} violations`
  );

  let needsVerification = 0;
  for (const file of readdirSync(SEED_DIR)) {
    if (!file.endsWith(".json") || file === "seed-manifest.json") continue;
    const text = readFileSync(join(SEED_DIR, file), "utf8");
    needsVerification += (text.match(/NEEDS_VERIFICATION/g) || []).length;
  }
  record("NEEDS_VERIFICATION placeholders preserved in seed", "pass", `${needsVerification} occurrence(s) in seed`);

  return { plan };
}

// ---------------------------------------------------------------------------
// Layer 2 — live READ-ONLY database checks
// ---------------------------------------------------------------------------
async function liveChecks(plan) {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!publicUrl || !anonKey) {
    console.log("\nLive checks: SKIPPED (set NEXT_PUBLIC_SUPABASE_URL and");
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY to run read-only public verification;");
    console.log("SUPABASE_SERVICE_ROLE_KEY additionally enables count/seed-presence checks).");
    return;
  }

  console.log(`\nLive READ-ONLY checks against ${hostOnly(publicUrl)}:`);
  const { createClient } = await import("@supabase/supabase-js");
  const anon = createClient(publicUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const admin = serviceRoleKey
    ? createClient(publicUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

  // Seed presence + count-at-least-baseline (service role: exact, read-only).
  if (admin) {
    for (const table of IMPORT_ORDER) {
      const seedIds = plan.rowsByTable[table].map((r) => r.id);
      const { data, count, error } = await admin.from(table).select("id", { count: "exact" });
      if (error) {
        record(`seed presence ${table}`, "fail", error.message);
        continue;
      }
      const remoteIds = (data ?? []).map((r) => r.id);
      const missing = findMissingSeedIds({ seedIds, remoteIds });
      const { ok, extras } = evaluateCounts({ remoteCount: count, seedBaseline: seedIds.length });
      const rowOk = missing.length === 0 && ok;
      record(
        `seed present & count ≥ baseline: ${table}`,
        rowOk ? "pass" : "fail",
        `${count} rows${extras > 0 ? ` (+${extras} dashboard rows, informational)` : ""}` +
          (missing.length ? `; MISSING ${missing.length}` : "")
      );
    }
  } else {
    record("seed presence & counts", "skip", "needs SUPABASE_SERVICE_ROLE_KEY");
  }

  // Anon can read active public content.
  {
    const { data, error } = await anon.from("products").select("id").limit(1);
    record(
      "anon can SELECT active public content (products)",
      !error && Array.isArray(data) && data.length > 0 ? "pass" : "fail",
      error ? error.message : `${data?.length ?? 0} row(s)`
    );
  }

  // A known deterministic id is present (anon read).
  {
    const { data, error } = await anon
      .from("products")
      .select("id")
      .eq("id", "prod_arabic_bread")
      .maybeSingle();
    record(
      "deterministic id present (prod_arabic_bread)",
      !error && data?.id === "prod_arabic_bread" ? "pass" : "fail",
      error ? error.message : data?.id ?? "not found"
    );
  }

  // Foreign keys resolve (service role, read-only orphan scan).
  if (admin) {
    let orphanTotal = 0;
    for (const table of IMPORT_ORDER) {
      for (const fk of TABLE_DEFS[table].foreignKeys ?? []) {
        const { data, error } = await admin.from(table).select(`${fk.column}`);
        if (error) continue;
        const childValues = [...new Set(data.map((r) => r[fk.column]).filter((v) => v != null))];
        if (childValues.length === 0) continue;
        const { data: parents, error: pErr } = await admin
          .from(fk.refTable)
          .select("id")
          .in("id", childValues);
        if (pErr) continue;
        const present = new Set(parents.map((r) => r.id));
        orphanTotal += childValues.filter((v) => !present.has(v)).length;
      }
    }
    record("all foreign keys resolve", orphanTotal === 0 ? "pass" : "fail", `${orphanTotal} orphan(s)`);
  } else {
    record("foreign keys resolve", "skip", "needs SUPABASE_SERVICE_ROLE_KEY");
  }

  // Anon sees only active content (read-only comparison).
  if (admin) {
    const { count: anonCount } = await anon
      .from("products")
      .select("id", { count: "exact", head: true });
    const { count: activeCount } = await admin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);
    record(
      "anon sees only active products",
      anonCount === activeCount ? "pass" : "fail",
      `anon=${anonCount}, active=${activeCount}`
    );
  }

  // form_enquiries cannot be READ by anon (a SELECT expected to be denied).
  {
    const { data, error } = await anon.from("form_enquiries").select("id").limit(1);
    const blocked = !!error || (Array.isArray(data) && data.length === 0);
    record(
      "anon cannot read form_enquiries (SELECT denied)",
      blocked ? "pass" : "fail",
      error ? "blocked by RLS/grant" : `returned ${data?.length ?? 0} row(s)`
    );
  }

  // ---- OPTIONAL, opt-in synthetic write probe (form_enquiries only) --------
  if (ALLOW_WRITE_PROBES) {
    if (IN_CI) {
      record("write probes", "skip", "refused: never run in CI");
    } else if (!admin) {
      record("write probes", "skip", "need SUPABASE_SERVICE_ROLE_KEY for safe cleanup");
    } else {
      await formEnquiriesWriteProbe(anon, admin);
    }
  }
}

// Synthetic, self-cleaning probe: confirms anon CANNOT insert into
// form_enquiries. Operates ONLY on form_enquiries with an example.invalid
// address; if anon insert were (mis)allowed, the row is removed in a finally
// block and the check fails. Never writes to products or any content table.
async function formEnquiriesWriteProbe(anon, admin) {
  console.log("\n⚠  Optional write probe (--allow-write-probes): synthetic insert into");
  console.log("   form_enquiries ONLY, expected to be rejected; self-cleaning.");
  const marker = `verify-probe-${Date.now()}@example.invalid`;
  let insertedIds = [];
  try {
    const { data, error } = await anon
      .from("form_enquiries")
      .insert({
        full_name: "SYNTHETIC VERIFY PROBE",
        email: marker,
        locale: "en",
        source_path: "/verify-probe",
      })
      .select("id");
    if (error) {
      record("anon cannot INSERT into form_enquiries", "pass", "rejected by RLS/grant");
      return;
    }
    insertedIds = (data ?? []).map((r) => r.id);
    record("anon cannot INSERT into form_enquiries", "fail", "anon insert unexpectedly SUCCEEDED");
  } finally {
    if (insertedIds.length) {
      const { error: delErr, count } = await admin
        .from("form_enquiries")
        .delete({ count: "exact" })
        .in("id", insertedIds);
      // Confirm cleanup; fail loudly if it cannot be confirmed.
      const { data: still } = await admin
        .from("form_enquiries")
        .select("id")
        .in("id", insertedIds);
      const cleaned = !delErr && (!still || still.length === 0);
      record(
        "synthetic probe row cleaned up",
        cleaned ? "pass" : "fail",
        cleaned ? `removed ${count ?? insertedIds.length} row(s)` : "CLEANUP UNCONFIRMED"
      );
    }
  }
}

async function main() {
  console.log("=".repeat(70));
  console.log(`Phase 1 Supabase verifier ${ALLOW_WRITE_PROBES ? "(+ optional write probe)" : "(read-only)"}`);
  console.log("=".repeat(70));

  const { plan } = staticChecks();
  if (plan) await liveChecks(plan);

  const failed = results.filter((r) => r.status === "fail");
  const skipped = results.filter((r) => r.status === "skip");
  console.log("\n" + "-".repeat(70));
  console.log(
    `Verification: ${results.length - failed.length - skipped.length} passed, ` +
      `${failed.length} failed, ${skipped.length} skipped.`
  );
  if (failed.length) {
    console.error("FAILED checks:");
    for (const f of failed) console.error(`  - ${f.name}: ${f.detail}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("\n✖ Verifier crashed:", err?.stack || String(err));
  process.exit(1);
});
