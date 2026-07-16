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

// ---- 3. form_enquiries has NO policy (public or otherwise) -----------------
check(
  !/create policy[^;]*\bon\s+(public\.)?form_enquiries\b/i.test(sql),
  "form_enquiries has no RLS policy (deny-all for anon/authenticated)",
  "form_enquiries must NOT have any RLS policy in Patch 02"
);
// and it must not be granted to anon/authenticated
check(
  !/grant[^;]*\bon[^;]*form_enquiries[^;]*to[^;]*\b(anon|authenticated)\b/i.test(sql),
  "form_enquiries not granted to anon/authenticated",
  "form_enquiries must not be granted to anon/authenticated"
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
