#!/usr/bin/env node
// =============================================================================
// Safety tests for the operator invitation tool (scripts/invite-dashboard-users
// .mjs) and its production-target validator. No real credentials, no network,
// no writes. Uses SYNTHETIC identifiers only — never real keys/refs.
// =============================================================================

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  requireResolvedTarget,
  resolveCanonicalRedirect,
  validateSupabaseUrl,
  validateProjectRef,
  PRODUCTION_SITE_ORIGIN,
} from "./production-target.config.mjs";
import {
  CANONICAL_REDIRECT,
  listExistingByEmail,
  runInvites,
} from "./invite-dashboard-users.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, "invite-dashboard-users.mjs");

let failures = 0;
function assert(name, cond, detail = "") {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}
async function throwsAsync(fn) {
  try {
    await fn();
    return false;
  } catch {
    return true;
  }
}
function throwsSync(fn) {
  try {
    fn();
    return false;
  } catch {
    return true;
  }
}

// Synthetic resolved target (NOT a real project). 20-char lowercase-alnum ref.
const SYN_REF = "abcdefghij0123456789";
const SYN_HOST = `${SYN_REF}.supabase.co`;
const SYN_URL = `https://${SYN_HOST}`;

console.log("Operator invitation tool safety tests\n" + "-".repeat(60));

// --- 1. Committed target is unresolved → fails closed -----------------------
assert("committed target is unresolved (fail-closed)", throwsSync(() => requireResolvedTarget()));
assert(
  "an explicitly-resolved, consistent target passes the resolver",
  !throwsSync(() => requireResolvedTarget({ ref: SYN_REF, hostname: SYN_HOST }))
);
assert(
  "ref/hostname disagreement fails closed",
  throwsSync(() => requireResolvedTarget({ ref: SYN_REF, hostname: "other.supabase.co" }))
);

// --- 2. Redirect pinning ----------------------------------------------------
assert("no NEXT_PUBLIC_SITE_URL → canonical redirect", resolveCanonicalRedirect("") === CANONICAL_REDIRECT);
assert("canonical redirect targets the production callback", CANONICAL_REDIRECT === `${PRODUCTION_SITE_ORIGIN}/dashboard/auth/callback`);
assert("exact production Site URL is accepted", resolveCanonicalRedirect(PRODUCTION_SITE_ORIGIN) === CANONICAL_REDIRECT);
assert("wrong Site URL is rejected", throwsSync(() => resolveCanonicalRedirect("https://evil.example")));
assert("trailing-slash Site URL is rejected (must be exact)", throwsSync(() => resolveCanonicalRedirect("https://alshehai.ae/")));

// --- 3. Supabase URL validation ---------------------------------------------
assert(
  "exact production host/ref is accepted by the validator",
  !throwsSync(() => validateSupabaseUrl(SYN_URL, { expectedHostname: SYN_HOST, expectedRef: SYN_REF }))
);
assert("http (non-https) is rejected", throwsSync(() => validateSupabaseUrl(`http://${SYN_HOST}`, { expectedHostname: SYN_HOST, expectedRef: SYN_REF })));
assert("embedded credentials are rejected", throwsSync(() => validateSupabaseUrl(`https://user:pass@${SYN_HOST}`, { expectedHostname: SYN_HOST, expectedRef: SYN_REF })));
assert("unexpected port is rejected", throwsSync(() => validateSupabaseUrl(`https://${SYN_HOST}:8443`, { expectedHostname: SYN_HOST, expectedRef: SYN_REF })));
assert("unexpected path is rejected", throwsSync(() => validateSupabaseUrl(`https://${SYN_HOST}/rest`, { expectedHostname: SYN_HOST, expectedRef: SYN_REF })));
assert("query string is rejected", throwsSync(() => validateSupabaseUrl(`https://${SYN_HOST}/?x=1`, { expectedHostname: SYN_HOST, expectedRef: SYN_REF })));
assert("fragment is rejected", throwsSync(() => validateSupabaseUrl(`https://${SYN_HOST}/#f`, { expectedHostname: SYN_HOST, expectedRef: SYN_REF })));
assert("mismatched hostname is rejected", throwsSync(() => validateSupabaseUrl(`https://other.supabase.co`, { expectedHostname: SYN_HOST, expectedRef: SYN_REF })));
assert(
  "hostname not corresponding to ref is rejected",
  throwsSync(() => validateSupabaseUrl(`https://${SYN_HOST}`, { expectedHostname: SYN_HOST, expectedRef: "zzzzzzzzzzzzzzzzzzzz" }))
);
assert("unresolved expected host/ref is rejected", throwsSync(() => validateSupabaseUrl(SYN_URL, { expectedHostname: "", expectedRef: "" })));

