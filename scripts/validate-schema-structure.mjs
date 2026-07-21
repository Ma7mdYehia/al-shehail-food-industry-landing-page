#!/usr/bin/env node
// =============================================================================
// Static schema-structure validator (db:schema:validate)
// =============================================================================
// A dependency-free structural guard that CI can run WITHOUT Docker, Supabase
// credentials, network access, or production secrets. It parses the migration
// SQL as text and asserts the shape of the schema. It is NOT a substitute for a
// real PostgreSQL apply — it cannot prove the SQL runs — but it catches drift
// between intent and the migration (missing tables, RLS not enabled, missing
// indexes/checks/triggers, a public policy accidentally added to form_enquiries,
// the importer losing its dry-run default, or a hard-coded secret).
// =============================================================================

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const MIGRATIONS_DIR = join(ROOT, "supabase", "migrations");

const errors = [];
const passes = [];
function check(condition, ok, bad) {
  if (condition) passes.push(ok);
  else errors.push(bad);
}

// ---- locate the migration -------------------------------------------------
if (!existsSync(MIGRATIONS_DIR)) {
  console.error("✖ supabase/migrations directory is missing");
  process.exit(1);
}
const migrationFiles = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));
check(
  migrationFiles.length > 0,
  `found ${migrationFiles.length} migration file(s)`,
  "no .sql migration file found under supabase/migrations"
);
const rawSql = migrationFiles.map((f) => readFileSync(join(MIGRATIONS_DIR, f), "utf8")).join("\n");
// Strip `--` line comments so prose (which mentions grants/policies/tables to
// explain intent) cannot trigger false positives in the structural scan.
const sql = rawSql.replace(/--[^\n]*/g, "");

const CONTENT_TABLES = [
  "media_assets",
  "product_categories",
  "products",
  "product_details",
  "product_options",
  "services",
  "service_sections",
  "partners",
  "partner_projects",
  "partner_project_products",
  "shared_content",
];
const ALL_TABLES = [...CONTENT_TABLES, "form_enquiries"];

// ---- 1. every table is created --------------------------------------------
for (const t of ALL_TABLES) {
  check(
    new RegExp(`create table (public\\.)?${t}\\b`, "i").test(sql),
    `table ${t} created`,
    `missing CREATE TABLE for ${t}`
  );
}

// ---- 2. RLS enabled on every table ----------------------------------------
for (const t of ALL_TABLES) {
  check(
    new RegExp(`alter table\\s+(public\\.)?${t}\\s+enable row level security`, "i").test(sql),
    `RLS enabled on ${t}`,
    `RLS not enabled on ${t}`
  );
}

// ---- 3. form_enquiries: anon remains fully locked out ---------------------
// (P03 adds authenticated dashboard access, but anon must still have no policy
// and no grant. We assert nothing targets `anon` on form_enquiries.)
check(
  !/create policy[^;]*\bon\s+(public\.)?form_enquiries\b[\s\S]*?\bto\b[^;]*\banon\b/i.test(sql),
  "form_enquiries has no anon RLS policy",
  "form_enquiries must not expose any policy to anon"
);
check(
  !/grant[^;]*\bon[^;]*form_enquiries[^;]*to[^;]*\banon\b/i.test(sql),
  "form_enquiries not granted to anon",
  "form_enquiries must not be granted to anon"
);
// anon must never gain write on content tables either (no policy 'to anon' for
// insert/update/delete anywhere).
check(
  !/for\s+(insert|update|delete)\s+to[^;]*\banon\b/i.test(sql),
  "no anon INSERT/UPDATE/DELETE policy exists",
  "anon must have no write policy on any table"
);

