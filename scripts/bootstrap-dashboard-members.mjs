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

// Resolve exactly one existing auth user by normalized email, paging through the
// admin user list. Fails closed on missing/duplicate. Returns the user id.
async function resolveAuthUserId(admin, email) {
  const target = normalizeEmail(email);
  const matches = [];
  let page = 1;
  const perPage = 200;
  // hard cap the paging to avoid an unbounded loop
  for (; page <= 100; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`listUsers failed: ${error.message}`);
    const users = data?.users ?? [];
    for (const u of users) {
      if (normalizeEmail(u.email) === target) matches.push(u.id);
    }
    if (users.length < perPage) break;
  }
  if (matches.length === 0) return { status: "missing" };
  if (matches.length > 1) return { status: "ambiguous", count: matches.length };
  return { status: "ok", userId: matches[0] };
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is required for --apply.");
  if (!serviceRoleKey) fail("SUPABASE_SERVICE_ROLE_KEY is required for --apply.");

  log("\nTarget Supabase host:", hostOnly(url), "(no credentials shown)");

  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Resolve ALL emails first; fail closed before any write.
  log("\nResolving existing Auth users by exact normalized email…");
  const resolved = [];
  for (const m of DASHBOARD_MEMBERS) {
    const email = normalizeEmail(m.email);
    const r = await resolveAuthUserId(admin, email);
    if (r.status === "missing") {
      fail(`Auth user not found for ${email}. Create/invite the user in Supabase Auth first — this script never creates users.`);
    }
    if (r.status === "ambiguous") {
      fail(`Ambiguous: ${r.count} Auth users match ${email}. Resolve the duplicate before bootstrapping.`);
    }
    resolved.push({ ...m, email, userId: r.userId });
    log(`  ✓ ${email} → auth user resolved`);
  }

  // Upsert memberships (idempotent on user_id). Never delete other members.
  log("\nUpserting memberships (idempotent; existing extra members are left intact)…");
  for (const m of resolved) {
    const { error } = await admin.from("dashboard_members").upsert(
      {
        user_id: m.userId,
        email: m.email,
        display_name: m.displayName,
        role: m.role,
        is_active: true,
      },
      { onConflict: "user_id" }
    );
    if (error) fail(`Upsert membership for ${m.email} failed: ${error.message}`);
    log(`  ✓ ${m.email} (${m.role})`);
  }

  log("\n✓ Bootstrap complete. Re-running is idempotent and removes no members.");
}

main().catch((err) => fail(err?.stack || String(err)));
