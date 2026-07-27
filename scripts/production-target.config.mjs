// =============================================================================
// P06 production activation target — NON-SECRET, fail-closed configuration.
// =============================================================================
// This file pins the EXACT production target the operator invitation tool is
// allowed to act against. A Supabase project ref and hostname are NON-SECRET
// (they are not credentials), but they must be VERIFIED during the read-only
// preflight before any write. Until a trusted operator resolves and fills them
// in below, they are intentionally EMPTY and `--apply` FAILS CLOSED.
//
// Do NOT invent these values. Fill them ONLY after `supabase projects list`
// (and the read-only preflight in docs/production-remote-activation-p06.md)
// confirms the real project ref and hostname. They must agree:
// EXPECTED_SUPABASE_HOSTNAME must be `${EXPECTED_SUPABASE_PROJECT_REF}.<suffix>`.
// =============================================================================

// Canonical production site origin (also the invite-redirect base).
export const PRODUCTION_SITE_ORIGIN = "https://alshehai.ae";

// Canonical dashboard callback the invitation link is pinned to.
export const PRODUCTION_CALLBACK_PATH = "/dashboard/auth/callback";

// EMPTY until resolved by the operator during read-only preflight (fail-closed).
export const EXPECTED_SUPABASE_PROJECT_REF = "";
export const EXPECTED_SUPABASE_HOSTNAME = "";

// Supabase project refs are 20 lowercase alphanumeric characters.
const PROJECT_REF_RE = /^[a-z0-9]{20}$/;

// Throw unless the committed target has been fully resolved (non-empty + well
// formed + internally consistent). Returns { ref, hostname } on success.
export function requireResolvedTarget({
  ref = EXPECTED_SUPABASE_PROJECT_REF,
  hostname = EXPECTED_SUPABASE_HOSTNAME,
} = {}) {
  const errors = [];
  const r = String(ref || "").trim();
  const h = String(hostname || "").trim().toLowerCase();
  if (!r) {
    errors.push(
      "EXPECTED_SUPABASE_PROJECT_REF is empty — resolve the real project ref " +
        "during read-only preflight and commit it before --apply."
    );
  } else if (!PROJECT_REF_RE.test(r)) {
    errors.push("EXPECTED_SUPABASE_PROJECT_REF is not a valid 20-char project ref.");
  }
  if (!h) {
    errors.push(
      "EXPECTED_SUPABASE_HOSTNAME is empty — resolve the real hostname during " +
        "read-only preflight and commit it before --apply."
    );
  }
  // The committed ref and hostname must agree with each other.
  if (r && h && !h.startsWith(`${r.toLowerCase()}.`)) {
    errors.push("committed EXPECTED_SUPABASE_HOSTNAME does not correspond to EXPECTED_SUPABASE_PROJECT_REF.");
  }
  if (errors.length) {
    throw new Error(`Production target is not resolved (fail-closed):\n  - ${errors.join("\n  - ")}`);
  }
  return { ref: r, hostname: h };
}

// Resolve the canonical invite redirect. If NEXT_PUBLIC_SITE_URL is supplied it
// MUST be EXACTLY the production origin; otherwise fail closed. The redirect is
// NEVER derived from an unchecked environment value.
export function resolveCanonicalRedirect(siteUrlEnv) {
  const raw = String(siteUrlEnv ?? "").trim();
  if (raw && raw !== PRODUCTION_SITE_ORIGIN) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be exactly ${PRODUCTION_SITE_ORIGIN} for production ` +
        "activation (refusing a different or trailing-slash value)."
    );
  }
  return `${PRODUCTION_SITE_ORIGIN}${PRODUCTION_CALLBACK_PATH}`;
}

// Strictly parse + validate the Supabase project URL against the committed
// expected hostname/ref. Throws on any deviation. Returns { host, ref }.
export function validateSupabaseUrl(supabaseUrl, { expectedHostname, expectedRef }) {
  const raw = String(supabaseUrl ?? "").trim();
  if (!raw) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required for --apply.");
  let u;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not a valid URL.");
  }
  const errors = [];
  if (u.protocol !== "https:") errors.push("must use the https protocol");
  if (u.username || u.password) errors.push("must not contain a username or password");
  if (u.port) errors.push("must not specify a port");
  if (u.pathname && u.pathname !== "/") errors.push("must not include a path");
  if (u.search) errors.push("must not include a query string");
  if (u.hash) errors.push("must not include a fragment");

  const host = u.hostname.toLowerCase();
  const expHost = String(expectedHostname ?? "").trim().toLowerCase();
  const expRef = String(expectedRef ?? "").trim().toLowerCase();
  if (!expHost || !expRef) {
    errors.push("expected hostname/ref are unresolved (fail-closed)");
  } else {
    if (host !== expHost) errors.push(`hostname ${host} does not match expected ${expHost}`);
    // Hostname and project ref must agree.
    if (!host.startsWith(`${expRef}.`)) errors.push(`hostname ${host} does not correspond to project ref ${expRef}`);
  }
  if (errors.length) {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL (fail-closed):\n  - ${errors.join("\n  - ")}`);
  }
  return { host, ref: expRef };
}

// Validate the operator-supplied SUPABASE_PROJECT_REF against the committed
// expected ref (exact match; the environment is never trusted over the committed
// target). Returns the validated ref.
export function validateProjectRef(projectRefEnv, expectedRef) {
  const raw = String(projectRefEnv ?? "").trim();
  const exp = String(expectedRef ?? "").trim();
  if (!raw) throw new Error("SUPABASE_PROJECT_REF is required for --apply.");
  if (!exp) throw new Error("Expected project ref is unresolved (fail-closed).");
  if (raw !== exp) throw new Error("SUPABASE_PROJECT_REF does not match the committed expected project ref.");
  return raw;
}

// Orchestrate the full production-target resolution used by `--apply`. Throws on
// the first failure. Returns { redirectTo, host, ref }.
export function resolveProductionTarget({ siteUrlEnv, supabaseUrl, projectRefEnv } = {}) {
  // 1. The committed target must be resolved (non-empty + consistent).
  const { ref: expectedRef, hostname: expectedHostname } = requireResolvedTarget();
  // 2. Operator-supplied ref must match the committed ref exactly.
  const ref = validateProjectRef(projectRefEnv, expectedRef);
  // 3. The project URL must match the committed hostname and agree with the ref.
  const { host } = validateSupabaseUrl(supabaseUrl, { expectedHostname, expectedRef });
  // 4. Pin + validate the redirect (never derived from an unchecked value).
  const redirectTo = resolveCanonicalRedirect(siteUrlEnv);
  return { redirectTo, host, ref };
}