// ---- 4. required indexes ---------------------------------------------------
const REQUIRED_INDEX_PATTERNS = [
  ["media_assets (type, status)", /on (public\.)?media_assets\s*\(type,\s*status\)/i],
  ["product_categories (is_active, sort_order)", /on (public\.)?product_categories\s*\(is_active,\s*sort_order\)/i],
  ["products (category_id)", /on (public\.)?products\s*\(category_id\)/i],
  ["products (category_id, sort_order)", /on (public\.)?products\s*\(category_id,\s*sort_order\)/i],
  ["products partial featured index", /on (public\.)?products\s*\(featured\)\s*where/i],
  ["product_options (product_id, type, sort_order)", /on (public\.)?product_options\s*\(product_id,\s*type,\s*sort_order\)/i],
  ["service_sections (service_id, sort_order)", /on (public\.)?service_sections\s*\(service_id,\s*sort_order\)/i],
  ["partner_projects (partner_id)", /on (public\.)?partner_projects\s*\(partner_id\)/i],
  ["partner_project_products (partner_project_id, sort_order)", /on (public\.)?partner_project_products\s*\(partner_project_id,\s*sort_order\)/i],
  ["partner_project_products partial product_id index", /on (public\.)?partner_project_products\s*\(product_id\)\s*where/i],
  ["form_enquiries (created_at desc)", /on (public\.)?form_enquiries\s*\(created_at desc\)/i],
  ["form_enquiries (status)", /on (public\.)?form_enquiries\s*\(status\)/i],
  ["form_enquiries (email)", /on (public\.)?form_enquiries\s*\(email\)/i],
  ["form_enquiries (status, created_at desc)", /on (public\.)?form_enquiries\s*\(status,\s*created_at desc\)/i],
];
for (const [name, re] of REQUIRED_INDEX_PATTERNS) {
  check(re.test(sql), `index present: ${name}`, `missing index: ${name}`);
}

