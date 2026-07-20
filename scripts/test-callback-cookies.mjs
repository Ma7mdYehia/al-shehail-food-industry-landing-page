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
  // directly to avoid a 308 normalization redirect before the handler runs.
  const res = await fetch(
    `http://127.0.0.1:${PORT}/dashboard/auth/callback/?code=stale-code&token_hash=stale-hash&type=recovery`,
    {
      redirect: "manual",
      headers: { Cookie: "ds_flow_gate=STALEGATEVALUE; ds_recovery_state=STALESTATEVALUE" },
    }
  );

  assert("callback failure is a redirect", res.status === 307 || res.status === 302, `status=${res.status}`);
  const location = res.headers.get("location") || "";
  assert("redirects to generic login error", /\/dashboard\/login\?error=auth/.test(location), location);

  // getSetCookie() returns the raw Set-Cookie header LIST (Node 18.14+/undici).
  const setCookies = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  const joined = setCookies.join("\n");

  // A deletion cookie is `name=; ...; Max-Age=0` (empty value, immediate expiry).
  const isDeletion = (name) =>
    setCookies.some(
      (c) => c.startsWith(`${name}=`) && /(^|;\s*)(max-age=0|expires=)/i.test(c)
    );

  assert(
    "returned response sets a ds_flow_gate deletion cookie (Max-Age=0)",
    isDeletion("ds_flow_gate"),
    joined
  );
  assert(
    "returned response sets a ds_recovery_state deletion cookie (Max-Age=0)",
    isDeletion("ds_recovery_state"),
    joined
  );
  assert(
    "deletion cookies are scoped to /dashboard",
    setCookies
      .filter((c) => c.startsWith("ds_flow_gate=") || c.startsWith("ds_recovery_state="))
      .every((c) => /path=\/dashboard/i.test(c)),
    joined
  );
} finally {
  stop();
}

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} callback cookie test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ Callback returned-response cookie-deletion tests passed.");
