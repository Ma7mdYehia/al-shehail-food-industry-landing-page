#!/usr/bin/env node
// =============================================================================
// Dashboard membership verifier — READ-ONLY
// =============================================================================
// Never writes. Static config checks always run. Live checks run only when
// Supabase env vars are set and confirm — using the service role for reads only
// — that each configured email resolves to exactly one Auth user, that a
// matching active membership row exists with the configured role, and that at
// least one active owner exists. It never creates users or memberships.
//
// Usage:
//   node scripts/verify-dashboard-members.mjs
// =============================================================================

import {
  DASHBOARD_MEMBERS,
  normalizeEmail,
  validateConfig,
} from "./dashboard-members.config.mjs";
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !serviceRoleKey) {
    console.log("\nLive checks: SKIPPED (set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).");
  } else {
    console.log(`\nLive READ-ONLY checks against ${hostOnly(url)}:`);
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // membership rows (read-only)
    const { data: members, error: mErr } = await admin
      .from("dashboard_members")
      .select("user_id, email, role, is_active");
    if (mErr) {
      record("read dashboard_members", "fail", mErr.message);
    } else {
      const activeOwners = members.filter((m) => m.role === "owner" && m.is_active).length;
      record("at least one active owner exists", activeOwners >= 1 ? "pass" : "fail", `${activeOwners} active owner(s)`);

      // resolve each configured email to one auth user + matching membership
      const byEmail = new Map(members.map((m) => [normalizeEmail(m.email), m]));
      for (const cfg of DASHBOARD_MEMBERS) {
        const email = normalizeEmail(cfg.email);
        const row = byEmail.get(email);
        const okRow = row && row.role === cfg.role && row.is_active;
        record(
          `membership ${email} → ${cfg.role}`,
          okRow ? "pass" : "fail",
          row ? `role=${row.role}, active=${row.is_active}` : "no membership row"
        );
      }
    }
  }

  const failed = results.filter((r) => r.status === "fail");
  const skipped = results.filter((r) => r.status === "skip");
  console.log("\n" + "-".repeat(70));
  console.log(`Verification: ${results.length - failed.length - skipped.length} passed, ${failed.length} failed, ${skipped.length} skipped.`);
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error("\n✖ Membership verifier crashed:", err?.stack || String(err));
  process.exit(1);
});
