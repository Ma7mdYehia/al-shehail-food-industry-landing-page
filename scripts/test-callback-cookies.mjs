#!/usr/bin/env node
// =============================================================================
// P04 callback — REAL returned-response cookie-deletion test.
// =============================================================================
// Boots the ACTUAL built Next.js app (`next start`) and issues a real HTTP
// request to /dashboard/auth/callback with a stale flow gate + recovery state
// cookie. It then inspects the ACTUAL Set-Cookie headers on the returned failure
// response (not a regex over source) to prove the generic error redirect deletes
// BOTH ds_flow_gate and ds_recovery_state. Requires a prior `next build`
// (.next/ present); intended to run AFTER the Build step.
//   node scripts/test-callback-cookies.mjs      (npm run test:callback-cookies)
// =============================================================================

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
let failures = 0;
function assert(name, cond, detail = "") {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

if (!existsSync(join(ROOT, ".next"))) {
  console.error("✖ .next build output not found. Run `npm run build` first.");
  process.exit(1);
}

const PORT = 3987;
const nextBin = join(ROOT, "node_modules", ".bin", "next");

// Start with NO Supabase config so the callback hits the generic error branch
// deterministically (no DB/network needed). The generic error must still clear
// the flow cookies regardless of why the callback failed.
const env = { ...process.env, PORT: String(PORT) };
delete env.NEXT_PUBLIC_SUPABASE_URL;
delete env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const server = spawn(nextBin, ["start", "-p", String(PORT)], {
  cwd: ROOT,
  env,
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d.toString()));
server.stderr.on("data", (d) => (serverLog += d.toString()));

async function waitForReady(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/`, { redirect: "manual" });
      if (r.status > 0) return true;
    } catch {
      /* not up yet */
    }
    await sleep(500);
  }
  return false;
}

function stop() {
  try {
    server.kill("SIGKILL");
  } catch {
    /* ignore */
  }
}

try {
  const ready = await waitForReady();
  if (!ready) {
    console.error("✖ next start did not become ready in time.\n" + serverLog);
    stop();
    process.exit(1);
  }

  console.log("Callback returned-response cookie deletions (real HTTP):");

  // Ambiguous params (both code + token_hash) → generic error. Send stale flow
  // cookies so we can prove the returned response deletes them.
  // Trailing slash: the app sets trailingSlash: true, so hit the canonical URL
  // directly to avoid a 308 normalization redirect before the handler runs. Send
  // a full set of STALE Supabase auth cookies on the request (base session,
  // chunked `.0/.1`, PKCE verifier) — each with a NON-EMPTY value — plus the flow
  // cookies and an unrelated application cookie, to prove the real error response
  // deletes the Supabase session (even though it was never re-written this request)
  // and leaves the unrelated cookie untouched.
  const SB = "sb-abcdef1234-auth-token";
  const requestCookie = [
    `${SB}=eyJhbGciOiJIUzI1NiJ9.STALE-SESSION.sig`,
    `${SB}.0=chunk-zero-nonempty`,
    `${SB}.1=chunk-one-nonempty`,
    `${SB}-code-verifier=pkce-verifier-nonempty`,
    "ds_flow_gate=STALEGATEVALUE",
    "ds_recovery_state=STALESTATEVALUE",
    "myapp_prefs=keep-me",
  ].join("; ");
  const res = await fetch(
    `http://127.0.0.1:${PORT}/dashboard/auth/callback/?code=stale-code&token_hash=stale-hash&type=recovery`,
    { redirect: "manual", headers: { Cookie: requestCookie } }
  );

  assert("callback failure is a redirect", res.status === 307 || res.status === 302, `status=${res.status}`);
  const location = res.headers.get("location") || "";
  assert("redirects to generic login error", /\/dashboard\/login\?error=auth/.test(location), location);

  // getSetCookie() returns the raw Set-Cookie header LIST (Node 18.14+/undici).
  const setCookies = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  const joined = setCookies.join("\n");
  const entryFor = (name) => setCookies.find((c) => c.startsWith(`${name}=`));

  // A deletion cookie is `name=; ...; Max-Age=0` (empty value, immediate expiry).
  const isDeletion = (name) => {
    const c = entryFor(name);
    return !!c && /^[^=]+=;/.test(c) && /(^|;\s*)(max-age=0|expires=)/i.test(c);
  };

  assert("ds_flow_gate deleted (Max-Age=0)", isDeletion("ds_flow_gate"), joined);
  assert("ds_recovery_state deleted (Max-Age=0)", isDeletion("ds_recovery_state"), joined);
  assert(
    "flow deletions are scoped to /dashboard",
    setCookies
      .filter((c) => c.startsWith("ds_flow_gate=") || c.startsWith("ds_recovery_state="))
      .every((c) => /path=\/dashboard/i.test(c)),
    joined
  );
  // Supabase session cookies present on the request are deleted on the response.
  assert("request-present Supabase session cookie deleted", isDeletion(SB), entryFor(SB));
  assert("chunked Supabase auth cookies (.0/.1) deleted", isDeletion(`${SB}.0`) && isDeletion(`${SB}.1`), joined);
  assert("PKCE code-verifier cookie deleted", isDeletion(`${SB}-code-verifier`), entryFor(`${SB}-code-verifier`));
  // No returned Set-Cookie carries a non-empty Supabase auth session value.
  const nonEmptySbAuth = setCookies.filter((c) => {
    const name = c.slice(0, c.indexOf("="));
    const semi = c.indexOf(";");
    const value = c.slice(c.indexOf("=") + 1, semi === -1 ? undefined : semi);
    return /^sb-.*auth-token/.test(name) && value.length > 0;
  });
  assert("NO non-empty Supabase session survives the error response", nonEmptySbAuth.length === 0, nonEmptySbAuth.join(" | "));
  // Unrelated application cookie is not touched.
  assert("unrelated application cookie is NOT deleted", !entryFor("myapp_prefs"), joined);
} finally {
  stop();
}

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} callback cookie test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ Callback returned-response cookie-deletion tests passed.");
