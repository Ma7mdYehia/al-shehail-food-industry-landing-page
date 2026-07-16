// Shared Phase 1 seed metadata and helpers for the Supabase import/verify
// tooling. This module is imported by:
//   - scripts/import-phase-1-to-supabase.mjs
//   - scripts/verify-phase-1-supabase.mjs
//
// It NEVER reads secrets and NEVER touches the network. It only describes the
// validated seed under data/seed/phase-1/ so the import/verify scripts can
// guard the data before and after any database operation.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
export const SEED_DIR = join(HERE, "..", "data", "seed", "phase-1");

// Import order is foreign-key-safe. form_enquiries is intentionally excluded —
// it is never seeded.
export const IMPORT_ORDER = [
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

// Per-table definitions. `conflictKey` is always the deterministic text id, so
// re-imports upsert in place (idempotent) rather than creating duplicates.
export const TABLE_DEFS = {
  media_assets: {
    file: "media_assets.json",
    conflictKey: "id",
    uniqueKeys: ["id", "key"],
    requiredLocalized: ["alt_localized"],
    enums: {
      type: ["brand", "partners", "products", "factory", "certifications", "retail", "og"],
      status: ["active", "pending", "legacy"],
    },
  },
  product_categories: {
    file: "product_categories.json",
    conflictKey: "id",
    uniqueKeys: ["id", "slug"],
    requiredLocalized: ["name_localized", "description_localized"],
  },
  products: {
    file: "products.json",
    conflictKey: "id",
    uniqueKeys: ["id", "slug"],
    requiredLocalized: ["name_localized", "short_description_localized", "card_description_localized"],
    enums: {
      icon_type: ["flatbread", "loaf", "samoon", "bun", "croissant", "croissantLarge", "puff", "maamoul", "date"],
    },
    foreignKeys: [
      { column: "category_id", refTable: "product_categories", nullable: false },
      { column: "image_asset_id", refTable: "media_assets", nullable: true },
    ],
  },
  product_details: {
    file: "product_details.json",
    conflictKey: "id",
    uniqueKeys: ["id", "product_id"],
    requiredLocalized: ["positioning_localized"],
    optionalLocalized: ["disclaimer_localized"],
    arrayColumns: ["overview_localized", "detail_use_cases_localized", "recipe_options_localized"],
    foreignKeys: [{ column: "product_id", refTable: "products", nullable: false }],
  },
  product_options: {
    file: "product_options.json",
    conflictKey: "id",
    uniqueKeys: ["id"],
    requiredLocalized: ["label_localized"],
    enums: { type: ["use_case", "private_label_option", "variant", "recipe_option"] },
    foreignKeys: [{ column: "product_id", refTable: "products", nullable: false }],
  },
  services: {
    file: "services.json",
    conflictKey: "id",
    uniqueKeys: ["id", "slug"],
    requiredLocalized: [
      "meta_title_localized",
      "meta_description_localized",
      "hero_eyebrow_localized",
      "hero_title_localized",
      "hero_subtitle_localized",
    ],
    objectColumns: ["cta_json"],
  },
  service_sections: {
    file: "service_sections.json",
    conflictKey: "id",
    uniqueKeys: ["id"],
    optionalLocalized: ["title_localized", "eyebrow_localized", "description_localized"],
    arrayColumns: ["items_json"],
    enums: {
      section_type: ["intro", "coverage", "process", "audience", "deliverables", "categories", "related", "note"],
    },
    foreignKeys: [{ column: "service_id", refTable: "services", nullable: false }],
  },
  partners: {
    file: "partners.json",
    conflictKey: "id",
    uniqueKeys: ["id", "slug"],
    foreignKeys: [{ column: "asset_id", refTable: "media_assets", nullable: true }],
  },
  partner_projects: {
    file: "partner_projects.json",
    conflictKey: "id",
    uniqueKeys: ["id", "slug"],
    requiredLocalized: ["title_localized", "summary_localized"],
    objectColumns: ["project_detail_json"],
    foreignKeys: [{ column: "partner_id", refTable: "partners", nullable: false }],
  },
  partner_project_products: {
    file: "partner_project_products.json",
    conflictKey: "id",
    uniqueKeys: ["id"],
    optionalLocalized: ["product_name_localized", "category_localized", "short_description_localized"],
    arrayColumns: ["key_notes_localized", "nutrition_highlights_localized"],
    enums: { status: ["active", "planned", "needs-data"] },
    foreignKeys: [
      { column: "partner_project_id", refTable: "partner_projects", nullable: false },
      { column: "product_id", refTable: "products", nullable: true },
      { column: "image_asset_id", refTable: "media_assets", nullable: true },
    ],
  },
  shared_content: {
    file: "shared_content.json",
    conflictKey: "id",
    uniqueKeys: ["id"],
    singleton: true,
    singletonId: "default",
    requiredLocalized: ["recipe_disclaimer_localized"],
    arrayColumns: [
      "private_label_points_localized",
      "packaging_options_localized",
      "quality_points_localized",
    ],
  },
};

export function isLocalized(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.prototype.hasOwnProperty.call(value, "en") &&
    Object.prototype.hasOwnProperty.call(value, "ar")
  );
}

