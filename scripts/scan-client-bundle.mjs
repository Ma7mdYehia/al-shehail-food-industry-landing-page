#!/usr/bin/env node
// =============================================================================
// Post-build client-bundle secret scan (scan:client-bundle)
// =============================================================================
// Runs AFTER `next build` and scans the REAL client bundle under .next/static
// for server-only identifiers and accidental secret values. A MISSING
// .next/static directory is a FAILURE (the build must run first) — never a
// silently-passing skip. It reports offending file paths and match counts but
// NEVER prints any secret value.
//
// Usage:  npm run build && npm run scan:client-bundle
// =============================================================================

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const STATIC_DIR = join(ROOT, ".next", "static");

function failMissing() {
  console.error("✖ .next/static not found. Run `npm run build` before the client-bundle scan.");
  console.error("  A missing client bundle is a FAILURE (cannot prove absence of secrets).");
  process.exit(1);
}

if (!existsSync(STATIC_DIR) || !statSync(STATIC_DIR).isDirectory()) failMissing();

// Server-only identifiers that must never appear in a client bundle.
const FORBIDDEN_IDENTIFIERS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "service_role",
  "RESEND_API_KEY",
  "TURNSTILE_SECRET_KEY",
  "ADMIN_ALLOWED_EMAILS",
];
// Accidental secret VALUE shapes (matched, never printed).
const SECRET_VALUE_PATTERNS = [
  { name: "JWT", re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/ },
  { name: "supabase secret key", re: /sb_secret_[A-Za-z0-9]{10,}/ },
  { name: "supabase publishable/service literal", re: /sb[a-z]*_[A-Za-z0-9]{20,}/ },
];

let filesScanned = 0;
const findings = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(js|mjs|cjs)$/.test(entry.name)) {
      filesScanned += 1;
      const text = readFileSync(p, "utf8");
      const rel = relative(ROOT, p);
      for (const id of FORBIDDEN_IDENTIFIERS) {
        if (text.includes(id)) findings.push(`${rel}: forbidden identifier "${id}"`);
      }
      for (const { name, re } of SECRET_VALUE_PATTERNS) {
        if (re.test(text)) findings.push(`${rel}: matches ${name} secret-value shape`);
      }
    }
  }
}

walk(STATIC_DIR);

console.log(`Client-bundle scan: ${filesScanned} file(s) under .next/static`);
if (findings.length) {
  console.error(`\n✖ ${findings.length} potential leak(s) (values not shown):`);
  for (const f of findings) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("✓ No server-only identifier or secret-value shape found in the client bundle.");
