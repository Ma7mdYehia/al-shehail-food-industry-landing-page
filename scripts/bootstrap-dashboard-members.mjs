#!/usr/bin/env node
// =============================================================================
// Dashboard membership bootstrap — maps confirmed emails to dashboard roles.
// =============================================================================
// Safe by default: DRY RUN (read-only) unless `--apply` is passed.
//
//   * It NEVER creates or invites Supabase Auth users. It resolves EXISTING auth
//     users by exact normalized email and upserts a public.dashboard_members row
//     for each. If a configured email is missing, duplicated, or ambiguous in
//     Auth, it FAILS CLOSED (no partial writes).
//   * Apply requires `--apply` AND `SUPABASE_SERVICE_ROLE_KEY`, and is REFUSED
//     in CI. The service-role key is read from the environment only and never
//     printed; no tokens/keys are ever logged.
//   * Idempotent: re-running upserts on user_id and changes nothing if the
//     membership already matches. It NEVER removes additional dashboard members.
//
// Usage:
//   node scripts/bootstrap-dashboard-members.mjs            # dry run (read-only)
//   node scripts/bootstrap-dashboard-members.mjs --apply    # requires service role
// =============================================================================

import {
  DASHBOARD_MEMBERS,
  normalizeEmail,
  validateConfig,
} from "./dashboard-members.config.mjs";
import { resolveAuthUsers, resolveLiveEnv } from "./dashboard-auth-resolver.mjs";
import { hostOnly } from "./phase-1-shared.mjs";

const APPLY = process.argv.includes("--apply");
const IN_CI = process.env.CI === "true" || process.env.CI === "1";

function log(...a) {
  console.log(...a);
}
function fail(msg) {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
}

async function main() {
  log("=".repeat(70));
  log(`Dashboard membership bootstrap  [${APPLY ? "APPLY" : "DRY RUN (read-only)"}]`);
  log("=".repeat(70));

  // Static config validation (fails closed on a malformed config).
  let summary;
  try {
    summary = validateConfig(DASHBOARD_MEMBERS);
  } catch (err) {
    fail(err.message);
  }

  log("\nConfigured members (emails + roles only — no secrets):");
  for (const m of DASHBOARD_MEMBERS) {
    log(`  ${normalizeEmail(m.email).padEnd(28)} ${m.role.padEnd(7)} ${m.displayName}`);
  }
  log(`  ${summary.count} members, ${summary.owners} owner(s).`);

  if (!APPLY) {
    log("\nDRY RUN complete — read-only. No Auth users were created; no membership");
    log("was written; no database connection was opened.");
    log("Re-run with --apply (service role required, not in CI) to write memberships.");
    return;
  }

  if (IN_CI) fail("Refusing --apply in CI. Run membership bootstrap from a trusted operator shell.");

  // Require BOTH env vars; a partial config is a hard error (never a silent skip).
  let env;
  try {
    env = resolveLiveEnv();
  } catch (err) {
    fail(err.message);
  }
  if (env.mode !== "live") fail("--apply requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");

  log("\nTarget Supabase host:", hostOnly(env.url), "(no credentials shown)");

  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Resolve and validate EVERY Auth user before writing anything (fail closed on
  // missing/ambiguous/unconfirmed/conflicting). No partial writes on failure.
  log("\nResolving existing Auth users by exact normalized email (confirmed only)…");
  let resolvedMap;
  try {
    resolvedMap = await resolveAuthUsers(admin, DASHBOARD_MEMBERS.map((m) => m.email));
  } catch (err) {
    fail(err.message);
  }
  for (const m of DASHBOARD_MEMBERS) log(`  ✓ ${normalizeEmail(m.email)} → auth user resolved`);

  const rows = DASHBOARD_MEMBERS.map((m) => {
    const email = normalizeEmail(m.email);
    return {
      user_id: resolvedMap.get(email).userId,
      email,
      display_name: m.displayName,
      role: m.role,
      is_active: true,
    };
  });

  // ATOMIC write: submit all memberships in ONE bulk upsert request. A conflict/
  // uniqueness failure applies NONE of them (a single INSERT ... ON CONFLICT
  // statement is all-or-nothing). Never deletes additional members.
  log("\nApplying all memberships in a single bulk upsert (atomic)…");
  const { error: upErr } = await admin
    .from("dashboard_members")
    .upsert(rows, { onConflict: "user_id" });
  if (upErr) fail(`Bulk membership upsert failed (no rows applied): ${upErr.message}`);

  // Read-back verification of every expected mapping.
  log("Reading back to verify mappings…");
  const userIds = rows.map((r) => r.user_id);
  const { data: back, error: backErr } = await admin
    .from("dashboard_members")
    .select("user_id, email, display_name, role, is_active")
    .in("user_id", userIds);
  if (backErr) fail(`Read-back failed: ${backErr.message}`);
  const byId = new Map((back ?? []).map((r) => [r.user_id, r]));
  for (const r of rows) {
    const got = byId.get(r.user_id);
    const ok =
      got &&
      normalizeEmail(got.email) === r.email &&
      got.display_name === r.display_name &&
      got.role === r.role &&
      got.is_active === true;
    if (!ok) fail(`Read-back mismatch for ${r.email} (expected role=${r.role}, active=true).`);
    log(`  ✓ ${r.email} (${r.role}) verified`);
  }

  log("\n✓ Bootstrap complete (atomic bulk upsert + read-back). Re-running is");
  log("  idempotent and removes no members.");
}

main().catch((err) => fail(err?.stack || String(err)));