// Load a seed file. The single-row shared_content file is normalized to an
// array of one row and given its deterministic id ('default'). Never mutates
// the on-disk JSON.
export function loadSeedRows(table) {
  const def = TABLE_DEFS[table];
  const raw = JSON.parse(readFileSync(join(SEED_DIR, def.file), "utf8"));
  if (def.singleton) {
    const row = Array.isArray(raw) ? raw[0] : raw;
    return [{ id: def.singletonId, ...row }];
  }
  return raw;
}

export function loadManifest() {
  return JSON.parse(readFileSync(join(SEED_DIR, "seed-manifest.json"), "utf8"));
}

// Pre-flight validation performed by the import/verify scripts themselves —
// deliberately independent of the DB. Returns { rowsByTable, expectedCounts }
// or throws with a clear, aggregated error. Guards against: duplicate ids,
// duplicate unique keys/slugs, missing localized en/ar keys, non-array/-object
// shaped columns, unknown enum values, and dangling foreign keys within the
// seed set.
export function preflightValidate() {
  const errors = [];
  const rowsByTable = {};
  const idsByTable = {};

  for (const table of IMPORT_ORDER) {
    const def = TABLE_DEFS[table];
    let rows;
    try {
      rows = loadSeedRows(table);
    } catch (err) {
      errors.push(`${table}: cannot read seed file (${err.message})`);
      continue;
    }
    rowsByTable[table] = rows;
    idsByTable[table] = new Set(rows.map((r) => r.id));

    // unique keys (including id)
    for (const key of def.uniqueKeys ?? ["id"]) {
      const seen = new Set();
      for (const row of rows) {
        const v = row[key];
        if (v === undefined || v === null) continue;
        if (seen.has(v)) errors.push(`${table}: duplicate ${key} "${v}"`);
        seen.add(v);
      }
    }

    for (const row of rows) {
      const id = row.id ?? "(no id)";
      for (const col of def.requiredLocalized ?? []) {
        if (!isLocalized(row[col])) {
          errors.push(`${table} ${id}: ${col} is missing required en/ar localized keys`);
        }
      }
      for (const col of def.optionalLocalized ?? []) {
        if (row[col] !== undefined && row[col] !== null && !isLocalized(row[col])) {
          errors.push(`${table} ${id}: ${col} present but missing en/ar keys`);
        }
      }
      for (const col of def.arrayColumns ?? []) {
        if (row[col] !== undefined && row[col] !== null && !Array.isArray(row[col])) {
          errors.push(`${table} ${id}: ${col} must be a JSON array`);
        }
      }
      for (const col of def.objectColumns ?? []) {
        const v = row[col];
        if (v === undefined || v === null || typeof v !== "object" || Array.isArray(v)) {
          errors.push(`${table} ${id}: ${col} must be a JSON object`);
        }
      }
      for (const [col, allowed] of Object.entries(def.enums ?? {})) {
        const v = row[col];
        if (v !== undefined && v !== null && !allowed.includes(v)) {
          errors.push(`${table} ${id}: unknown ${col} value "${v}"`);
        }
      }
    }
  }

  // foreign keys resolve within the seed set
  for (const table of IMPORT_ORDER) {
    const def = TABLE_DEFS[table];
    for (const fk of def.foreignKeys ?? []) {
      const target = idsByTable[fk.refTable];
      for (const row of rowsByTable[table] ?? []) {
        const v = row[fk.column];
        if (v === undefined || v === null) {
          if (!fk.nullable) {
            errors.push(`${table} ${row.id}: ${fk.column} is required but null`);
          }
          continue;
        }
        if (!target || !target.has(v)) {
          errors.push(
            `${table} ${row.id}: dangling foreign key ${fk.column}="${v}" -> ${fk.refTable}.id`
          );
        }
      }
    }
  }

  if (errors.length) {
    const err = new Error(`Seed pre-flight validation failed:\n  - ${errors.join("\n  - ")}`);
    err.preflightErrors = errors;
    throw err;
  }

  const expectedCounts = {};
  for (const table of IMPORT_ORDER) expectedCounts[table] = rowsByTable[table].length;
  return { rowsByTable, expectedCounts };
}

