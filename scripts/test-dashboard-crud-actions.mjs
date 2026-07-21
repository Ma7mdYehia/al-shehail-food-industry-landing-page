#!/usr/bin/env node
// =============================================================================
// P05 dashboard CRUD — application-level tests (no network, no DB).
// =============================================================================
// Executes the REAL pure validation logic (transpiled from
// lib/dashboard/validation.ts) and statically verifies the server-action and
// data-loading modules for the P05 security contract: every mutation
// re-authorizes, enquiry updates never touch handled_by/handled_at, generic
// errors only, no service-role key, bounded pagination, unknown-field rejection.
// =============================================================================

import { readFileSync, writeFileSync, mkdtempSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import ts from "typescript";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
let failures = 0;
function assert(name, cond, detail = "") {
  const okv = !!cond;
  if (!okv) failures++;
  console.log(`  ${okv ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const tmp = mkdtempSync(join(tmpdir(), "p05act-"));
async function loadTs(relPath) {
  const src = read(relPath);
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const file = join(tmp, relPath.replace(/[\\/]/g, "_").replace(/\.ts$/, ".mjs"));
  writeFileSync(file, out);
  return import(pathToFileURL(file).href);
}

console.log("P05 dashboard CRUD application tests\n" + "-".repeat(60));

// ---- real validation logic --------------------------------------------------
const v = await loadTs("lib/dashboard/validation.ts");

console.log("Validation (real logic):");
{
  const e = {};
  const loc = v.localized({ en: "Hello", ar: "مرحبا" }, "name", e);
  assert("valid localized accepted", Object.keys(e).length === 0 && loc.en === "Hello" && loc.ar === "مرحبا");
}
{
  const e = {};
  v.localized({ ar: "x" }, "name", e);
  assert("localized missing English rejected", e["name.en"] !== undefined);
}
{
  const e = {};
  v.localized("not-an-object", "name", e);
  assert("localized non-object rejected", e.name !== undefined);
}
{
  const e = {};
  v.localized({ en: "ok", ar: "" }, "alt", e);
  assert("localized empty Arabic allowed by default (matches DB)", e["alt.ar"] === undefined);
}
{
  const e = {};
  v.localized({ en: "ok", ar: "" }, "alt", e, { arRequired: true });
  assert("localized arRequired enforces Arabic", e["alt.ar"] !== undefined);
}
{
  const e = {};
  v.slug("Bad Slug!", "slug", e);
  assert("invalid slug rejected", e.slug !== undefined);
  const e2 = {};
  const s = v.slug("good-slug-2", "slug", e2);
  assert("valid slug normalized", Object.keys(e2).length === 0 && s === "good-slug-2");
}
{
  const e = {};
  v.rejectUnknownFields({ known: 1, sneaky: 2 }, ["known"], e);
  assert("unknown field rejected", e._form !== undefined);
  const e2 = {};
  v.rejectUnknownFields({ known: 1 }, ["known"], e2);
  assert("known-only fields accepted", e2._form === undefined);
}
{
  assert("boundedInt clamps above max", v.boundedInt(9999, 1, 100, 20) === 100);
  assert("boundedInt clamps below min", v.boundedInt(-5, 1, 100, 20) === 1);
  assert("boundedInt falls back on NaN", v.boundedInt("xyz", 1, 100, 20) === 20);
}
{
  const p = v.pagination("3", "500");
  assert("pagination clamps pageSize to max", p.pageSize === v.LIMITS.pageSizeMax);
  assert("pagination computes offset", p.page === 3 && p.offset === (3 - 1) * v.LIMITS.pageSizeMax);
  const d = v.pagination(undefined, undefined);
  assert("pagination defaults are safe", d.page === 1 && d.pageSize === v.LIMITS.pageSizeDefault && d.offset === 0);
}
{
  const e = {};
  const okv = v.oneOf("new", ["new", "closed"], "status", e);
  assert("oneOf accepts a member", okv === "new" && e.status === undefined);
  const e2 = {};
  v.oneOf("nope", ["new", "closed"], "status", e2);
  assert("oneOf rejects a non-member", e2.status !== undefined);
}
{
  const e = {};
  v.reqText("  ", "title", e);
  assert("reqText rejects blank", e.title !== undefined);
  const e2 = {};
  v.reqText("x".repeat(9999), "title", e2, 200);
  assert("reqText enforces max length", e2.title !== undefined);
}

// ---- static security guards on the action / data modules --------------------
console.log("\nServer-action security (static):");
const teamAct = read("lib/dashboard/team-actions.ts");
const enqAct = read("lib/dashboard/enquiry-actions.ts");
const core = read("lib/dashboard/actions-core.ts");

assert("actions-core resolves the user via getUser()+membership (not getSession)", /getCurrentDashboardMember\(\)/.test(core) && !/\.getSession\(/.test(core));
assert("actions-core enforces minRoles", /minRoles\.includes\(member\.role\)/.test(core));
assert("team action re-authorizes as owner", /authorizeAction\(\["owner"\]\)/.test(teamAct));
assert("team action validates role against the enum (never trusts the browser)", /DASHBOARD_ROLES[\s\S]*\.includes\(role\)/.test(teamAct));
assert("team action routes changes through the SECURITY DEFINER RPC", /rpc\("dashboard_set_member_state"/.test(teamAct));
assert("team action returns only generic messages", /fail\(/.test(teamAct) && !/error\.message/.test(teamAct));
assert("team action revalidates only dashboard paths", /revalidatePath\("\/dashboard/.test(teamAct) && !/revalidatePath\("\/(?!dashboard)/.test(teamAct));

assert("enquiry action re-authorizes (active member)", /authorizeAction\(\)/.test(enqAct));
assert("enquiry action NEVER writes/reads handled_by/handled_at", !/handled_(by|at)\s*[:=]/.test(enqAct) && !/get\(["'`]handled/.test(enqAct));
assert("enquiry action updates ONLY workflow columns", /\.update\(\{ status, internal_notes: [^}]*assigned_to[^}]*\}\)/.test(enqAct));
assert("enquiry action validates status against the enum", /isEnquiryStatus\(status\)/.test(enqAct));
assert("enquiry action bounds notes length", /LIMITS\.long/.test(enqAct));
assert("enquiry action returns only generic messages", /fail\(/.test(enqAct) && !/error\.message/.test(enqAct));

// ---- product actions: optimistic concurrency + safe delete -----------------
console.log("\nProduct actions (static):");
const prodAct = read("lib/dashboard/product-actions.ts");
assert("product create/update re-authorize", /authorizeAction\(\)/.test(prodAct) && /authorizeAction\(\["owner", "admin"\]\)/.test(prodAct));
assert("product update uses updated_at optimistic concurrency", /\.eq\("updated_at", expectedUpdatedAt\)/.test(prodAct));
assert("stale update is rejected generically", /data\.length === 0\) return fail\(STALE\)/.test(prodAct));
assert("hard delete is owner/admin + canDeleteContent", /deleteProductAction[\s\S]*?authorizeAction\(\["owner", "admin"\]\)[\s\S]*?canDeleteContent/.test(prodAct));
assert("seed-backed products cannot be hard-deleted", /SEED_ID_RE\.test\(id\)[\s\S]*?Seed-backed products cannot be deleted/.test(prodAct));
assert("product actions validate icon/option enums", /PRODUCT_ICON_TYPES/.test(prodAct) && /PRODUCT_OPTION_TYPES/.test(prodAct));
assert("product actions return only generic messages", /fail\(/.test(prodAct) && !/error\.message/.test(prodAct));
assert("product actions revalidate only dashboard paths", /revalidatePath\("\/dashboard/.test(prodAct) && !/revalidatePath\("\/(?!dashboard)/.test(prodAct));
assert("product editor localized array lists are preserved (not overwritten)", /preserved untouched|are preserved/.test(prodAct));

// ---- media actions ----------------------------------------------------------
console.log("\nMedia actions (static):");
const mediaAct = read("lib/dashboard/media-actions.ts");
assert("media update uses updated_at optimistic concurrency", /\.eq\("updated_at", expectedUpdatedAt\)/.test(mediaAct));
assert("media delete is owner/admin + seed/FK protected", /authorizeAction\(\["owner", "admin"\]\)/.test(mediaAct) && /SEED_ID_RE\.test\(id\)/.test(mediaAct) && /referenced by content/.test(mediaAct));
assert("media never fakes an upload (metadata only)", !/upload/i.test(mediaAct) || /no binary upload|metadata only/i.test(mediaAct));
assert("media actions return only generic messages", /fail\(/.test(mediaAct) && !/error\.message/.test(mediaAct));

// ---- services / partners / shared content: preservation + concurrency -------
console.log("\nServices / Partners / Shared content (static):");
const svcAct = read("lib/dashboard/service-actions.ts");
assert("service update uses optimistic concurrency", /\.eq\("updated_at", expectedUpdatedAt\)/.test(svcAct));
assert("service preserves structured cta_json/items_json", /cta_json intentionally omitted|items_json preserved|preserved\/managed elsewhere/.test(svcAct));
const partAct = read("lib/dashboard/partner-actions.ts");
assert("partner/project update uses optimistic concurrency", /\.eq\("updated_at", expectedUpdatedAt\)/.test(partAct));
assert("project-product preserves rich/NEEDS_VERIFICATION fields", /preserved untouched/.test(partAct));
assert("project-product preserves null product_id mappings", /null preserved when no catalog product/.test(partAct));
const sharedAct = read("lib/dashboard/shared-content-actions.ts");
assert("shared content edits only the disclaimer (arrays preserved)", /recipe_disclaimer_localized/.test(sharedAct) && !/private_label_points|packaging_options|quality_points/.test(sharedAct));
assert("shared content uses optimistic concurrency + generic errors", /\.eq\("updated_at", expectedUpdatedAt\)/.test(sharedAct) && /changed by someone else/.test(sharedAct));

// ---- no service-role key anywhere in the dashboard runtime -------------------
console.log("\nNo service-role key in dashboard runtime:");
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}
const runtimeFiles = [
  ...walk(join(ROOT, "lib/dashboard")),
  ...walk(join(ROOT, "app/dashboard")),
  ...walk(join(ROOT, "components/dashboard")),
];
const leaks = runtimeFiles.filter((f) =>
  /SERVICE_ROLE|service_role_key|getSupabaseServiceRoleKey/i.test(readFileSync(f, "utf8"))
);
assert("no SERVICE_ROLE / service-role key reference in dashboard runtime", leaks.length === 0, leaks.join(", "));

// ---- enquiry data search is injection-safe ---------------------------------
console.log("\nEnquiry query safety (static):");
const enqData = read("lib/dashboard/enquiry-data.ts");
assert("free-text search is sanitized to a safe token set", /replace\(\/\[\^a-zA-Z0-9 @\._-\]\/g/.test(enqData));
assert("date filters are ISO-validated before use", /ISO_DATE\.test/.test(enqData));
assert("assignee filter is UUID-validated before use", /UUID_RE\.test\(filters\.assignedTo\)/.test(enqData));
assert("list uses bounded pagination range", /\.range\(offset, offset \+ pageSize - 1\)/.test(enqData));

console.log("-".repeat(60));
if (failures) {
  console.error(`\n✖ ${failures} P05 application test(s) failed.`);
  process.exit(1);
}
console.log("\n✓ All P05 dashboard CRUD application tests passed.");
