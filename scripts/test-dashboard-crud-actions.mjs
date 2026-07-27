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

// Transpile a lib/dashboard module graph (rewriting @/lib/dashboard/* imports to
// flat sibling files) so the REAL pure builder logic can be imported + executed.
function transpileGraph(names) {
  for (const name of names) {
    let src = read(`lib/dashboard/${name}.ts`);
    src = src.replace(/@\/lib\/dashboard\/([a-z-]+)/g, "./$1.mjs");
    const out = ts.transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    writeFileSync(join(tmp, `${name}.mjs`), out);
  }
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

// ===========================================================================
// EXECUTABLE builder tests — run the REAL parsing/payload logic the actions use.
// ===========================================================================
transpileGraph([
  "validation", "product-constants", "media-constants", "service-constants",
  "partner-constants", "enquiry-constants", "action-state", "inputs", "executors",
]);
const I = await import(pathToFileURL(join(tmp, "inputs.mjs")).href);
const X = await import(pathToFileURL(join(tmp, "executors.mjs")).href);
const UUID = "11111111-2222-4333-8444-555555555555";
function fd(entries) {
  const f = new FormData();
  for (const [k, val] of Object.entries(entries)) f.set(k, val);
  return f;
}
const baseProduct = {
  slug: "new-prod", categoryId: "cat_x", name_en: "N", name_ar: "ن",
  shortDescription_en: "s", shortDescription_ar: "س", cardDescription_en: "c", cardDescription_ar: "ك",
  iconType: "loaf", imageAssetId: "", featured: "",
};

console.log("\n1. New records are created inactive / pending (executed):");
{
  const r = I.buildProductCreate(fd(baseProduct));
  assert("buildProductCreate → is_active:false", r.ok && r.value.is_active === false);
}
{
  const r = I.buildCategoryCreate(fd({ slug: "c", name_en: "N", name_ar: "ن", description_en: "d", description_ar: "د" }));
  assert("buildCategoryCreate → is_active:false", r.ok && r.value.is_active === false);
}
{
  const r = I.buildServiceCreate(fd({ slug: "svc", metaTitle_en: "T", metaTitle_ar: "ت", metaDescription_en: "D", metaDescription_ar: "د", heroEyebrow_en: "E", heroEyebrow_ar: "ي", heroTitle_en: "H", heroTitle_ar: "ه", heroSubtitle_en: "S", heroSubtitle_ar: "س" }));
  assert("buildServiceCreate → is_active:false", r.ok && r.value.is_active === false);
}
{
  const r = I.buildSectionCreate(fd({ serviceId: "svc_1", sectionType: "intro", sortOrder: "0" }));
  assert("buildSectionCreate → is_active:false", r.ok && r.value.insert.is_active === false);
}
{
  const r = I.buildPartnerCreate(fd({ slug: "p", name: "P", assetId: "" }));
  assert("buildPartnerCreate → is_active:false", r.ok && r.value.is_active === false);
}
{
  const r = I.buildProjectCreate(fd({ partnerId: "partner_1", slug: "pj", title_en: "T", title_ar: "ت", summary_en: "S", summary_ar: "س" }));
  assert("buildProjectCreate → is_active:false", r.ok && r.value.insert.is_active === false);
}
{
  // The EXACT payload the create form submits (no status field in create mode).
  const createForm = fd({ key: "product_new", path: "/img/new.png", type: "products", alt_en: "New", alt_ar: "", width: "800", height: "600" });
  const r = I.buildMediaCreate(createForm);
  assert("media create-form payload succeeds and yields status:'pending'", r.ok && r.value.status === "pending" && r.value.key === "product_new");
  const forged = I.buildMediaCreate(fd({ key: "k1", type: "products", alt_en: "a", alt_ar: "", status: "active" }));
  assert("buildMediaCreate rejects a forged status field", !forged.ok && forged.errors._form !== undefined);
}

console.log("\n2. Reliable dashboard-created (UUID) delete rule (executed):");
assert("seeded text id is NOT deletable", v.isDashboardCreatedId("detail_toast") === false && v.isDashboardCreatedId("prod_arabic_bread") === false && v.isDashboardCreatedId("opt_seed_1") === false);
assert("dashboard-created UUID IS deletable", v.isDashboardCreatedId(UUID) === true);
assert("blank/garbage ids are NOT deletable", v.isDashboardCreatedId("") === false && v.isDashboardCreatedId("not-a-uuid") === false);
// delete actions use the UUID rule (wiring), not a prefix regex
const prodAct = read("lib/dashboard/product-actions.ts");
const mediaAct = read("lib/dashboard/media-actions.ts");
const svcAct = read("lib/dashboard/service-actions.ts");
const partAct = read("lib/dashboard/partner-actions.ts");
for (const [name, src] of [["product", prodAct], ["media", mediaAct], ["service", svcAct], ["partner", partAct]]) {
  assert(`${name} delete actions gate on isDashboardCreatedId (not a prefix regex)`, /isDashboardCreatedId\(id\)/.test(src) && !/SEED_ID_RE/.test(src));
}

console.log("\n3. Product-option editing (executed):");
{
  const r = I.buildOptionUpdate(fd({ optionId: UUID, expectedUpdatedAt: "2026-01-01T00:00:00Z", type: "variant", label_en: "L", label_ar: "ل", sortOrder: "2" }));
  assert("valid option edit builds type/label/sort payload", r.ok && r.value.set.type === "variant" && r.value.set.sort_order === 2 && r.value.set.label_localized.en === "L");
}
{
  const r = I.buildOptionUpdate(fd({ optionId: UUID, expectedUpdatedAt: "x", type: "not-a-type", label_en: "L", label_ar: "" }));
  assert("invalid option enum rejected", !r.ok && r.errors.type !== undefined);
}
{
  const r = I.buildOptionUpdate(fd({ optionId: UUID, expectedUpdatedAt: "x", type: "variant", label_en: "", label_ar: "" }));
  assert("missing option label English rejected", !r.ok && r.errors["label.en"] !== undefined);
}
{
  const r = I.buildOptionUpdate(fd({ optionId: UUID, type: "variant", label_en: "L", label_ar: "" }));
  assert("option edit without expectedUpdatedAt rejected (optimistic guard)", !r.ok && r.errors._form !== undefined);
}
assert("updateProductOptionAction exists + uses optimistic concurrency", /updateProductOptionAction/.test(prodAct) && /product_options[\s\S]*?\.eq\("updated_at", expectedUpdatedAt\)/.test(prodAct));

console.log("\n4. Product/detail partial-save safety (executed + wiring):");
{
  const r = I.buildProductDetail(fd({ productId: "prod_1", expectedUpdatedAt: "", positioning_en: "P", positioning_ar: "ب" }));
  assert("detail payload holds ONLY positioning + disclaimer (arrays preserved)", r.ok && Object.keys(r.value.set).sort().join(",") === "disclaimer_localized,positioning_localized");
}
assert("product core + detail are SEPARATE actions", /updateProductAction/.test(prodAct) && /updateProductDetailAction/.test(prodAct));
// The detail update/insert × error/stale/empty/success branching is EXECUTED in
// section 3b via saveProductDetail; here we assert the action wires it in.
assert("detail action delegates branching to the tested saveProductDetail executor", /saveProductDetail\(/.test(prodAct) && /product_details[\s\S]*?\.update\(s\)[\s\S]*?\.eq\("updated_at", exp\)/.test(prodAct) && /product_details[\s\S]*?\.insert\(/.test(prodAct));
assert("core update returns success only after checking data/error", /updateProductAction[\s\S]*?if \(error\) return fail[\s\S]*?data\.length === 0\) return fail\(STALE\)[\s\S]*?return success/.test(prodAct));

console.log("\n5. Enquiry assignment + affected-row handling (executed + wiring):");
{
  const r = I.buildEnquiryUpdate(fd({ id: UUID, expectedUpdatedAt: "2026-01-01T00:00:00Z", status: "contacted", internalNotes: "n", assignedTo: UUID }));
  assert("valid enquiry update parses status/notes/assignee + set keys", r.ok && Object.keys(r.value.set).sort().join(",") === "assigned_to,internal_notes,status" && r.value.assignedTo === UUID);
}
{
  const r = I.buildEnquiryUpdate(fd({ id: UUID, expectedUpdatedAt: "x", status: "contacted", assignedTo: "" }));
  assert("empty assignee → null (unassigned preserved)", r.ok && r.value.assignedTo === null && r.value.set.assigned_to === null);
}
{
  const r = I.buildEnquiryUpdate(fd({ id: UUID, expectedUpdatedAt: "x", status: "contacted", assignedTo: "not-a-uuid" }));
  assert("malformed assignee id rejected", !r.ok && r.errors.assignedTo !== undefined);
}
{
  const r = I.buildEnquiryUpdate(fd({ id: UUID, expectedUpdatedAt: "x", status: "bogus", assignedTo: "" }));
  assert("invalid enquiry status rejected", !r.ok && r.errors.status !== undefined);
}
{
  const r = I.buildEnquiryUpdate(fd({ id: UUID, status: "contacted", assignedTo: "" }));
  assert("enquiry update without expectedUpdatedAt rejected (optimistic guard)", !r.ok && r.errors._form !== undefined);
}
const enqAct = read("lib/dashboard/enquiry-actions.ts");
// The branching (assignee validity / optimistic / zero-row / success) is EXECUTED
// in section 3b via saveEnquiry; here we assert the action wires the real RPC +
// optimistic update into that executor.
assert("enquiry action wires the active-member RPC + optimistic update into saveEnquiry", /saveEnquiry\(/.test(enqAct) && /rpc\("dashboard_assignable_members"\)/.test(enqAct) && /\.eq\("updated_at", exp\)[\s\S]*?\.select\("id"\)/.test(enqAct));
{
  // Executed proof: the enquiry update payload never contains handled_by/handled_at.
  const r = I.buildEnquiryUpdate(fd({ id: UUID, expectedUpdatedAt: "x", status: "contacted", assignedTo: "" }));
  assert("enquiry update payload NEVER contains handled_by/handled_at", r.ok && !("handled_by" in r.value.set) && !("handled_at" in r.value.set));
}

console.log("\n6. Unknown-field rejection (executed in real action parsing):");
{
  const r = I.buildProductCreate(fd({ ...baseProduct, evilField: "x" }));
  assert("unexpected field rejected by buildProductCreate", !r.ok && r.errors._form !== undefined);
}
{
  const r = I.buildEnquiryUpdate(fd({ id: UUID, expectedUpdatedAt: "x", status: "contacted", assignedTo: "", handled_by: UUID }));
  assert("forged handled_by field on enquiry update rejected", !r.ok && r.errors._form !== undefined);
}
{
  const r = I.buildMediaUpdate(fd({ id: UUID, expectedUpdatedAt: "x", key: "k", path: "", type: "products", status: "active", alt_en: "a", alt_ar: "", sneaky: "1" }));
  assert("unexpected media field rejected", !r.ok && r.errors._form !== undefined);
}
{
  const clean = I.buildProductCreate(fd({ ...baseProduct, $ACTION_ID_abc: "ignored" }));
  assert("framework $ACTION bookkeeping fields are ignored (accepted)", clean.ok === true);
}

console.log("\n2b. Unknown-field rejection on deletes + team state (executed):");
for (const idKey of ["id", "optionId", "sectionId", "mappingId"]) {
  const okv = I.buildDeleteInput(fd({ [idKey]: UUID }), idKey);
  assert(`buildDeleteInput(${idKey}) accepts the id-only payload`, okv.ok && okv.value.id === UUID);
  const bad = I.buildDeleteInput(fd({ [idKey]: UUID, extra: "x" }), idKey);
  assert(`buildDeleteInput(${idKey}) rejects an unexpected field`, !bad.ok && bad.errors._form !== undefined);
  const clean = I.buildDeleteInput(fd({ [idKey]: UUID, $ACTION_ID_z: "ignored" }), idKey);
  assert(`buildDeleteInput(${idKey}) ignores $ACTION bookkeeping`, clean.ok === true);
}
{
  const okv = I.buildMemberState(fd({ memberId: UUID, role: "admin", isActive: "true" }));
  assert("buildMemberState accepts a valid member/role/state", okv.ok && okv.value.role === "admin" && okv.value.isActive === true);
  const badRole = I.buildMemberState(fd({ memberId: UUID, role: "superuser", isActive: "true" }));
  assert("buildMemberState rejects a role not in the enum", !badRole.ok && badRole.errors.role !== undefined);
  const badId = I.buildMemberState(fd({ memberId: "not-a-uuid", role: "admin", isActive: "true" }));
  assert("buildMemberState rejects a non-UUID member id", !badId.ok && badId.errors._form !== undefined);
  const extra = I.buildMemberState(fd({ memberId: UUID, role: "admin", isActive: "true", forged: "1" }));
  assert("buildMemberState rejects an unexpected field", !extra.ok && extra.errors._form !== undefined);
}

console.log("\n3b. Save behavior EXECUTED with injected Supabase mocks:");
const R = (data, error = null) => async () => ({ data, error }); // canned result (ignores call args)
const Rn = R;
// --- product detail ---
{
  const s = await X.saveProductDetail({ updateDetail: Rn(null, { m: "boom" }), insertDetail: Rn([{ id: 1 }]) }, { productId: "p", expectedUpdatedAt: "t", set: {} });
  assert("detail update error → generic failure", s.status === "error");
}
{
  const s = await X.saveProductDetail({ updateDetail: Rn([]), insertDetail: Rn([{ id: 1 }]) }, { productId: "p", expectedUpdatedAt: "t", set: {} });
  assert("detail update zero-row (stale) → failure", s.status === "error" && /changed by someone else/.test(s.message));
}
{
  const s = await X.saveProductDetail({ updateDetail: Rn([{ id: 1 }]), insertDetail: Rn(null, { m: "boom" }) }, { productId: "p", expectedUpdatedAt: "", set: {} });
  assert("detail insert error → failure", s.status === "error");
}
{
  const s = await X.saveProductDetail({ updateDetail: Rn([{ id: 1 }]), insertDetail: Rn([]) }, { productId: "p", expectedUpdatedAt: "", set: {} });
  assert("detail insert empty result → failure (no false success)", s.status === "error");
}
{
  const s = await X.saveProductDetail({ updateDetail: Rn([{ id: 1 }]), insertDetail: Rn([{ id: 2 }]) }, { productId: "p", expectedUpdatedAt: "t", set: {} });
  assert("detail successful update → success", s.status === "success");
}
{
  const s = await X.saveProductDetail({ updateDetail: Rn([{ id: 1 }]), insertDetail: Rn([{ id: 2 }]) }, { productId: "p", expectedUpdatedAt: "", set: {} });
  assert("detail successful insert → success", s.status === "success");
}
// --- enquiry ---
{
  const s = await X.saveEnquiry({ assignableMembers: R(null, { m: "boom" }), updateEnquiry: Rn([{ id: 1 }]) }, { id: "e", expectedUpdatedAt: "t", assignedTo: UUID, set: {} });
  assert("enquiry assignee RPC error → failure", s.status === "error" && /active team member/.test(s.message));
}
{
  const s = await X.saveEnquiry({ assignableMembers: R([{ id: "someone-else" }]), updateEnquiry: Rn([{ id: 1 }]) }, { id: "e", expectedUpdatedAt: "t", assignedTo: UUID, set: {} });
  assert("enquiry assignee inactive/not-in-set → failure", s.status === "error" && /active team member/.test(s.message));
}
{
  const s = await X.saveEnquiry({ assignableMembers: R([{ id: UUID }]), updateEnquiry: Rn(null, { m: "boom" }) }, { id: "e", expectedUpdatedAt: "t", assignedTo: UUID, set: {} });
  assert("enquiry update error → failure", s.status === "error");
}
{
  const s = await X.saveEnquiry({ assignableMembers: R([{ id: UUID }]), updateEnquiry: Rn([]) }, { id: "e", expectedUpdatedAt: "t", assignedTo: UUID, set: {} });
  assert("enquiry update zero-row (stale) → failure", s.status === "error" && /changed by someone else/.test(s.message));
}
{
  const s = await X.saveEnquiry({ assignableMembers: R([{ id: UUID }]), updateEnquiry: Rn([{ id: 1 }]) }, { id: "e", expectedUpdatedAt: "t", assignedTo: UUID, set: {} });
  assert("enquiry successful update (active assignee) → success", s.status === "success");
}
{
  let rpcCalled = false;
  const s = await X.saveEnquiry({ assignableMembers: async () => { rpcCalled = true; return { data: [], error: null }; }, updateEnquiry: Rn([{ id: 1 }]) }, { id: "e", expectedUpdatedAt: "t", assignedTo: null, set: {} });
  assert("enquiry unassigned (null) skips the RPC and succeeds", s.status === "success" && rpcCalled === false);
}

// ---- static security guards (supplementary) ---------------------------------
console.log("\nServer-action security (static, supplementary):");
const teamAct = read("lib/dashboard/team-actions.ts");
const core = read("lib/dashboard/actions-core.ts");
const sharedAct = read("lib/dashboard/shared-content-actions.ts");
assert("actions-core resolves the user via getUser()+membership (not getSession)", /getCurrentDashboardMember\(\)/.test(core) && !/\.getSession\(/.test(core));
assert("actions-core enforces minRoles", /minRoles\.includes\(member\.role\)/.test(core));
assert("team action re-authorizes as owner + uses the RPC", /authorizeAction\(\["owner"\]\)/.test(teamAct) && /rpc\("dashboard_set_member_state"/.test(teamAct));
assert("product/media hard delete is owner/admin + canDeleteContent", /authorizeAction\(\["owner", "admin"\]\)[\s\S]*?canDeleteContent/.test(prodAct) && /authorizeAction\(\["owner", "admin"\]\)/.test(mediaAct));
assert("every action returns only generic messages (no raw error.message)", ![prodAct, mediaAct, svcAct, partAct, enqAct, teamAct, sharedAct].some((s) => /error\.message/.test(s)));
assert("every action revalidates only dashboard paths", ![prodAct, mediaAct, svcAct, partAct, enqAct, teamAct, sharedAct].some((s) => /revalidatePath\("\/(?!dashboard)/.test(s)));
{
  // Executed proof: structured JSON columns are never in the update payloads, so
  // authored cta/items/detail/rich content is preserved untouched.
  const svc = I.buildServiceUpdate(fd({ id: UUID, expectedUpdatedAt: "x", slug: "s", metaTitle_en: "T", metaTitle_ar: "ت", metaDescription_en: "D", metaDescription_ar: "د", heroEyebrow_en: "E", heroEyebrow_ar: "ي", heroTitle_en: "H", heroTitle_ar: "ه", heroSubtitle_en: "S", heroSubtitle_ar: "س", isActive: "true", sortOrder: "0" }));
  const proj = I.buildProjectUpdate(fd({ id: UUID, expectedUpdatedAt: "x", slug: "p", title_en: "T", title_ar: "ت", summary_en: "S", summary_ar: "س", isActive: "true", sortOrder: "0" }));
  const ppp = I.buildProjectProductUpdate(fd({ mappingId: UUID, expectedUpdatedAt: "x", productId: "", name_en: "", name_ar: "", status: "needs-data", sortOrder: "0" }));
  const keys = (r) => Object.keys(r.value.set);
  assert("service update omits cta_json", svc.ok && !keys(svc).includes("cta_json"));
  assert("project update omits project_detail_json", proj.ok && !keys(proj).includes("project_detail_json"));
  assert("project-product update omits category/short_description/key_notes/nutrition/image", ppp.ok && !keys(ppp).some((k) => /category_localized|short_description_localized|key_notes|nutrition_highlights|image_asset_id/.test(k)));
}

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
