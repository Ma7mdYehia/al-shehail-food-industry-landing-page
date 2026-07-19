#!/usr/bin/env node
// =============================================================================
// Post-build client-bundle secret scan (scan:client-bundle)
// =============================================================================
// Runs AFTER `next build` and scans the REAL client bundle under .next/static.
// A MISSING .next/static directory is a FAILURE (build must run first).
//
// It distinguishes PUBLIC client tokens from SERVER secrets instead of flagging
// every JWT:
//   * JWT-shaped values are decoded locally (base64url payload only, never
//     printed). A Supabase token whose role claim is exactly "anon" is ALLOWED
//     (NEXT_PUBLIC_SUPABASE_ANON_KEY legacy format). role "service_role",
//     "authenticated"/embedded user-session tokens, and any malformed candidate
//     are REJECTED.
//   * Modern keys: "sb_publishable_..." is ALLOWED in the client bundle;
//     "sb_secret_..." is REJECTED.
//   * Server-only identifiers (SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY,
//     TURNSTILE_SECRET_KEY, ADMIN_ALLOWED_EMAILS) are REJECTED.
// Findings never contain the matched token/secret value.
//
// This module also EXPORTS its pure classifiers so they can be unit-tested with
// synthetic values (scripts/test-scan-client-bundle.mjs) with no build.
// =============================================================================

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

export const FORBIDDEN_IDENTIFIERS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "TURNSTILE_SECRET_KEY",
  "ADMIN_ALLOWED_EMAILS",
];

const JWT_RE = /\beyJ[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]{2,}/g;
const SB_SECRET_RE = /\bsb_secret_[A-Za-z0-9]{6,}/g;
// sb_publishable_ is explicitly allowed in the client bundle (not flagged).

// Decode ONLY the JWT payload (segment 2) locally. Returns the parsed object or
// null on any problem. Never returns/prints the raw token.
export function decodeJwtPayload(token) {
  try {
    const parts = String(token).split(".");
    if (parts.length !== 3) return null;
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== "object") return null;
    return obj;
  } catch {
    return null;
  }
}

// Classify a JWT-shaped token. Returns { allowed, reason } — reason is a claim
// role name or a safe label, NEVER the token itself.
export function classifyJwtToken(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return { allowed: false, reason: "malformed-jwt" };
  const role = typeof payload.role === "string" ? payload.role : null;
  if (role === "anon") {
    // A public anon token must not carry a user identity.
    if (payload.sub || payload.session_id) {
      return { allowed: false, reason: "anon-token-with-user-identity" };
    }
    return { allowed: true, reason: "anon" };
  }
  if (role === "service_role") return { allowed: false, reason: "service_role" };
  if (role === "authenticated") return { allowed: false, reason: "authenticated-session" };
  if (payload.sub || payload.session_id) return { allowed: false, reason: "user-session-token" };
  return { allowed: false, reason: role ? `role:${role}` : "no-role-claim" };
}

// Scan a blob of text. Returns an array of finding detail strings, none of which
// contain the matched token/secret value.
export function scanText(text) {
  const findings = [];

  for (const id of FORBIDDEN_IDENTIFIERS) {
    if (text.includes(id)) findings.push(`forbidden server identifier "${id}"`);
  }

  if (SB_SECRET_RE.test(text)) findings.push(`secret key present (sb_secret_… — value not shown)`);
  SB_SECRET_RE.lastIndex = 0;

  const seen = new Set();
  for (const m of text.matchAll(JWT_RE)) {
    const token = m[0];
    if (seen.has(token)) continue;
    seen.add(token);
    const { allowed, reason } = classifyJwtToken(token);
    if (!allowed) findings.push(`disallowed JWT in client bundle (${reason}; value not shown)`);
  }

  return findings;
}

// Walk .next/static and scan every JS chunk. Throws { code: "MISSING_STATIC" }
// when the directory is absent (a build must run first).
export function scanStaticDir(staticDir) {
  if (!existsSync(staticDir) || !statSync(staticDir).isDirectory()) {
    const err = new Error(".next/static not found — run `npm run build` first");
    err.code = "MISSING_STATIC";
    throw err;
  }
  let filesScanned = 0;
  const findings = [];
  const root = join(staticDir, "..", "..");
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.(js|mjs|cjs)$/.test(entry.name)) {
        filesScanned += 1;
        const rel = relative(root, p);
        for (const detail of scanText(readFileSync(p, "utf8"))) {
          findings.push(`${rel}: ${detail}`);
        }
      }
    }
  };
  walk(staticDir);
  return { filesScanned, findings };
}

// CLI entry (only when run directly, so tests can import without side effects).
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
  const STATIC_DIR = join(ROOT, ".next", "static");
  try {
    const { filesScanned, findings } = scanStaticDir(STATIC_DIR);
    console.log(`Client-bundle scan: ${filesScanned} file(s) under .next/static`);
    if (findings.length) {
      console.error(`\n✖ ${findings.length} potential leak(s) (values not shown):`);
      for (const f of findings) console.error(`  - ${f}`);
      process.exit(1);
    }
    console.log("✓ No server secret found (public anon/publishable keys are allowed).");
  } catch (err) {
    if (err.code === "MISSING_STATIC") {
      console.error(`✖ ${err.message}`);
      console.error("  A missing client bundle is a FAILURE (cannot prove absence of secrets).");
      process.exit(1);
    }
    throw err;
  }
}
