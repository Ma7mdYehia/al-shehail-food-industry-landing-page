// Confirmed dashboard members for Production Patch 03.
//
// This file contains ONLY the confirmed emails, display names, and roles — NO
// secrets, keys, tokens, or passwords. Emails are stored normalized (lowercase);
// the bootstrap script matches existing Supabase Auth users by exact normalized
// email. Roles must be one of: owner | admin | editor.
//
// Bootstrapping never CREATES or INVITES auth users — those must already exist
// in Supabase Auth (created/invited out-of-band). This config only maps an
// already-existing auth user to a dashboard role.

export const DASHBOARD_ROLES = ["owner", "admin", "editor"];

export const DASHBOARD_MEMBERS = [
  { email: "marketing@halsabake.com", displayName: "M.Yehia", role: "owner" },
  { email: "gm@elshohail.com", displayName: "A.Zaid", role: "admin" },
  { email: "osama@halsabake.com", displayName: "O.Abdullah", role: "editor" },
];

// Normalize an email the same way everywhere: trimmed + lowercased.
export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

// Validate the config shape (pure, no network). Throws on any problem so both
// the bootstrap and verify commands fail closed on a malformed config.
export function validateConfig(members = DASHBOARD_MEMBERS) {
  const errors = [];
  const seen = new Set();
  let activeOwners = 0;
  for (const m of members) {
    const email = normalizeEmail(m.email);
    if (!email || email.indexOf("@") < 1) errors.push(`invalid email: ${JSON.stringify(m.email)}`);
    if (email !== m.email) errors.push(`email not normalized (lowercase/trimmed): ${JSON.stringify(m.email)}`);
    if (seen.has(email)) errors.push(`duplicate email: ${email}`);
    seen.add(email);
    if (!DASHBOARD_ROLES.includes(m.role)) errors.push(`invalid role for ${email}: ${m.role}`);
    if (!m.displayName || !m.displayName.trim()) errors.push(`missing display name for ${email}`);
    if (m.role === "owner") activeOwners += 1;
  }
  if (activeOwners < 1) errors.push("at least one owner is required");
  if (errors.length) {
    throw new Error(`Dashboard members config invalid:\n  - ${errors.join("\n  - ")}`);
  }
  return { count: members.length, owners: activeOwners };
}
