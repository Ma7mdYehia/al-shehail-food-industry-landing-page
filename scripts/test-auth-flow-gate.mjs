#!/usr/bin/env node
// =============================================================================
// P04 password recovery/invite GATE + callback safety tests.
// Executes the REAL HMAC gate crypto (transpiled from lib/auth/flow-gate.ts) and
// statically verifies the callback / update-password / action enforcement.
// Uses only a synthetic secret; never touches Supabase or a network.
// =============================================================================

import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import ts from "typescript";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
let failures = 0;
function assert(name, cond, detail = "") {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

const tmp = mkdtempSync(join(tmpdir(), "p04gate-"));
async function loadTs(relPath) {
  const src = readFileSync(join(ROOT, relPath), "utf8");
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const file = join(tmp, relPath.replace(/[\\/]/g, "_").replace(/\.ts$/, ".mjs"));
  writeFileSync(file, out);
  return import(pathToFileURL(file).href);
}

console.log("P04 recovery/invite gate tests\n" + "-".repeat(60));

const gate = await loadTs("lib/auth/flow-gate.ts");
const SECRET = "synthetic-test-secret-do-not-use-in-prod-000000";
const OTHER = "a-different-secret-value-1111111111111111111111";
const USER = "11111111-1111-1111-1111-111111111111";
const OTHER_USER = "22222222-2222-2222-2222-222222222222";

// ---- gate crypto (real) ----------------------------------------------------
console.log("Signed gate:");
const NONCE = gate.randomToken(32);
const recoveryToken = gate.createGateToken(SECRET, { userId: USER, purpose: "recovery", nonce: NONCE });
const inviteToken = gate.createGateToken(SECRET, { userId: USER, purpose: "invite", nonce: gate.randomToken(32) });

assert("valid recovery gate accepted", gate.verifyGateToken(SECRET, recoveryToken, { userId: USER }).ok === true);
assert("valid recovery gate reports purpose recovery", gate.verifyGateToken(SECRET, recoveryToken, { userId: USER }).purpose === "recovery");
assert("verified gate exposes the embedded nonce", gate.verifyGateToken(SECRET, recoveryToken, { userId: USER }).nonce === NONCE);
assert("valid invite gate accepted", gate.verifyGateToken(SECRET, inviteToken, { userId: USER }).ok === true && gate.verifyGateToken(SECRET, inviteToken, { userId: USER }).purpose === "invite");
assert("forged gate (wrong secret) rejected", gate.verifyGateToken(OTHER, recoveryToken, { userId: USER }).ok === false);
assert("gate for another user rejected", gate.verifyGateToken(SECRET, recoveryToken, { userId: OTHER_USER }).ok === false);
const expired = gate.createGateToken(SECRET, { userId: USER, purpose: "recovery", nonce: gate.randomToken(16), ttlSeconds: -10 });
assert("expired gate rejected", gate.verifyGateToken(SECRET, expired, { userId: USER }).ok === false && gate.verifyGateToken(SECRET, expired, { userId: USER }).reason === "expired");
const tampered = recoveryToken.slice(0, -2) + (recoveryToken.endsWith("aa") ? "bb" : "aa");
assert("tampered signature rejected", gate.verifyGateToken(SECRET, tampered, { userId: USER }).ok === false);
const forgedPurpose = (() => {
  const body = Buffer.from(JSON.stringify({ uid: USER, p: "admin", exp: 9999999999, n: "x" })).toString("base64url");
  return `${body}.deadbeef`;
})();
assert("unknown purpose / bad signature rejected", gate.verifyGateToken(SECRET, forgedPurpose, { userId: USER }).ok === false);
assert("empty/undefined gate rejected (no-gate session)", gate.verifyGateToken(SECRET, undefined, { userId: USER }).ok === false && gate.verifyGateToken(SECRET, "", { userId: USER }).ok === false);
assert("malformed gate rejected", gate.verifyGateToken(SECRET, "not-a-token", { userId: USER }).ok === false);
assert("hashNonce is a stable SHA-256 hex, not the raw nonce", gate.hashNonce(NONCE) === gate.hashNonce(NONCE) && /^[0-9a-f]{64}$/.test(gate.hashNonce(NONCE)) && gate.hashNonce(NONCE) !== NONCE);
// NOTE: durable single-use (first-consume-wins, replay/concurrency, expiry,
// cross-user, register-boundary) is proven against a REAL Postgres in
// scripts/test-auth-nonce.mjs (npm run db:test:auth-nonce), which also runs in CI
// against a postgres:16 service container — the previous cookie-absent "replay"
// assertion was removed as misleading.
assert("constant-time compare works", gate.constantTimeEqual("abc", "abc") === true && gate.constantTimeEqual("abc", "abd") === false && gate.constantTimeEqual("abc", "ab") === false);

// ---- flow-secret strength validation --------------------------------------
console.log("\nFlow-secret validation:");
assert("missing secret rejected", gate.isValidFlowSecret(undefined) === false && gate.isValidFlowSecret("") === false);
assert("short (<32) secret rejected", gate.isValidFlowSecret("a".repeat(31)) === false);
assert("placeholder/example secret rejected", gate.isValidFlowSecret("change-me-please-change-me-please-01") === false && gate.isValidFlowSecret("your-secret-your-secret-your-secret") === false);
assert("single-repeated-char secret rejected", gate.isValidFlowSecret("a".repeat(48)) === false);
assert("strong 48-byte base64 secret accepted", gate.isValidFlowSecret(gate.randomToken(48)) === true);
assert("cookies are HttpOnly + SameSite=Lax + /dashboard", (() => { const o = gate.flowCookieOptions(60); return o.httpOnly === true && o.sameSite === "lax" && o.path === "/dashboard" && o.maxAge === 60; })());
assert("random tokens are high-entropy and unique", gate.randomToken(32) !== gate.randomToken(32) && gate.randomToken(32).length >= 40);

// ---- callback enforcement (static) ----------------------------------------
console.log("\nCallback enforcement:");
const cb = readFileSync(join(ROOT, "app/dashboard/auth/callback/route.ts"), "utf8");
assert("rejects ambiguous/missing (both or neither of code/token_hash)", /hasCode === hasHash\)\s*return genericError\(\)/.test(cb));
assert("recovery code requires matching state (constant-time)", /constantTimeEqual\(state, stateCookie\)/.test(cb) && /RECOVERY_STATE_COOKIE/.test(cb));
assert("code without state rejected", /!state \|\| !stateCookie/.test(cb));
assert("invite/recovery token_hash uses verifyOtp", /verifyOtp\(\{[\s\S]*token_hash[\s\S]*type[\s\S]*\}\)/.test(cb));
assert("OTP type allowlisted to invite/recovery only", /ALLOWED_OTP_TYPES[^=]*=\s*\["invite",\s*"recovery"\]/.test(cb) && /ALLOWED_OTP_TYPES\.includes/.test(cb));
assert("registers a durable single-use nonce (hash) BEFORE minting the gate", /register_dashboard_flow_nonce/.test(cb) && /hashNonce\(nonce\)/.test(cb) && cb.indexOf("register_dashboard_flow_nonce") < cb.indexOf("FLOW_GATE_COOKIE,\n    createGateToken"));
assert("fails closed (local sign-out, generic error) if registration fails", /if \(!registered\)/.test(cb) && /signOut\(\{ scope: "local" \}\)/.test(cb) && /return genericError\(\)/.test(cb));
assert("inspects the local sign-out {error} on registration failure", /const \{ error: signOutError \} = await supabase\.auth\.signOut\(\{ scope: "local" \}\)/.test(cb) && /if \(signOutError\)/.test(cb));
// Cookie preservation: Supabase cookie mutations (incl. sign-out deletions) are
// captured and REPLAYED onto whichever response is returned — including the
// generic error — and the error response also clears the gate + recovery state.
assert("captures Supabase cookie writes for replay onto any response", /cookieWrites\.push\(/.test(cb) && /setAll\(cookiesToSet\)/.test(cb));
assert("generic error replays captured Supabase cookie mutations", /for \(const \{ name, value, options \} of cookieWrites\)[\s\S]*?errorResponse\.cookies\.set\(name, value, options\)/.test(cb));
assert("generic error clears the flow gate + one-time recovery state", /errorResponse\.cookies\.set\(FLOW_GATE_COOKIE, ""[\s\S]*?errorResponse\.cookies\.set\(RECOVERY_STATE_COOKIE, ""/.test(cb));
assert("mints user-bound gate cookie embedding the nonce on success", /createGateToken\(getDashboardAuthFlowSecret\(\),\s*\{\s*userId: user\.id,\s*purpose,\s*nonce\s*\}\)/.test(cb));
assert("redirects to update-password (no tokens/next in URL)", /NextResponse\.redirect\(new URL\(DASHBOARD_UPDATE_PASSWORD_PATH/.test(cb) && !/token_hash=|access_token|refresh_token|\?next=/.test(cb));
assert("clears one-time recovery state", /RECOVERY_STATE_COOKIE, ""/.test(cb));
assert("never logs code/token_hash", !/console\.[a-z]+\([^)]*(code|token_hash|tokenHash)/i.test(cb));

// ---- update-password page + action enforcement (static) -------------------
console.log("\nPassword-update gate enforcement:");
const page = readFileSync(join(ROOT, "app/dashboard/(auth)/update-password/page.tsx"), "utf8");
const action = readFileSync(join(ROOT, "lib/auth/dashboard-actions.ts"), "utf8");
assert("page verifies gate bound to getUser id", /verifyGateToken\(getDashboardAuthFlowSecret\(\), gate, \{ userId: user\.id \}\)/.test(page));
assert("page rejects (→ login) when gate invalid", /if \(!verdict\.ok\) redirect\(DASHBOARD_LOGIN_PATH\)/.test(page));
assert("action verifies gate bound to user (normal session alone rejected)", /verifyGateToken\(getDashboardAuthFlowSecret\(\), gate, \{ userId: user\.id \}\)/.test(action));
assert("action rejects invalid gate → login", /if \(!verdict\.ok\)\s*\{\s*clearFlowCookies\(\);\s*redirect\(DASHBOARD_LOGIN_PATH\)/.test(action));
assert("action atomically consumes the durable nonce before update", /consume_dashboard_flow_nonce/.test(action) && /hashNonce\(verdict\.nonce\)/.test(action) && action.indexOf("consume_dashboard_flow_nonce") < action.indexOf("updateUser({ password })"));
assert("action rejects an already-consumed/expired/cross-user nonce", /if \(!consumed\)\s*\{\s*clearFlowCookies\(\);\s*redirect\(DASHBOARD_LOGIN_PATH\)/.test(action));
assert("action inspects updateUser result explicitly (not empty catch)", /const \{ error: updateError \} = await supabase\.auth\.updateUser\(\{ password \}\)/.test(action) && /if \(updateError\)/.test(action));
assert("update failure after consumption → login (new flow required; no re-register)", /if \(updateError\)\s*\{\s*clearFlowCookies\(\);\s*redirect\(`\$\{DASHBOARD_LOGIN_PATH\}\?error=auth`\)/.test(action) && !/register_dashboard_flow_nonce/.test(action));
assert("action inspects signOut result + local fallback (safeSignOut)", /safeSignOut\(supabase, "global"\)/.test(action) && /signOut\(\{ scope: "local" \}\)/.test(action));
assert("partial-success notice when revocation incomplete", /signOutError \? "updated-partial" : "updated"/.test(action));
assert("action requires fresh login after update", /DASHBOARD_LOGIN_PATH\}\?notice=/.test(action));
assert("action fails closed without flow secret", /!hasDashboardAuthFlowSecret\(\)/.test(action) && /error=unconfigured/.test(action));
assert("recovery request stores state cookie + includes state in redirect", /cookies\(\)\.set\(RECOVERY_STATE_COOKIE/.test(action) && /callback\$\{[\s\S]*?\}\?type=recovery&state=/.test(action) === false && /type=recovery&state=\$\{encodeURIComponent\(state\)\}/.test(action));
assert("reset action fails closed (unconfigured) if state cookie cannot be written", /cookies\(\)\.set\(RECOVERY_STATE_COOKIE[\s\S]*?\} catch \{\s*redirect\(`\$\{DASHBOARD_FORGOT_PASSWORD_PATH\}\?state=unconfigured`\)/.test(action));

// ---- secret is server-only -------------------------------------------------
console.log("\nSecret hygiene:");
const envServer = readFileSync(join(ROOT, "lib/env/server.ts"), "utf8");
assert("flow secret read from process.env server-side", /process\.env\.DASHBOARD_AUTH_FLOW_SECRET/.test(envServer));
assert("flow secret is never a NEXT_PUBLIC var", !/NEXT_PUBLIC_[A-Z_]*FLOW/.test(readFileSync(join(ROOT, "lib/env/public.ts"), "utf8")));
assert("flow secret in scanner deny list", /DASHBOARD_AUTH_FLOW_SECRET/.test(readFileSync(join(ROOT, "scripts/scan-client-bundle.mjs"), "utf8")));
assert("flow secret documented in .env.example", /DASHBOARD_AUTH_FLOW_SECRET=/.test(readFileSync(join(ROOT, ".env.example"), "utf8")));

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} gate/callback test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ All P04 recovery/invite gate tests passed.");
