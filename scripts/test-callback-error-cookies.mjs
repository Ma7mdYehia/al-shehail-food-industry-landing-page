#!/usr/bin/env node
// =============================================================================
// P04 callback fail-closed cookie helper — REAL NextResponse header test.
// =============================================================================
// Executes the REAL buildCallbackErrorCookies logic (transpiled from
// lib/auth/callback-cookies.ts) and applies its output to a REAL NextResponse
// (from next/server), then inspects the ACTUAL serialized Set-Cookie headers via
// headers.getSetCookie(). No source regex, no network, no build. Proves that an
// error response deletes every relevant Supabase auth cookie — whether it was
// (re)written during the request (a non-empty session) or was already present on
// the request (including chunked `.0/.1` and the PKCE verifier) — clears the flow
// cookies, leaves unrelated cookies alone, and NEVER emits a non-empty Supabase
// session value.
//   node scripts/test-callback-error-cookies.mjs   (npm run test:callback-cookie-helper)
// =============================================================================

import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const require = createRequire(import.meta.url);
let failures = 0;
function assert(name, cond, detail = "") {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

// --- transpile the real helper (+ its flow-gate dependency) to ESM -----------
const tmp = mkdtempSync(join(tmpdir(), "cbcookies-"));
function emit(rel, rewrite = (s) => s) {
  const src = readFileSync(join(ROOT, rel), "utf8");
  const out = ts.transpileModule(rewrite(src), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const file = join(tmp, rel.replace(/[\\/]/g, "_").replace(/\.ts$/, ".mjs"));
  writeFileSync(file, out);
  return file;
}
emit("lib/auth/flow-gate.ts");
// Point the helper's `./flow-gate` import at the transpiled sibling filename.
const helperFile = emit("lib/auth/callback-cookies.ts", (s) =>
  s.replace('from "./flow-gate"', 'from "./lib_auth_flow-gate.mjs"')
);
const { buildCallbackErrorCookies, isSupabaseAuthCookieName } = await import(
  pathToFileURL(helperFile).href
);

// Real NextResponse (CJS require works in plain Node; the ESM subpath does not).
const { NextResponse } = require("next/server");

console.log("Callback fail-closed cookie helper (real NextResponse headers):");

// --- name classifier ---------------------------------------------------------
assert("classifies sb-…-auth-token as a Supabase auth cookie", isSupabaseAuthCookieName("sb-abcdef-auth-token"));
assert("classifies chunked sb-…-auth-token.0 / .1", isSupabaseAuthCookieName("sb-abcdef-auth-token.0") && isSupabaseAuthCookieName("sb-abcdef-auth-token.1"));
assert("classifies the PKCE code-verifier", isSupabaseAuthCookieName("sb-abcdef-auth-token-code-verifier"));
assert("does NOT classify unrelated cookies", !isSupabaseAuthCookieName("myapp_prefs") && !isSupabaseAuthCookieName("ds_flow_gate"));

// --- scenario: session written during the request + stale request cookies ----
const REF = "sb-abcdef1234-auth-token";
const deletions = buildCallbackErrorCookies({
  // A non-empty session cookie the SSR client (re)wrote during this request.
  recordedWrites: [
    { name: REF, value: "eyJhbGciOiJIUzI1NiJ9.NON-EMPTY-SESSION.sig", options: { path: "/" } },
  ],
  // Cookies already present on the incoming request.
  requestCookieNames: [
    `${REF}.0`,
    `${REF}.1`,
    `${REF}-code-verifier`,
    "ds_flow_gate",
    "ds_recovery_state",
    "myapp_prefs", // unrelated application cookie
  ],
});

// Helper-level proof (structured, not regex): the recorded non-empty session is a deletion.
const recorded = deletions.find((d) => d.name === REF);
assert(
  "recorded non-empty session cookie is returned as a deletion (empty value, Max-Age 0)",
  recorded && recorded.value === "" && recorded.options.maxAge === 0
);

// Apply to a REAL NextResponse and inspect ACTUAL Set-Cookie headers.
const res = NextResponse.redirect(new URL("http://127.0.0.1/dashboard/login?error=auth"));
for (const { name, value, options } of deletions) res.cookies.set(name, value, options);
const setCookies = res.headers.getSetCookie();
const joined = setCookies.join("\n");
const entryFor = (name) => setCookies.find((c) => c.startsWith(`${name}=`));
const isDeletion = (name) => {
  const c = entryFor(name);
  return !!c && /^[^=]+=;/.test(c) && /(^|;\s*)max-age=0(;|\s|$)/i.test(c);
};

assert("1. recorded non-empty session → deletion on the real response", isDeletion(REF), entryFor(REF));
assert("2. request-present auth cookie → deletion", isDeletion(`${REF}.0`) && isDeletion(`${REF}.1`), joined);
assert("3. chunked + PKCE verifier deleted", isDeletion(`${REF}-code-verifier`), entryFor(`${REF}-code-verifier`));
assert(
  "4. ds_flow_gate + ds_recovery_state deleted (Path=/dashboard)",
  isDeletion("ds_flow_gate") &&
    isDeletion("ds_recovery_state") &&
    /path=\/dashboard/i.test(entryFor("ds_flow_gate")) &&
    /path=\/dashboard/i.test(entryFor("ds_recovery_state")),
  joined
);
// 5. NO emitted Set-Cookie carries a non-empty Supabase auth session value.
const nonEmptySbAuth = setCookies.filter((c) => {
  const name = c.slice(0, c.indexOf("="));
  const value = c.slice(c.indexOf("=") + 1, c.indexOf(";") === -1 ? undefined : c.indexOf(";"));
  return isSupabaseAuthCookieName(name) && value.length > 0;
});
assert("5. no Set-Cookie contains a non-empty Supabase auth session", nonEmptySbAuth.length === 0, nonEmptySbAuth.join(" | "));
// 6. unrelated cookie untouched.
assert("6. unrelated application cookie is NOT deleted/emitted", !entryFor("myapp_prefs"), joined);
// deletions target the recorded path.
assert("deletion for the session cookie targets its recorded path (/)", /path=\//i.test(entryFor(REF)), entryFor(REF));

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} callback fail-closed cookie test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ Callback fail-closed cookie helper tests passed (real NextResponse headers).");
