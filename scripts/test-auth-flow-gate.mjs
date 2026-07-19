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
const recoveryToken = gate.createGateToken(SECRET, { userId: USER, purpose: "recovery" });
const inviteToken = gate.createGateToken(SECRET, { userId: USER, purpose: "invite" });

assert("valid recovery gate accepted", gate.verifyGateToken(SECRET, recoveryToken, { userId: USER }).ok === true);
assert("valid recovery gate reports purpose recovery", gate.verifyGateToken(SECRET, recoveryToken, { userId: USER }).purpose === "recovery");
assert("valid invite gate accepted", gate.verifyGateToken(SECRET, inviteToken, { userId: USER }).ok === true && gate.verifyGateToken(SECRET, inviteToken, { userId: USER }).purpose === "invite");
assert("forged gate (wrong secret) rejected", gate.verifyGateToken(OTHER, recoveryToken, { userId: USER }).ok === false);
assert("gate for another user rejected", gate.verifyGateToken(SECRET, recoveryToken, { userId: OTHER_USER }).ok === false);
const expired = gate.createGateToken(SECRET, { userId: USER, purpose: "recovery", ttlSeconds: -10 });
assert("expired gate rejected", gate.verifyGateToken(SECRET, expired, { userId: USER }).ok === false && gate.verifyGateToken(SECRET, expired, { userId: USER }).reason === "expired");
const tampered = recoveryToken.slice(0, -2) + (recoveryToken.endsWith("aa") ? "bb" : "aa");
assert("tampered signature rejected", gate.verifyGateToken(SECRET, tampered, { userId: USER }).ok === false);
const forgedPurpose = (() => {
  // craft a token with an invalid purpose but valid-looking structure → still rejected (bad signature or purpose)
  const body = Buffer.from(JSON.stringify({ uid: USER, p: "admin", exp: 9999999999, n: "x" })).toString("base64url");
  return `${body}.deadbeef`;
})();
assert("unknown purpose / bad signature rejected", gate.verifyGateToken(SECRET, forgedPurpose, { userId: USER }).ok === false);
assert("empty/undefined gate rejected (no-gate session)", gate.verifyGateToken(SECRET, undefined, { userId: USER }).ok === false && gate.verifyGateToken(SECRET, "", { userId: USER }).ok === false);
assert("malformed gate rejected", gate.verifyGateToken(SECRET, "not-a-token", { userId: USER }).ok === false);
// Replay after consumption: the action clears the cookie + globally signs out,
// so a replayed request presents no gate → rejected (verified above) — and the
// action enforcement is asserted statically below.
assert("constant-time compare works", gate.constantTimeEqual("abc", "abc") === true && gate.constantTimeEqual("abc", "abd") === false && gate.constantTimeEqual("abc", "ab") === false);
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
assert("mints user-bound gate cookie on success", /createGateToken\(getDashboardAuthFlowSecret\(\),\s*\{\s*userId: user\.id,\s*purpose\s*\}\)/.test(cb));
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
assert("action consumes gate + global sign-out after success", /clearFlowCookies\(\);[\s\S]*signOut\(\{ scope: "global" \}\)/.test(action));
assert("action requires fresh login after update", /DASHBOARD_LOGIN_PATH\}\?notice=updated/.test(action));
assert("action fails closed without flow secret", /!hasDashboardAuthFlowSecret\(\)/.test(action) && /error=unconfigured/.test(action));
assert("recovery request stores state cookie + includes state in redirect", /cookies\(\)\.set\(RECOVERY_STATE_COOKIE/.test(action) && /callback\$\{[\s\S]*?\}\?type=recovery&state=/.test(action) === false && /type=recovery&state=\$\{encodeURIComponent\(state\)\}/.test(action));

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