// Extract the host of a Supabase URL for display WITHOUT any credential.
export function hostOnly(url) {
  if (!url) return "(not configured)";
  try {
    return new URL(url).host;
  } catch {
    return "(invalid URL)";
  }
}

// ---------------------------------------------------------------------------
// Bootstrap-safe apply/verify logic (pure, DB-free, unit-testable)
// ---------------------------------------------------------------------------
// The Phase 1 seed is BOOTSTRAP data, not the permanent authority once the
// dashboard is in use. These helpers encode the safe semantics so both the
// importer and its tests share one source of truth.

// Resolve the Supabase upsert options for an apply run. The DEFAULT is
// conflict-preserving: insert genuinely missing rows, never overwrite an
// existing row, never delete. Overwrite is opt-in only.
export function resolveUpsertOptions({ overwriteExisting = false } = {}) {
  return {
    onConflict: "id",
    // ignoreDuplicates: true  => ON CONFLICT DO NOTHING (preserve existing rows)
    // ignoreDuplicates: false => ON CONFLICT DO UPDATE  (overwrite existing rows)
    ignoreDuplicates: !overwriteExisting,
  };
}

// Evaluate a remote row count against the seed baseline. By default a remote
// table may contain MORE rows than the seed (dashboard-created content), so the
// rule is "at least the baseline". Strict mode requires exact equality and is
// only meaningful for a fresh bootstrap.
export function evaluateCounts({ remoteCount, seedBaseline, strict = false }) {
  const extras = remoteCount - seedBaseline;
  const ok = strict ? remoteCount === seedBaseline : remoteCount >= seedBaseline;
  return { ok, extras, remoteCount, seedBaseline, strict };
}

// Which deterministic seed ids are missing from the remote id set.
export function findMissingSeedIds({ seedIds, remoteIds }) {
  const remote = new Set(remoteIds);
  return seedIds.filter((id) => !remote.has(id));
}

// Pure model of a Supabase upsert against an in-memory remote table, matching
// Postgres ON CONFLICT semantics for the two modes. Used by tests to prove
// preserve-by-default, overwrite-on-flag, insert-missing, and idempotency
// WITHOUT any database. Returns the resulting rows keyed by id (order-stable).
export function simulateApply({ remoteRows = [], seedRows = [], overwriteExisting = false } = {}) {
  const byId = new Map(remoteRows.map((r) => [r.id, { ...r }]));
  for (const row of seedRows) {
    if (byId.has(row.id)) {
      if (overwriteExisting) byId.set(row.id, { ...row }); // DO UPDATE
      // else: DO NOTHING — preserve the existing (possibly dashboard-edited) row
    } else {
      byId.set(row.id, { ...row }); // INSERT missing
    }
  }
  return [...byId.values()];
}
