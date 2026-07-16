#!/usr/bin/env node
// =============================================================================
// Dashboard membership verifier — READ-ONLY
// =============================================================================
// Never writes. Static config checks always run. When Supabase env vars are set,
// it ALSO verifies Auth identity: it resolves each configured email to exactly
// one confirmed Auth user (shared resolver) and checks that the membership row
// is linked to that exact Auth user id — so a row with the right email/role but
// the WRONG user_id fails. It never creates users/memberships, never prints
// keys/tokens or full Auth user objects, and is strictly read-only.
//
// Skip accounting is honest: when live env vars are absent, the live checks are
// recorded as genuinely skipped (skipped count > 0). A partial config (only one
// of URL / service-role) is a configuration ERROR, not a skip.
//
// Usage:  node scripts/verify-dashboard-members.mjs
// =============================================================================

import {
  DASHBOARD_MEMBERS,
  normalizeEmail,
  validateConfig,
} from "./dashboard-members.config.mjs";
import { resolveAuthUsers, resolveLiveEnv } from "./dashboard-auth-resolver.mjs";
import { hostOnly } from "./phase-1-shared.mjs";

const results = [];
function record(name, status, detail = "") {
  results.push({ name, status });
  const icon = status === "pass" ? "✓" : status === "skip" ? "•" : "✗";
  console.log(`  ${icon} ${name}${detail ? " — " + detail : ""}`);
}

async function main() {
  console.log("=".repeat(70));
  console.log("Dashboard membership verifier (read-only)");
  console.log("=".repeat(70));

  console.log("\nStatic config checks:");
  try {
    const s = validateConfig(DASHBOARD_MEMBERS);
    record("config valid (normalized emails, roles, ≥1 owner)", "pass", `${s.count} members, ${s.owners} owner(s)`);
  } catch (err) {
    record("config valid", "fail", err.message.split("\n")[0]);
  }

  // Live env: BOTH or NEITHER. A partial config is a hard error.
  let env;
  try {
    env = resolveLiveEnv();
  } catch (err) {
    record("Supabase configuration", "fail", err.message.split("\n")[0]);
    return finish();
  }

  if (env.mode === "offline") {
    console.log("\nLive Auth-identity checks: SKIPPED (set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).");
    // Record genuine skips so the summary reflects them (never "skipped" with 0).
    record("resolve Auth users (live)", "skip");
    record("membership user_id matches Auth id (live)", "skip");
    record("membership email/role/active match (live)", "skip");
    return finish();
  }

  console.log(`\nLive READ-ONLY Auth-identity checks against ${hostOnly(env.url)}:`);
  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Resolve every configured email to exactly one confirmed Auth user.
  let resolved;
  try {
    resolved = await resolveAuthUsers(admin, DASHBOARD_MEMBERS.map((m) => m.email));
    record("all configured emails resolve to one confirmed Auth user", "pass", `${resolved.size} resolved`);
  } catch (err) {
    record("resolve Auth users", "fail", err.message.split("\n")[0]);
    return finish();
  }

  // Read memberships (read-only) and verify identity/role/active per email.
  const { data: members, error: mErr } = await admin
    .from("dashboard_members")
    .select("user_id, email, role, is_active");
  if (mErr) {
    record("read dashboard_members", "fail", mErr.message);
    return finish();
  }

  // Detect duplicate membership rows mapped to the same Auth user.
  const idCounts = new Map();
  for (const m of members) idCounts.set(m.user_id, (idCounts.get(m.user_id) || 0) + 1);
  const dupIds = [...idCounts.entries()].filter(([, n]) => n > 1);
  record("no duplicate membership rows per Auth user", dupIds.length === 0 ? "pass" : "fail", `${dupIds.length} duplicate(s)`);

  const byUserId = new Map(members.map((m) => [m.user_id, m]));
  const activeOwners = members.filter((m) => m.role === "owner" && m.is_active).length;
  record("at least one active owner exists", activeOwners >= 1 ? "pass" : "fail", `${activeOwners} active owner(s)`);

  for (const cfg of DASHBOARD_MEMBERS) {
    const email = normalizeEmail(cfg.email);
    const authUserId = resolved.get(email).userId;
    const row = byUserId.get(authUserId);
    const ok =
      row &&
      row.user_id === authUserId &&
      normalizeEmail(row.email) === email &&
      row.role === cfg.role &&
      row.is_active === true;
    record(
      `membership ${email}: linked to correct Auth user, role ${cfg.role}, active`,
      ok ? "pass" : "fail",
      row ? `role=${row.role}, active=${row.is_active}` : "no membership for the resolved Auth user id"
    );
  }

  return finish();
}

function finish() {
  const failed = results.filter((r) => r.status === "fail");
  const skipped = results.filter((r) => r.status === "skip");
  const passed = results.length - failed.length - skipped.length;
  console.log("\n" + "-".repeat(70));
  console.log(`Verification: ${passed} passed, ${failed.length} failed, ${skipped.length} skipped.`);
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error("\n✖ Membership verifier crashed:", err?.stack || String(err));
  process.exit(1);
});
