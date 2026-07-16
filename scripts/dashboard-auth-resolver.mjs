// Shared Supabase Auth resolver for dashboard membership tooling.
//
// Used by BOTH scripts/bootstrap-dashboard-members.mjs and
// scripts/verify-dashboard-members.mjs so they agree exactly on how an
// existing Auth user is matched to a configured email. It:
//   * pages through auth.admin.listUsers() (exact, normalized-email match),
//   * fails closed on a missing, duplicate/ambiguous, or UNCONFIRMED account,
//   * never creates/invites users, never prints keys/tokens or full user objects.
//
// Read-only: it only lists Auth users.

import { normalizeEmail } from "./dashboard-members.config.mjs";

// Return true when the Supabase Auth user has a confirmed email.
export function isEmailConfirmed(user) {
  return Boolean(user?.email_confirmed_at || user?.confirmed_at);
}

// Resolve every requested email to exactly one CONFIRMED Auth user id.
// Returns a Map<normalizedEmail, { userId, email }>. Throws a single aggregated
// error (no secrets, no user objects) if any email is missing, ambiguous, or
// unconfirmed, or if two emails resolve to the same Auth user id.
export async function resolveAuthUsers(admin, emails) {
  const targets = emails.map(normalizeEmail);
  const perPage = 200;
  // normalizedEmail -> [{ id, confirmed }]
  const byEmail = new Map();

  for (let page = 1; page <= 500; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`Supabase auth.admin.listUsers failed: ${error.message}`);
    const users = data?.users ?? [];
    for (const u of users) {
      const e = normalizeEmail(u.email);
      if (!e) continue;
      if (!byEmail.has(e)) byEmail.set(e, []);
      byEmail.get(e).push({ id: u.id, confirmed: isEmailConfirmed(u) });
    }
    if (users.length < perPage) break;
  }

  const errors = [];
  const resolved = new Map();
  const idToEmail = new Map();

  for (const email of targets) {
    const matches = byEmail.get(email) ?? [];
    if (matches.length === 0) {
      errors.push(`no Supabase Auth user found for ${email}`);
      continue;
    }
    if (matches.length > 1) {
      errors.push(`ambiguous: ${matches.length} Auth users match ${email}`);
      continue;
    }
    const only = matches[0];
    if (!only.confirmed) {
      errors.push(`Auth account for ${email} is not email-confirmed`);
      continue;
    }
    // Detect two different configured emails mapping to the same Auth user.
    if (idToEmail.has(only.id)) {
      errors.push(`conflict: ${email} and ${idToEmail.get(only.id)} resolve to the same Auth user`);
      continue;
    }
    idToEmail.set(only.id, email);
    resolved.set(email, { userId: only.id, email });
  }

  if (errors.length) {
    throw new Error(`Auth resolution failed (fail-closed):\n  - ${errors.join("\n  - ")}`);
  }
  return resolved;
}

// Validate that exactly one of URL / service-role is NOT a partial config.
// Returns { mode: 'live' | 'offline', url, serviceRoleKey }. Throws on a partial
// (only one of the two) configuration.
export function resolveLiveEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (url && serviceRoleKey) return { mode: "live", url, serviceRoleKey };
  if (!url && !serviceRoleKey) return { mode: "offline", url: "", serviceRoleKey: "" };
  const missing = url ? "SUPABASE_SERVICE_ROLE_KEY" : "NEXT_PUBLIC_SUPABASE_URL";
  throw new Error(
    `Partial Supabase configuration: ${missing} is missing. Set BOTH ` +
      `NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or neither.`
  );
}