// ---- 5. required CHECK constraints (enums etc.) ---------------------------
const REQUIRED_CHECKS = [
  ["media_assets.type", /type in \('brand',\s*'partners',\s*'products',\s*'factory',\s*'certifications',\s*'retail',\s*'og'\)/i],
  ["media_assets.status", /status in \('active',\s*'pending',\s*'legacy'\)/i],
  ["products.icon_type", /icon_type in \('flatbread'/i],
  ["product_options.type", /type in \('use_case',\s*'private_label_option',\s*'variant',\s*'recipe_option'\)/i],
  ["service_sections.section_type", /section_type in \('intro',\s*'coverage'/i],
  ["partner_project_products.status", /status in \('active',\s*'planned',\s*'needs-data'\)/i],
  ["form_enquiries.locale", /locale in \('en',\s*'ar'\)/i],
  ["form_enquiries.status", /status in \('new',\s*'contacted',\s*'qualified',\s*'closed',\s*'spam'\)/i],
  ["localized guard function", /function (public\.)?is_localized/i],
];
for (const [name, re] of REQUIRED_CHECKS) {
  check(re.test(sql), `check/constraint present: ${name}`, `missing check/constraint: ${name}`);
}

// ---- 6. updated_at trigger wiring -----------------------------------------
check(
  /function (public\.)?set_updated_at/i.test(sql),
  "set_updated_at() function defined",
  "missing set_updated_at() trigger function"
);
check(
  /create trigger set_updated_at/i.test(sql),
  "updated_at trigger(s) created",
  "no updated_at trigger created"
);

// ---- 7. importer is dry-run by default & has no hard-coded secrets ---------
const importerPath = join(HERE, "import-phase-1-to-supabase.mjs");
const verifierPath = join(HERE, "verify-phase-1-supabase.mjs");
check(existsSync(importerPath), "importer script exists", "importer script missing");
if (existsSync(importerPath)) {
  const importer = readFileSync(importerPath, "utf8");
  check(
    /--apply/.test(importer) && /DRY RUN/i.test(importer),
    "importer defaults to dry-run and gates writes behind --apply",
    "importer must default to dry-run and require --apply to write"
  );
  // reads the service role only from the environment, never a literal
  check(
    /process\.env\.SUPABASE_SERVICE_ROLE_KEY/.test(importer),
    "importer reads service role key from environment",
    "importer must read SUPABASE_SERVICE_ROLE_KEY from process.env"
  );
  check(
    !containsHardCodedSecret(importer),
    "importer has no hard-coded secret",
    "importer appears to contain a hard-coded key/token/JWT"
  );
}

// ---- 8. no destructive remote reset scripts in package.json ---------------
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const scriptText = JSON.stringify(pkg.scripts || {});
check(
  !/db reset --linked/i.test(scriptText) && !/reset\s+--linked/i.test(scriptText),
  "no 'supabase db reset --linked' script",
  "package.json must not contain a remote reset script"
);
check(
  !!(pkg.scripts && pkg.scripts["db:schema:validate"] && pkg.scripts["db:seed:dry-run"] && pkg.scripts["db:seed:apply"] && pkg.scripts["db:verify"]),
  "db:* scripts registered",
  "package.json is missing one of db:schema:validate, db:seed:dry-run, db:seed:apply, db:verify"
);
check(
  !!(pkg.scripts && /--apply/.test(pkg.scripts["db:seed:apply"] || "")),
  "db:seed:apply includes the explicit --apply flag",
  "db:seed:apply must include --apply"
);
check(
  !!(pkg.scripts && !/--apply/.test(pkg.scripts["db:seed:dry-run"] || "")),
  "db:seed:dry-run performs no write (no --apply)",
  "db:seed:dry-run must not include --apply"
);

// ---- 9. production-safety guards (executable behavior, not just comments) --
// 9a. The default apply preserves conflicts (bootstrap-safe): the importer must
// use resolveUpsertOptions and must NOT hard-code ignoreDuplicates:false as the
// default write path.
if (existsSync(importerPath)) {
  const importer = readFileSync(importerPath, "utf8");
  check(
    /resolveUpsertOptions\s*\(/.test(importer),
    "importer resolves upsert options via bootstrap-safe helper",
    "importer must derive upsert options from resolveUpsertOptions (preserve-by-default)"
  );
  // overwrite must be opt-in via an explicit flag
  check(
    /--overwrite-existing/.test(importer),
    "importer overwrite mode requires explicit --overwrite-existing flag",
    "importer must gate overwrite behind --overwrite-existing"
  );
  // strict exact-count checking must be opt-in, not the default
  check(
    /--strict-seed-counts/.test(importer),
    "importer strict exact-count check is opt-in (--strict-seed-counts)",
    "importer must not require remote count === seed count by default"
  );
  // no destructive delete-synchronization of remote rows
  check(
    !/\.delete\(/.test(importer),
    "importer performs no delete synchronization",
    "importer must never delete remote rows"
  );
}

// 9b. resolveUpsertOptions default really preserves (ignoreDuplicates:true).
const sharedPath = join(HERE, "phase-1-shared.mjs");
check(existsSync(sharedPath), "shared seed module exists", "scripts/phase-1-shared.mjs missing");
if (existsSync(sharedPath)) {
  try {
    const { resolveUpsertOptions, evaluateCounts } = await import("./phase-1-shared.mjs");
    const dflt = resolveUpsertOptions({});
    check(
      dflt.ignoreDuplicates === true,
      "default apply preserves existing rows (ignoreDuplicates=true)",
      "default resolveUpsertOptions must set ignoreDuplicates=true"
    );
    const overwrite = resolveUpsertOptions({ overwriteExisting: true });
    check(
      overwrite.ignoreDuplicates === false,
      "overwrite mode replaces rows only when explicitly requested",
      "resolveUpsertOptions({overwriteExisting:true}) must set ignoreDuplicates=false"
    );
    // default count rule allows extra dashboard rows (>= baseline)
    const c = evaluateCounts({ remoteCount: 100, seedBaseline: 44 });
    check(c.ok === true, "extra remote rows do not fail normal verification", "evaluateCounts default must allow remoteCount > baseline");
    const strict = evaluateCounts({ remoteCount: 100, seedBaseline: 44, strict: true });
    check(strict.ok === false, "strict count mode requires exact baseline", "evaluateCounts strict must require equality");
  } catch (err) {
    check(false, "", `could not import shared helpers: ${err.message}`);
  }
}

// 9c. The default verifier is read-only: no .update()/.delete() outside the
// gated write-probe, no ungated writes, and db:verify carries no write flag.
if (existsSync(verifierPath)) {
  const verifier = readFileSync(verifierPath, "utf8");
  check(
    !/\.update\(/.test(verifier),
    "verifier contains no .update() calls",
    "verifier must not update any row"
  );
  const insertCalls = (verifier.match(/\.insert\(/g) || []).length;
  const deleteCalls = (verifier.match(/\.delete\(/g) || []).length;
  const gated = /ALLOW_WRITE_PROBES/.test(verifier) && /--allow-write-probes/.test(verifier);
  check(
    insertCalls <= 1 && deleteCalls <= 1 && gated,
    "any verifier write is gated behind --allow-write-probes (form_enquiries only)",
    "verifier writes must be single, gated, and synthetic"
  );
  check(
    /CI\s*===\s*"true"|process\.env\.CI/.test(verifier),
    "verifier refuses write probes in CI",
    "verifier must not run write probes under CI"
  );
  check(
    !/--allow-write-probes/.test(pkg.scripts["db:verify"] || ""),
    "db:verify is read-only (no --allow-write-probes)",
    "db:verify must not enable write probes"
  );
  // verifier must not target a real product with a write
  check(
    !/prod_[a-z_]*[\s\S]{0,40}\.(update|delete)\(/.test(verifier) &&
      !/\.(update|delete)\([\s\S]{0,120}prod_/.test(verifier),
    "verifier never writes to a real seeded product",
    "verifier must not update/delete a product row"
  );
}

// ---- 10. Production Patch 03 — Auth/RBAC structural guards -----------------
// dashboard_members membership table + RLS
check(/create table (public\.)?dashboard_members\b/i.test(sql), "dashboard_members table created", "missing dashboard_members table");
check(/alter table\s+(public\.)?dashboard_members\s+enable row level security/i.test(sql), "RLS enabled on dashboard_members", "dashboard_members RLS not enabled");
check(/references auth\.users\s*\(id\)/i.test(sql), "dashboard_members.user_id references auth.users(id)", "membership must reference auth.users(id)");
check(/role in \('owner',\s*'admin',\s*'editor'\)/i.test(sql), "dashboard_members role constrained to owner/admin/editor", "missing role CHECK");
check(/email = lower\(email\)/i.test(sql), "dashboard_members email stored lowercase (CHECK)", "missing lowercase email CHECK");

// SECURITY DEFINER helpers with a fixed search_path (each must be qualified)
for (const fn of ["current_dashboard_role", "is_dashboard_member", "is_dashboard_content_admin", "is_dashboard_owner", "protect_final_owner"]) {
  const defRe = new RegExp(`function (public\\.)?${fn}\\b[\\s\\S]*?security definer[\\s\\S]*?set search_path\\s*=\\s*''`, "i");
  check(defRe.test(sql), `${fn} is SECURITY DEFINER with fixed empty search_path`, `${fn} must be SECURITY DEFINER with set search_path = ''`);
}
// least-privilege EXECUTE: revoked from public, granted to authenticated
check(/revoke all on function[\s\S]*?current_dashboard_role[\s\S]*?from public/i.test(sql), "helper EXECUTE revoked from public", "must revoke EXECUTE on helpers from public");
check(/grant execute on function[\s\S]*?to authenticated/i.test(sql), "helper EXECUTE granted to authenticated", "must grant EXECUTE on helpers to authenticated");

// Final-owner protection trigger
check(/create trigger protect_final_owner\s+before update or delete on (public\.)?dashboard_members/i.test(sql), "final-owner protection trigger installed (BEFORE UPDATE OR DELETE)", "missing protect_final_owner trigger");
check(/final active dashboard owner/i.test(sql), "final-owner guard raises a clear exception", "missing final-owner exception message");
check(/for update\s*\n?\s*\)\s*locked_owners/i.test(sql) || /for update[\s\S]{0,40}\)\s*locked_owners/i.test(sql), "final-owner guard locks other owner rows (row lock, not aggregate+FOR UPDATE)", "final-owner guard must lock rows in a subquery");

// Per-action policies (no broad ALL); UPDATEs carry WITH CHECK. The 11 content
// tables get their dashboard policies from a DO loop over content_tables, so we
// assert the loop covers every table and that each of the 4 action templates is
// present with the correct predicate (policy names are generated via %I).
check(!/for all to (anon|authenticated)/i.test(sql), "no broad 'FOR ALL' policy is used", "must use per-action policies, not FOR ALL");
for (const t of CONTENT_TABLES) {
  check(new RegExp(`content_tables text\\[\\][\\s\\S]*?'${t}'`, "i").test(sql), `content_tables loop covers ${t}`, `dashboard policy loop must include ${t}`);
}
check(/for select to authenticated using \(public\.is_dashboard_member\(\)\)/i.test(sql), "content dashboard SELECT template (read-all for members)", "missing content dashboard SELECT template");
check(/for insert to authenticated with check \(public\.is_dashboard_member\(\)\)/i.test(sql), "content dashboard INSERT template", "missing content dashboard INSERT template");
check(/for update to authenticated using \(public\.is_dashboard_member\(\)\) with check \(public\.is_dashboard_member\(\)\)/i.test(sql), "content dashboard UPDATE template (USING + WITH CHECK)", "missing content dashboard UPDATE template");
check(/for delete to authenticated using \(public\.is_dashboard_content_admin\(\)\)/i.test(sql), "content dashboard DELETE template (owner/admin only)", "missing content dashboard DELETE template");
// every UPDATE policy statement has BOTH using and with check. Split on ';'
// (these policy statements contain no inner semicolons) and inspect each.
{
  const updateStmts = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => /for update to authenticated/i.test(s));
  const allHaveBoth = updateStmts.length >= 3 && updateStmts.every(
    (s) => /\busing\s*\(/i.test(s) && /\bwith check\s*\(/i.test(s)
  );
  check(allHaveBoth, "every UPDATE policy has both USING and WITH CHECK", "every UPDATE policy must have USING and WITH CHECK");
}
// content DELETE is owner/admin only (editors excluded)
check(/for delete to authenticated\s+using\s*\(public\.is_dashboard_content_admin\(\)\)/i.test(sql), "content DELETE restricted to owner/admin (is_dashboard_content_admin)", "content DELETE must use is_dashboard_content_admin()");

// form_enquiries: workflow columns present
for (const col of ["internal_notes", "assigned_to", "handled_at", "handled_by"]) {
  check(new RegExp(`add column ${col}\\b`, "i").test(sql), `form_enquiries adds workflow column ${col}`, `missing form_enquiries.${col}`);
}
// The authenticated UPDATE grant is workflow-ONLY and EXCLUDES audit fields, so
// handled_by/handled_at cannot be forged by a dashboard client.
check(/grant update \(status,\s*internal_notes,\s*assigned_to\)\s*on (public\.)?form_enquiries to authenticated/i.test(sql),
  "form_enquiries UPDATE grant is workflow-only (excludes audit fields)", "form_enquiries update grant must be scoped to status/internal_notes/assigned_to");
check(!/grant update \([^)]*handled_(by|at)[^)]*\)\s*on (public\.)?form_enquiries to authenticated/i.test(sql),
  "handled_by/handled_at excluded from the authenticated grant", "audit fields must not be directly updatable by dashboard clients");
check(/create trigger stamp_enquiry_handler\s+before update on (public\.)?form_enquiries/i.test(sql) &&
  /function (public\.)?stamp_enquiry_handler[\s\S]*?security definer[\s\S]*?set search_path\s*=\s*''[\s\S]*?new\.handled_by\s*:=[\s\S]*?new\.handled_at\s*:=\s*now\(\)/i.test(sql),
  "audit fields stamped by the DB from auth.uid() (stamp_enquiry_handler)", "must stamp handled_by/handled_at from auth.uid() in a definer trigger");
check(/check \(\(handled_by is null\) = \(handled_at is null\)\)/i.test(sql),
  "handled_by/handled_at consistency constraint present", "must constrain handled_by/handled_at to both-null-or-both-set");
check(!/for delete to authenticated[^;]*form_enquiries/i.test(sql) && !/create policy form_enquiries_dashboard_delete/i.test(sql), "no DELETE policy for form_enquiries", "form_enquiries must have no delete policy in P03");

// F2: inactive members cannot read their own membership row
check(/dashboard_members_self_read[\s\S]*?using \(user_id = auth\.uid\(\) and is_active\)/i.test(sql),
  "self-read membership policy requires is_active", "self-read policy must require user_id = auth.uid() AND is_active");

// membership writes are owner-only (privilege-escalation guard)
for (const action of ["insert", "update", "delete"]) {
  check(new RegExp(`create policy dashboard_members_owner_${action}\\b`, "i").test(sql), `dashboard_members ${action} is owner-only`, `dashboard_members ${action} must be owner-only`);
}

// ---- 10b. Production Patch 04 — durable single-use nonce -------------------
check(/create table (public\.)?dashboard_auth_flow_nonces\b/i.test(sql), "dashboard_auth_flow_nonces table created", "missing dashboard_auth_flow_nonces table");
check(/alter table\s+(public\.)?dashboard_auth_flow_nonces\s+enable row level security/i.test(sql), "RLS enabled on the nonce table", "nonce table RLS not enabled");
check(!/create policy[^;]*\bon\s+(public\.)?dashboard_auth_flow_nonces\b/i.test(sql), "nonce table has NO policy (RPC-only access; no anon/authenticated direct access)", "nonce table must have no RLS policy");
check(/nonce_hash\s+text\s+primary key/i.test(sql) && /nonce_hash ~ '\^\[0-9a-f\]\{64\}\$'/i.test(sql), "nonce stored as a 64-hex SHA-256 digest (no raw nonce/token column)", "nonce must be stored only as a hex hash");
check(/purpose in \('recovery',\s*'invite'\)/i.test(sql), "nonce purpose constrained to recovery/invite", "nonce purpose CHECK missing");
for (const fn of ["register_dashboard_flow_nonce", "consume_dashboard_flow_nonce"]) {
  check(new RegExp(`function (public\\.)?${fn}\\b[\\s\\S]*?security definer[\\s\\S]*?set search_path\\s*=\\s*''`, "i").test(sql), `${fn} is SECURITY DEFINER with fixed empty search_path`, `${fn} must be SECURITY DEFINER with set search_path = ''`);
}
check(/revoke all on function[\s\S]*?register_dashboard_flow_nonce[\s\S]*?from public/i.test(sql), "nonce RPC EXECUTE revoked from public", "must revoke nonce RPC EXECUTE from public");
check(/grant execute on function[\s\S]*?dashboard_flow_nonce[\s\S]*?to authenticated/i.test(sql), "nonce RPC EXECUTE granted to authenticated only", "must grant nonce RPC EXECUTE to authenticated");
// atomic consume: single UPDATE guarded by consumed_at IS NULL
check(/update (public\.)?dashboard_auth_flow_nonces[\s\S]*?consumed_at is null[\s\S]*?returning true/i.test(sql), "consume is a single atomic UPDATE guarded by consumed_at IS NULL", "consume must atomically update where consumed_at is null");
// register hardening: bounded expiry (reject past AND beyond the TTL + skew window)
check(/p_expires_at\s*<=\s*now\(\)\s*or\s*p_expires_at\s*>\s*now\(\)\s*\+\s*interval '1[0-9] minutes'/i.test(sql),
  "register bounds expiry to now()..now()+~TTL (rejects far-future nonces)", "register must reject expiries beyond the gate TTL + small skew");
// register is insert-only: true ONLY when a NEW row is inserted (conflict → false)
check(/insert into (public\.)?dashboard_auth_flow_nonces[\s\S]*?on conflict \(nonce_hash\) do nothing[\s\S]*?returning true into (inserted|[a-z_]+)[\s\S]*?return coalesce\(\1?[a-z_]*,\s*false\)/i.test(sql) ||
  /on conflict \(nonce_hash\) do nothing\s*\n?\s*returning true into inserted;[\s\S]*?return coalesce\(inserted,\s*false\)/i.test(sql),
  "register returns true only when a new row is inserted (ON CONFLICT DO NOTHING RETURNING)", "register must use INSERT ... ON CONFLICT DO NOTHING RETURNING and return false on conflict");

// ---- 11. P03 scripts: bootstrap dry-run default, apply gating, no secrets ---
const bootstrapPath = join(HERE, "bootstrap-dashboard-members.mjs");
check(existsSync(bootstrapPath), "membership bootstrap script exists", "missing bootstrap-dashboard-members.mjs");
if (existsSync(bootstrapPath)) {
  const boot = readFileSync(bootstrapPath, "utf8");
  check(/--apply/.test(boot) && /DRY RUN/i.test(boot), "bootstrap defaults to dry-run (read-only)", "bootstrap must default to dry-run");
  check(/Refusing --apply in CI/i.test(boot) && /process\.env\.CI/.test(boot), "bootstrap refuses --apply in CI", "bootstrap must refuse apply in CI");
  // Service role is read via the shared resolver's resolveLiveEnv().
  const resolverPath = join(HERE, "dashboard-auth-resolver.mjs");
  const resolverSrc = existsSync(resolverPath) ? readFileSync(resolverPath, "utf8") : "";
  check(/resolveLiveEnv\(\)/.test(boot) && /process\.env\.SUPABASE_SERVICE_ROLE_KEY/.test(resolverSrc), "bootstrap reads service role from env (via shared resolver)", "bootstrap must read service role from env");
  check(!/auth\.admin\.createUser|inviteUserByEmail|admin\.invite/i.test(boot) && !/createUser|inviteUserByEmail/i.test(resolverSrc), "bootstrap never creates or invites auth users", "bootstrap must not create/invite users");
  check(/\.upsert\(rows,/.test(boot) && !/for \(const m of resolved\)[\s\S]*?\.upsert\(/.test(boot), "bootstrap writes memberships in one atomic bulk upsert", "bootstrap must not use a per-user write loop");
  check(!containsHardCodedSecret(boot) && !containsHardCodedSecret(resolverSrc), "bootstrap/resolver have no hard-coded secret", "bootstrap contains a hard-coded secret");
  // verifier resolves Auth identity (not just membership rows)
  const verifierMembersPath = join(HERE, "verify-dashboard-members.mjs");
  const vsrc = existsSync(verifierMembersPath) ? readFileSync(verifierMembersPath, "utf8") : "";
  check(/resolveAuthUsers/.test(vsrc) && /row\.user_id === authUserId/.test(vsrc), "membership verifier checks user_id against resolved Auth id", "verifier must verify Auth identity, not only membership rows");
}
// config carries the three confirmed members, no secrets
const configPath = join(HERE, "dashboard-members.config.mjs");
if (existsSync(configPath)) {
  const cfg = readFileSync(configPath, "utf8");
  for (const email of ["marketing@halsabake.com", "gm@elshohail.com", "osama@halsabake.com"]) {
    check(cfg.includes(email), `config includes ${email}`, `config missing ${email}`);
  }
  check(!containsHardCodedSecret(cfg), "members config has no hard-coded secret", "config contains a secret");
}

// ---- 12. TS auth utilities are server-only (no service role in client) -----
const authDashPath = join(ROOT, "lib", "auth", "dashboard.ts");
check(existsSync(authDashPath), "lib/auth/dashboard.ts exists", "missing lib/auth/dashboard.ts");
if (existsSync(authDashPath)) {
  const authSrc = readFileSync(authDashPath, "utf8");
  check(/typeof window !== "undefined"/.test(authSrc), "dashboard auth module has a server-only guard", "auth module must guard against client import");
  check(!/SERVICE_ROLE/i.test(authSrc), "dashboard auth module never references the service-role key", "auth module must not use the service-role key");
  check(/getCurrentDashboardMember/.test(authSrc) && /requireDashboardRole/.test(authSrc), "auth module exports getCurrentDashboardMember + requireDashboardRole", "auth utilities missing");
}

// package scripts for P03
check(!!(pkg.scripts && pkg.scripts["db:members:bootstrap"] && pkg.scripts["db:members:verify"] && pkg.scripts["db:test:rbac"]),
  "P03 db:members:* and db:test:rbac scripts registered", "missing P03 package scripts");
check(!!(pkg.scripts && /--apply/.test(pkg.scripts["db:members:bootstrap:apply"] || "") && !/--apply/.test(pkg.scripts["db:members:bootstrap"] || "")),
  "db:members:bootstrap is dry-run; :apply carries --apply", "membership bootstrap script gating incorrect");

// Heuristic secret scan: long base64-ish blobs or JWT-shaped strings assigned
// to a literal. Placeholders/env reads are fine.
function containsHardCodedSecret(text) {
  if (/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./.test(text)) return true; // JWT
  if (/sb[a-z]*_[A-Za-z0-9]{20,}/.test(text)) return true; // supabase key-ish
  return false;
}

// ---- report ---------------------------------------------------------------
console.log("Static schema-structure validation");
console.log("-".repeat(60));
for (const p of passes) console.log(`  ✓ ${p}`);
if (errors.length) {
  console.log("");
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\n✖ ${errors.length} structural problem(s) found.`);
  process.exit(1);
}
console.log(`\n✓ All ${passes.length} structural checks passed.`);
