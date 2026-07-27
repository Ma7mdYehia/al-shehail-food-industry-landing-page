#!/usr/bin/env node
// =============================================================================
// Dashboard Auth invitations — sends secure Supabase Auth invitations to the
// three confirmed dashboard operators (P06 remote activation).
// =============================================================================
// Safe by default: DRY RUN (read-only) unless `--apply` is passed.
//
//   * It NEVER creates passwords and NEVER stores credentials. It uses Supabase
//     Auth's `inviteUserByEmail`, which emails a one-time invitation link; the
//     operator sets their own password through the dashboard invite/callback
//     flow. The returned action_link / token is NEVER printed or logged.
//   * It is IDEMPOTENT: it first lists existing Auth users and only invites the
//     emails that do NOT already exist. Emails that already exist are reported
//     as "already exists" and skipped (never re-invited, never duplicated).
//   * Apply requires `--apply` AND both NEXT_PUBLIC_SUPABASE_URL and
//     SUPABASE_SERVICE_ROLE_KEY, and is REFUSED in CI. The service-role key is
//     read from the environment only and is never printed. This is an
//     OPERATOR-ONLY script — the service-role key is NOT a website runtime
//     dependency and must never reach the Next.js/dashboard bundle.
//   * Honest partial reporting: if some invitations fail, it reports exactly
//     which succeeded and which failed and exits non-zero.
//
// The invitation redirect is pinned to the production Site URL callback so the
// link can only complete against the real dashboard.
//
// Usage:
//   node scripts/invite-dashboard-users.mjs           # dry run (read-only)
//   node scripts/invite-dashboard-users.mjs --apply    # requires service role
// =============================================================================

import {
  DASHBOARD_MEMBERS,
  normalizeEmail,
  validateConfig,
} from "./dashboard-members.config.mjs";
import { isEmailConfirmed, resolveLiveEnv } from "./dashboard-auth-resolver.mjs";
import { hostOnly } from "./phase-1-shared.mjs";

const APPLY = process.argv.includes("--apply");
const IN_CI = process.env.CI === "true" || process.env.CI === "1";

// Production Site URL fallback matches lib/env/public.ts. The invite link can
// only ever point at the real dashboard callback.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").trim() || "https://alshehai.ae";
const REDIRECT_TO = `${SITE_URL.replace(/\/+$/, "")}/dashboard/auth/callback`;

function log(...a) {
  console.log(...a);
}
function fail(msg) {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
}

// Page through auth.admin.listUsers() and return a Map<normalizedEmail,
// { count, confirmed }> for the requested emails only. Read-only; never prints
// keys, tokens, or full user objects. Unlike resolveAuthUsers() this does NOT
// fail closed on a missing email — invitation needs to learn which are missing.
async function findExistingByEmail(admin, emails) {
  const wanted = new Set(emails.map(normalizeEmail));
  const found = new Map();
  const perPage = 200;
  for (let page = 1; page <= 500; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`Supabase auth.admin.listUsers failed: ${error.message}`);
    const users = data?.users ?? [];
    for (const u of users) {
      const e = normalizeEmail(u.email);
      if (!e || !wanted.has(e)) continue;
      const prev = found.get(e) ?? { count: 0, confirmed: false };
      found.set(e, {
        count: prev.count + 1,
        confirmed: prev.confirmed || isEmailConfirmed(u),
      });
    }
    if (users.length < perPage) break;
  }
  return found;
}

async function main() {
  log("=".repeat(70));
  log(`Dashboard Auth invitations  [${APPLY ? "APPLY" : "DRY RUN (read-only)"}]`);
  log("=".repeat(70));

  // Static config validation (fails closed on a malformed config).
  let summary;
  try {
    summary = validateConfig(DASHBOARD_MEMBERS);
  } catch (err) {
    fail(err.message);
  }

  log("\nConfigured operators (emails + roles only — no secrets):");
  for (const m of DASHBOARD_MEMBERS) {
    log(`  ${normalizeEmail(m.email).padEnd(28)} ${m.role.padEnd(7)} ${m.displayName}`);
  }
  log(`  ${summary.count} operators, ${summary.owners} owner(s).`);
  log(`\nInvite redirect (Site URL callback): ${REDIRECT_TO}`);

  if (!APPLY) {
    log("\nDRY RUN complete — read-only. No invitations were sent; no Auth users");
    log("were created; no database connection was opened. No passwords are ever");
    log("created by this script — invitees set their own via the callback flow.");
    log("Re-run with --apply (service role required, not in CI) to send invites.");
    return;
  }

  if (IN_CI) fail("Refusing --apply in CI. Send invitations from a trusted operator shell.");

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

  // Learn which operators already have an Auth account (idempotency + no dupes).
  log("\nListing existing Auth users to avoid duplicate invitations…");
  let existing;
  try {
    existing = await findExistingByEmail(admin, DASHBOARD_MEMBERS.map((m) => m.email));
  } catch (err) {
    fail(err.message);
  }

  const results = []; // { email, status }
  for (const m of DASHBOARD_MEMBERS) {
    const email = normalizeEmail(m.email);
    const hit = existing.get(email);
    if (hit) {
      if (hit.count > 1) {
        results.push({ email, status: "ambiguous (multiple Auth users — resolve manually)" });
        continue;
      }
      results.push({ email, status: hit.confirmed ? "already exists (confirmed)" : "already exists (pending confirmation)" });
      continue;
    }
    // Send a secure invitation. The response's action_link / token is NEVER
    // read or printed — only success/failure is surfaced.
    const { error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: REDIRECT_TO });
    if (error) {
      results.push({ email, status: `FAILED: ${error.message}` });
    } else {
      results.push({ email, status: "invited (pending — awaiting inbox acceptance)" });
    }
  }

  log("\nPer-operator result:");
  let failures = 0;
  let pending = 0;
  for (const r of results) {
    if (r.status.startsWith("FAILED") || r.status.startsWith("ambiguous")) failures += 1;
    if (r.status.startsWith("invited") || r.status.includes("pending confirmation")) pending += 1;
    log(`  ${r.email.padEnd(28)} ${r.status}`);
  }

  if (pending > 0) {
    log(`\n⚠ ${pending} operator(s) must ACCEPT their invitation from their inbox and set a`);
    log("  password via the callback flow before they are confirmed. Do NOT treat");
    log("  invited/pending accounts as active dashboard members yet.");
  }

  if (failures > 0) {
    fail(`${failures} invitation(s) did not complete cleanly (see per-operator result above).`);
  }

  log("\n✓ Invitation pass complete. Re-running is idempotent — existing accounts");
  log("  are skipped, never re-invited or duplicated. Run db:members:bootstrap:apply");
  log("  ONLY after every operator resolves to exactly one confirmed Auth user.");
}

main().catch((err) => fail(err?.stack || String(err)));
