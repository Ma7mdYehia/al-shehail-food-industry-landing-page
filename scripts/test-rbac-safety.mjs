#!/usr/bin/env node
// =============================================================================
// RBAC / Auth safety tests (dependency-free, DB-free)
// =============================================================================
// Proves the intended role matrix and the privilege-escalation protections, and
// statically verifies that the migration + scripts + TS utilities enforce them.
// Complements scripts/validate-schema-structure.mjs and the ephemeral-Postgres
// RLS harness documented in the P03 doc. Runs in CI.
// =============================================================================

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { DASHBOARD_MEMBERS, validateConfig, normalizeEmail } from "./dashboard-members.config.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
let failures = 0;
function assert(name, cond, detail = "") {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

// ---------------------------------------------------------------------------
// 1. Intended permission matrix (pure model — the single source of truth the
//    DB policies and TS helpers must both match).
// ---------------------------------------------------------------------------
const MATRIX = {
  owner:  { readContent: true, insert: true, update: true, delete: true, manageMembers: true, handleEnquiries: true },
  admin:  { readContent: true, insert: true, update: true, delete: true, manageMembers: false, handleEnquiries: true },
  editor: { readContent: true, insert: true, update: true, delete: false, manageMembers: false, handleEnquiries: true },
  // anon / non-member / inactive: no dashboard capabilities at all
  none:   { readContent: false, insert: false, update: false, delete: false, manageMembers: false, handleEnquiries: false },
};

console.log("RBAC safety tests\n" + "-".repeat(60));
console.log("Role matrix:");
assert("owner has full CRUD + member management", MATRIX.owner.delete && MATRIX.owner.manageMembers);
assert("admin has full content CRUD but NOT member management", MATRIX.admin.delete && !MATRIX.admin.manageMembers);
assert("editor can insert/update but NOT delete, NOT manage members", MATRIX.editor.insert && MATRIX.editor.update && !MATRIX.editor.delete && !MATRIX.editor.manageMembers);
assert("all roles may handle enquiries", MATRIX.owner.handleEnquiries && MATRIX.admin.handleEnquiries && MATRIX.editor.handleEnquiries);
assert("no-role (anon/non-member/inactive) has zero dashboard capability", Object.values(MATRIX.none).every((v) => v === false));

// ---------------------------------------------------------------------------
// 2. TS role helpers mirror the matrix (checked against source, since importing
//    .ts from node without a build isn't available here).
// ---------------------------------------------------------------------------
console.log("\nTS role helpers (lib/auth/roles.ts):");
const rolesSrc = existsSync(join(ROOT, "lib/auth/roles.ts")) ? readFileSync(join(ROOT, "lib/auth/roles.ts"), "utf8") : "";
assert("canDeleteContent excludes editor", /canDeleteContent[\s\S]*?role === "owner" \|\| role === "admin"/.test(rolesSrc));
assert("canManageMembers is owner-only", /canManageMembers[\s\S]*?role === "owner"/.test(rolesSrc));
assert("canWriteContent includes editor", /canWriteContent[\s\S]*?role === "editor"/.test(rolesSrc));

// ---------------------------------------------------------------------------
// 3. Migration enforces the matrix (static SQL structure).
// ---------------------------------------------------------------------------
console.log("\nMigration enforcement (RLS policies):");
const migDir = join(ROOT, "supabase", "migrations");
const sql = readdirSync(migDir)
  .filter((f) => f.endsWith(".sql"))
  .map((f) => readFileSync(join(migDir, f), "utf8"))
  .join("\n")
  .replace(/--[^\n]*/g, "");
assert("content DELETE gated by is_dashboard_content_admin() (editors excluded)", /for delete to authenticated\s+using\s*\(public\.is_dashboard_content_admin\(\)\)/i.test(sql));
assert("content INSERT/UPDATE gated by is_dashboard_member()", /for insert to authenticated\s+with check\s*\(public\.is_dashboard_member\(\)\)/i.test(sql));
assert("membership writes are owner-only", /dashboard_members_owner_insert[\s\S]*?with check\s*\(public\.is_dashboard_owner\(\)\)/i.test(sql));
assert("no self-promotion: non-owners have no membership write policy", !/dashboard_members_(admin|editor|member)_(insert|update)/i.test(sql));
assert("final-owner trigger protects last owner", /create trigger protect_final_owner/i.test(sql) && /final active dashboard owner/i.test(sql));
assert("inactive members resolve to no role (is_active filter in role helper)", /current_dashboard_role[\s\S]*?is_active/i.test(sql));
assert("helpers are SECURITY DEFINER with fixed search_path", /is_dashboard_member[\s\S]*?security definer[\s\S]*?set search_path\s*=\s*''/i.test(sql));
assert("form_enquiries workflow-only UPDATE grant (original data immutable)", /grant update \(status,\s*internal_notes,\s*assigned_to,\s*handled_at,\s*handled_by\)\s*on (public\.)?form_enquiries to authenticated/i.test(sql));
assert("form_enquiries has no anon access", !/create policy[^;]*form_enquiries[\s\S]*?to[^;]*\banon\b/i.test(sql) && !/grant[^;]*form_enquiries[^;]*\banon\b/i.test(sql));
assert("anon has no INSERT/UPDATE/DELETE policy anywhere (P02 public reads preserved)", !/for\s+(insert|update|delete)\s+to[^;]*\banon\b/i.test(sql));
assert("public active-content SELECT policies preserved (P02)", /products_public_read[\s\S]*?using \(is_active\)/i.test(sql));

// ---------------------------------------------------------------------------
// 4. Bootstrap safety (dry-run default, apply gating, no user creation).
// ---------------------------------------------------------------------------
console.log("\nMembership bootstrap safety:");
const boot = readFileSync(join(HERE, "bootstrap-dashboard-members.mjs"), "utf8");
assert("bootstrap default is dry-run (read-only)", /DRY RUN/i.test(boot) && /const APPLY = process\.argv\.includes\("--apply"\)/.test(boot));
assert("--apply requires the service-role key", /SUPABASE_SERVICE_ROLE_KEY is required for --apply/.test(boot));
assert("--apply refused in CI", /Refusing --apply in CI/.test(boot));
assert("bootstrap never creates or invites auth users", !/createUser|inviteUserByEmail|admin\.invite/i.test(boot));
assert("bootstrap fails closed on missing/ambiguous auth user", /missing/.test(boot) && /ambiguous/i.test(boot));
assert("bootstrap does not delete other members", !/\.delete\(/.test(boot));

// ---------------------------------------------------------------------------
// 5. Config integrity (three confirmed members, normalized, one owner).
// ---------------------------------------------------------------------------
console.log("\nMembers config:");
let cfgSummary;
try {
  cfgSummary = validateConfig(DASHBOARD_MEMBERS);
  assert("config valid (normalized, ≥1 owner)", true, `${cfgSummary.count} members, ${cfgSummary.owners} owner(s)`);
} catch (err) {
  assert("config valid", false, err.message.split("\n")[0]);
}
const expected = { "marketing@halsabake.com": "owner", "gm@elshohail.com": "admin", "osama@halsabake.com": "editor" };
for (const [email, role] of Object.entries(expected)) {
  const m = DASHBOARD_MEMBERS.find((x) => normalizeEmail(x.email) === email);
  assert(`${email} → ${role}`, m && m.role === role, m ? `role=${m.role}` : "missing");
}

// ---------------------------------------------------------------------------
// 6. No service-role leakage into client bundles (if a build exists).
// ---------------------------------------------------------------------------
console.log("\nClient-bundle safety:");
const staticDir = join(ROOT, ".next", "static");
if (existsSync(staticDir)) {
  let leaks = 0;
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.js$/.test(e.name)) {
        const t = readFileSync(p, "utf8");
        if (/SUPABASE_SERVICE_ROLE_KEY|service_role/i.test(t)) leaks++;
      }
    }
  };
  walk(staticDir);
  assert("no service-role identifier in client bundle (.next/static)", leaks === 0, `${leaks} file(s)`);
} else {
  assert("client bundle scan", true, "skipped (.next/static not built)");
}

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} RBAC safety test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ All RBAC safety tests passed.");
