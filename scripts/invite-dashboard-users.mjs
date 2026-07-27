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
//   * It acts ONLY against the exact committed production target
//     (scripts/production-target.config.mjs): `--apply` fails closed unless the
//     expected project ref + hostname are resolved, SUPABASE_PROJECT_REF is set
//     and matches, and NEXT_PUBLIC_SUPABASE_URL parses to exactly that host with
//     https / no credentials / no port / path / query / fragment.
//   * The invitation redirect is PINNED to https://alshehai.ae/dashboard/auth/
//     callback and never derived from an unchecked value; a non-canonical
//     NEXT_PUBLIC_SITE_URL fails closed.
//   * It is IDEMPOTENT: it first lists existing Auth users and only invites the
//     emails that do NOT already exist (never duplicates / re-invites), and it
//     fails closed if user pagination does not terminate (never invites on a
//     partial list).
//   * Apply requires `--apply` AND both NEXT_PUBLIC_SUPABASE_URL and
//     SUPABASE_SERVICE_ROLE_KEY, and is REFUSED in CI. The service-role key is
//     read from the environment only and is never printed. This is an
//     OPERATOR-ONLY script — the service-role key is NOT a website runtime
//     dependency and must never reach the Next.js/dashboard bundle.
//   * Honest partial reporting: if some invitations fail, it reports exactly
//     which succeeded and which failed and exits non-zero.
//
// Usage:
//   node scripts/invite-dashboard-users.mjs           # dry run (read-only)
//   node scripts/invite-dashboard-users.mjs --apply    # requires service role
// =============================================================================

import { fileURLToPath } from "node:url";
import {
  DASHBOARD_MEMBERS,
  normalizeEmail,
  validateConfig,
} from "./dashboard-members.config.mjs";
import { isEmailConfirmed, resolveLiveEnv } from "./dashboard-auth-resolver.mjs";
import { hostOnly } from "./phase-1-shared.mjs";
import {
  PRODUCTION_SITE_ORIGIN,
  PRODUCTION_CALLBACK_PATH,
  resolveProductionTarget,
} from "./production-target.config.mjs";

// The canonical, statically-known redirect used for display/dry-run. The
// --apply path re-derives + validates it via resolveProductionTarget().
export const CANONICAL_REDIRECT = `${PRODUCTION_SITE_ORIGIN}${PRODUCTION_CALLBACK_PATH}`;

// Page through a Supabase Auth user lister and return a Map<normalizedEmail,
// { count, confirmed }> for the requested emails only. `lister` is injected
// ({ page, perPage }) => { data, error } so this is testable without network.
// Read-only; never prints keys, tokens, or full user objects. Unlike
// resolveAuthUsers() this does NOT fail closed on a missing email (invitation
// needs to learn which are missing) — BUT it DOES fail closed if pagination
// never terminates (a full final page), so it never invites on a partial list.
export async function listExistingByEmail(lister, emails, { perPage = 200, maxPages = 500 } = {}) {
  const wanted = new Set(emails.map(normalizeEmail));
  const found = new Map();
  let terminated = false;
  for (let page = 1; page <= maxPages; page += 1) {
    const { data, error } = await lister({ page, perPage });
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
    if (users.length < perPage) {
      terminated = true;
      break;
    }
  }
  if (!terminated) {
    throw new Error(
      `Auth user pagination did not terminate within ${maxPages} full pages — ` +
        "refusing to invite on a partial user list (fail-closed)."
    );
  }
  return found;
}

// Pure invitation loop with injected `lister` and `invite` so it is exercised in
// tests without a database or network. `invite(email, redirectTo)` MUST be
// called with the canonical redirect ONLY. Returns [{ email, status }] and never
// returns or logs an invitation link/token.
export async function runInvites({ members, lister, invite, redirectTo }) {
  const existing = await listExistingByEmail(lister, members.map((m) => m.email));
  const results = [];
  for (const m of members) {
    const email = normalizeEmail(m.email);
    const hit = existing.get(email);
    if (hit) {
      if (hit.count > 1) {
        results.push({ email, status: "ambiguous (multiple Auth users — resolve manually)" });
        continue;
      }
      results.push({
        email,
        status: hit.confirmed ? "already exists (confirmed)" : "already exists (pending confirmation)",
      });
      continue;
    }
    // The response's action_link / token is NEVER read or printed — only
    // success/failure is surfaced.
    const { error } = await invite(email, redirectTo);
    results.push({
      email,
      status: error ? `FAILED: ${error.message}` : "invited (pending — awaiting inbox acceptance)",
    });
  }
  return results;
}

function log(...a) {
  console.log(...a);
}
function fail(msg) {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
}

async function main() {
  const APPLY = process.argv.includes("--apply");
  const IN_CI = process.env.CI === "true" || process.env.CI === "1";

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
  log(`\nInvite redirect is pinned to: ${CANONICAL_REDIRECT}`);

  if (!APPLY) {
    log("\nDRY RUN complete — read-only. No invitations were sent; no Auth users");
    log("were created; no database connection was opened. No passwords are ever");
    log("created by this script — invitees set their own via the callback flow.");
    log("Re-run with --apply (service role required, not in CI) to send invites.");
    return;
  }

  if (IN_CI) fail("Refusing --apply in CI. Send invitations from a trusted operator shell.");

  // Resolve + validate the EXACT production target FIRST. Fails closed unless the
  // committed project ref/hostname are resolved, SUPABASE_PROJECT_REF is set and
  // matches, NEXT_PUBLIC_SUPABASE_URL parses to exactly that host, and
  // NEXT_PUBLIC_SITE_URL (if set) is exactly the canonical origin.
  let target;
  try {
    target = resolveProductionTarget({
      siteUrlEnv: process.env.NEXT_PUBLIC_SITE_URL,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      projectRefEnv: process.env.SUPABASE_PROJECT_REF,
    });
  } catch (err) {
    fail(err.message);
  }

  // Require BOTH env vars; a partial config is a hard error (never a silent skip).
  let env;
  try {
    env = resolveLiveEnv();
  } catch (err) {
    fail(err.message);
  }
  if (env.mode !== "live") fail("--apply requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");

  log("\nValidated target Supabase host:", hostOnly(env.url), "(matches committed target; no credentials shown)");
  log("Redirect pinned to:", target.redirectTo);

  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const lister = ({ page, perPage }) => admin.auth.admin.listUsers({ page, perPage });
  const invite = (email, redirectTo) => admin.auth.admin.inviteUserByEmail(email, { redirectTo });

  log("\nListing existing Auth users to avoid duplicate invitations…");
  let results;
  try {
    results = await runInvites({ members: DASHBOARD_MEMBERS, lister, invite, redirectTo: target.redirectTo });
  } catch (err) {
    fail(err.message);
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

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  main().catch((err) => fail(err?.stack || String(err)));
}
