#!/usr/bin/env node
// =============================================================================
// Unit tests for the client-bundle scanner (dependency-free, no build needed).
// Uses SYNTHETIC fake tokens only — never real keys.
// =============================================================================

import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import {
  classifyJwtToken,
  scanText,
  scanStaticDir,
} from "./scan-client-bundle.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
let failures = 0;
function assert(name, cond, detail = "") {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

// Build a synthetic JWT from a payload object. The signature segment carries an
// obvious marker so we can prove the scanner never echoes the token.
const SIG_MARKER = "SYNTHETICSIGDONOTLEAK0000000000";
function fakeJwt(payload) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${b64({ alg: "HS256", typ: "JWT" })}.${b64(payload)}.${SIG_MARKER}`;
}

console.log("Client-bundle scanner tests\n" + "-".repeat(60));

// --- JWT classification -----------------------------------------------------
const anonJwt = fakeJwt({ role: "anon", iss: "supabase", ref: "demo" });
const serviceJwt = fakeJwt({ role: "service_role", iss: "supabase", ref: "demo" });
const userJwt = fakeJwt({ role: "authenticated", sub: "00000000-0000-0000-0000-000000000000", session_id: "s1" });
const anonWithSub = fakeJwt({ role: "anon", sub: "11111111-1111-1111-1111-111111111111" });
const malformed = "eyJ" + "AAAA.BBBB.CCCC"; // not valid base64url JSON payload

assert("synthetic anon JWT → allowed", classifyJwtToken(anonJwt).allowed === true);
assert("synthetic service_role JWT → rejected", classifyJwtToken(serviceJwt).allowed === false && classifyJwtToken(serviceJwt).reason === "service_role");
assert("synthetic authenticated-user JWT → rejected", classifyJwtToken(userJwt).allowed === false);
assert("anon JWT carrying a user identity → rejected", classifyJwtToken(anonWithSub).allowed === false);
assert("malformed JWT candidate → rejected safely", classifyJwtToken(malformed).allowed === false);

// --- scanText over synthetic bundle content ---------------------------------
assert("bundle with anon JWT → no findings", scanText(`const k="${anonJwt}";`).length === 0);
assert("bundle with service_role JWT → finding", scanText(`const k="${serviceJwt}";`).length === 1);
assert("bundle with authenticated-user JWT → finding", scanText(`x="${userJwt}"`).length === 1);
assert("sb_publishable_ value → allowed (no finding)", scanText(`const k="sb_publishable_ABC123def456GHI789";`).length === 0);
assert("sb_secret_ value → rejected", scanText(`const k="sb_secret_SUPERSECRETVALUE123456";`).length === 1);
assert("forbidden server identifier → rejected", scanText(`process.env.SUPABASE_SERVICE_ROLE_KEY`).length === 1);
assert("clean bundle text → no findings", scanText(`export const x = 1; // nothing here`).length === 0);

// --- findings never contain the matched secret/token ------------------------
const leakedFindings = [
  ...scanText(`a="${serviceJwt}"`),
  ...scanText(`b="${userJwt}"`),
  ...scanText(`c="sb_secret_SUPERSECRETVALUE123456"`),
].join(" | ");
assert("findings output does not contain the token signature", !leakedFindings.includes(SIG_MARKER));
assert("findings output does not contain the sb_secret value", !leakedFindings.includes("SUPERSECRETVALUE"));
assert("findings output does not contain a full JWT payload segment", !/eyJ[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]{4,}\./.test(leakedFindings));

// --- missing .next/static is a failure --------------------------------------
let missingThrew = false;
try {
  scanStaticDir(join(HERE, "..", ".next", "__does_not_exist__"));
} catch (err) {
  missingThrew = err.code === "MISSING_STATIC";
}
assert("missing .next/static → failure (MISSING_STATIC)", missingThrew);

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} scanner test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ All client-bundle scanner tests passed.");