// --- 4. Project ref env validation ------------------------------------------
assert("matching SUPABASE_PROJECT_REF is accepted", validateProjectRef(SYN_REF, SYN_REF) === SYN_REF);
assert("missing SUPABASE_PROJECT_REF is rejected", throwsSync(() => validateProjectRef("", SYN_REF)));
assert("mismatched SUPABASE_PROJECT_REF is rejected", throwsSync(() => validateProjectRef("zzzzzzzzzzzzzzzzzzzz", SYN_REF)));

// --- 5. Pagination fails closed on a full final page ------------------------
await (async () => {
  // A lister that ALWAYS returns a full page never terminates → must throw.
  const fullPageLister = ({ perPage }) => ({
    data: { users: Array.from({ length: perPage }, (_, i) => ({ email: `u${i}@x.com`, confirmed_at: null })) },
    error: null,
  });
  const threw = await throwsAsync(() => listExistingByEmail(fullPageLister, ["a@b.com"], { perPage: 5, maxPages: 3 }));
  assert("full final pagination page fails closed (never invites on a partial list)", threw);

  // A short final page terminates cleanly.
  let called = 0;
  const shortLister = ({ perPage }) => {
    called += 1;
    return { data: { users: called === 1 ? Array.from({ length: perPage }, (_, i) => ({ email: `u${i}@x.com` })) : [{ email: "tail@x.com" }] }, error: null };
  };
  const ok = !(await throwsAsync(() => listExistingByEmail(shortLister, ["a@b.com"], { perPage: 5, maxPages: 5 })));
  assert("a short final page terminates cleanly", ok);
})();

// --- 6. Invite receives ONLY the canonical callback URL; no link/token leaked -
await (async () => {
  const members = [
    { email: "new1@x.com", displayName: "N1", role: "editor" },
    { email: "existing@x.com", displayName: "E", role: "admin" },
  ];
  const emptyLister = () => ({ data: { users: [{ email: "existing@x.com", email_confirmed_at: "2026-01-01T00:00:00Z" }] }, error: null });
  const seenRedirects = [];
  const SECRET_LINK = "https://alshehai.ae/dashboard/auth/callback?token_hash=SUPERSECRET_TOKEN_DO_NOT_LEAK";
  const capturingInvite = (email, redirectTo) => {
    seenRedirects.push(redirectTo);
    // Simulate Supabase returning an action_link/token that must NEVER surface.
    return { data: { user: { id: "x" }, properties: { action_link: SECRET_LINK } }, error: null };
  };
  const results = await runInvites({ members, lister: emptyLister, invite: capturingInvite, redirectTo: CANONICAL_REDIRECT });

  assert("invite is called only with the canonical callback URL", seenRedirects.length === 1 && seenRedirects.every((r) => r === CANONICAL_REDIRECT));
  assert("existing user is reported as already-exists (not re-invited)", results.find((r) => r.email === "existing@x.com")?.status.startsWith("already exists"));
  assert("new user is reported as invited/pending", results.find((r) => r.email === "new1@x.com")?.status.startsWith("invited"));
  const serialized = JSON.stringify(results);
  assert("no invitation link/token appears in the results", !serialized.includes("SUPERSECRET_TOKEN_DO_NOT_LEAK") && !serialized.includes("action_link"));
})();

// --- 7. Subprocess: dry run is offline; --apply is refused in CI + fails closed
(() => {
  const run = (args, env) => spawnSync(process.execPath, [SCRIPT, ...args], { env: { ...process.env, ...env }, encoding: "utf8" });

  // Dry run: exits 0 with NO real credentials present, and does not print any
  // secret-looking material.
  const dry = run([], { CI: "", NEXT_PUBLIC_SUPABASE_URL: "", SUPABASE_SERVICE_ROLE_KEY: "", SUPABASE_PROJECT_REF: "" });
  assert("dry run exits 0 with no credentials (no network/write)", dry.status === 0, `status=${dry.status}`);
  const dryOut = `${dry.stdout}${dry.stderr}`;
  assert("dry run pins the canonical redirect in output", dryOut.includes(CANONICAL_REDIRECT));
  assert("dry run prints no token/action_link/service-role marker", !/token_hash|action_link|service_role|eyJ[A-Za-z0-9_-]{10}/.test(dryOut));

  // --apply in CI: refused BEFORE any target/credential resolution.
  const ci = run(["--apply"], { CI: "true" });
  assert("--apply is rejected in CI", ci.status !== 0 && /Refusing --apply in CI/.test(`${ci.stdout}${ci.stderr}`));

  // --apply outside CI with the committed (empty) target: blocked fail-closed.
  const unresolved = run(["--apply"], { CI: "", SUPABASE_PROJECT_REF: "whatever", NEXT_PUBLIC_SUPABASE_URL: SYN_URL, SUPABASE_SERVICE_ROLE_KEY: "x" });
  assert("unresolved expected project ref blocks --apply", unresolved.status !== 0 && /not resolved|EXPECTED_SUPABASE_PROJECT_REF/.test(`${unresolved.stdout}${unresolved.stderr}`));
})();

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} invitation-tool test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ All invitation-tool safety tests passed.");
