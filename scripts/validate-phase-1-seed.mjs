#!/usr/bin/env node
// Validates the generated Phase 1 seed files in data/seed/phase-1/.
// Plain Node.js, no dependencies (not even `typescript` — this only reads
// the already-generated JSON files, it doesn't touch lib/*.ts).
//
// Never imported by, or run as part of, the website. Run directly:
// `node scripts/validate-phase-1-seed.mjs` (or `npm run seed:validate`).

import path from "node:path";
import { repoRoot, readJson } from "./seed-lib.mjs";

const dir = path.join(repoRoot, "data", "seed", "phase-1");
const load = (file) => readJson(path.join(dir, file));

const productCategories = load("product_categories.json");
const products = load("products.json");
const productDetails = load("product_details.json");
const productOptions = load("product_options.json");
const services = load("services.json");
const serviceSections = load("service_sections.json");
const partners = load("partners.json");
const partnerProjects = load("partner_projects.json");
const partnerProjectProducts = load("partner_project_products.json");
const mediaAssets = load("media_assets.json");

const errors = [];
const note = (msg) => errors.push(msg);

// ── Duplicate ID checks (every file's `id` column must be unique within
// that file) ──────────────────────────────────────────────────────────────

function checkUniqueIds(fileLabel, rows) {
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.id)) note(`${fileLabel}: duplicate id "${row.id}"`);
    seen.add(row.id);
  }
}

checkUniqueIds("product_categories.json", productCategories);
checkUniqueIds("products.json", products);
checkUniqueIds("product_details.json", productDetails);
checkUniqueIds("product_options.json", productOptions);
checkUniqueIds("services.json", services);
checkUniqueIds("service_sections.json", serviceSections);
checkUniqueIds("partners.json", partners);
checkUniqueIds("partner_projects.json", partnerProjects);
checkUniqueIds("partner_project_products.json", partnerProjectProducts);
checkUniqueIds("media_assets.json", mediaAssets);

// ── Duplicate slug checks (slugs that should be unique per file) ────────

function checkUniqueField(fileLabel, rows, field) {
  const seen = new Set();
  for (const row of rows) {
    const value = row[field];
    if (value == null) continue;
    if (seen.has(value)) note(`${fileLabel}: duplicate ${field} "${value}"`);
    seen.add(value);
  }
}

checkUniqueField("product_categories.json", productCategories, "slug");
checkUniqueField("products.json", products, "slug");
checkUniqueField("services.json", services, "slug");
checkUniqueField("partners.json", partners, "slug");
checkUniqueField("partner_projects.json", partnerProjects, "slug");
checkUniqueField("media_assets.json", mediaAssets, "key");

// ── Foreign key checks ────────────────────────────────────────────────────

const categoryIds = new Set(productCategories.map((c) => c.id));
const productIds = new Set(products.map((p) => p.id));
const serviceIds = new Set(services.map((s) => s.id));
const partnerIds = new Set(partners.map((p) => p.id));
const partnerProjectIds = new Set(partnerProjects.map((p) => p.id));
const mediaAssetIds = new Set(mediaAssets.map((m) => m.id));

for (const p of products) {
  if (p.category_id != null && !categoryIds.has(p.category_id)) {
    note(`products.json: "${p.id}" references unknown category_id "${p.category_id}"`);
  }
  if (p.image_asset_id != null && !mediaAssetIds.has(p.image_asset_id)) {
    note(`products.json: "${p.id}" references unknown image_asset_id "${p.image_asset_id}"`);
  }
}

for (const d of productDetails) {
  if (d.product_id == null || !productIds.has(d.product_id)) {
    note(`product_details.json: "${d.id}" references unknown product_id "${d.product_id}"`);
  }
}

for (const o of productOptions) {
  if (o.product_id == null || !productIds.has(o.product_id)) {
    note(`product_options.json: "${o.id}" references unknown product_id "${o.product_id}"`);
  }
}

for (const s of serviceSections) {
  if (s.service_id == null || !serviceIds.has(s.service_id)) {
    note(`service_sections.json: "${s.id}" references unknown service_id "${s.service_id}"`);
  }
}

for (const proj of partnerProjects) {
  if (proj.partner_id == null || !partnerIds.has(proj.partner_id)) {
    note(`partner_projects.json: "${proj.id}" references unknown partner_id "${proj.partner_id}"`);
  }
}

for (const p of partners) {
  if (p.asset_id != null && !mediaAssetIds.has(p.asset_id)) {
    note(`partners.json: "${p.id}" references unknown asset_id "${p.asset_id}"`);
  }
}

for (const pp of partnerProjectProducts) {
  if (pp.partner_project_id == null || !partnerProjectIds.has(pp.partner_project_id)) {
    note(
      `partner_project_products.json: "${pp.id}" references unknown partner_project_id "${pp.partner_project_id}"`
    );
  }
  // product_id is allowed to be null by design (see seed-manifest.json warnings)
  if (pp.product_id != null && !productIds.has(pp.product_id)) {
    note(`partner_project_products.json: "${pp.id}" references unknown product_id "${pp.product_id}"`);
  }
}

// ── Localized-field shape check ──────────────────────────────────────────
// Recursively walks every value in every file. Any plain object that has an
// "en" key XOR an "ar" key (one present, the other missing) is a structural
// error — a localized field must carry both keys. A null *value* for either
// key (e.g. alt_localized.ar today) is allowed and NOT an error — only a
// missing *key* is flagged.

function walkForLocaleShape(value, fileLabel, pathStr) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkForLocaleShape(item, fileLabel, `${pathStr}[${i}]`));
    return;
  }
  if (value !== null && typeof value === "object") {
    const hasEn = Object.prototype.hasOwnProperty.call(value, "en");
    const hasAr = Object.prototype.hasOwnProperty.call(value, "ar");
    if (hasEn !== hasAr) {
      note(`${fileLabel}: ${pathStr} has only one of "en"/"ar" (asymmetric localized field)`);
    }
    for (const [k, v] of Object.entries(value)) {
      walkForLocaleShape(v, fileLabel, `${pathStr}.${k}`);
    }
  }
}

const allFiles = {
  "product_categories.json": productCategories,
  "products.json": products,
  "product_details.json": productDetails,
  "product_options.json": productOptions,
  "services.json": services,
  "service_sections.json": serviceSections,
  "partners.json": partners,
  "partner_projects.json": partnerProjects,
  "partner_project_products.json": partnerProjectProducts,
  "media_assets.json": mediaAssets,
};

for (const [fileLabel, rows] of Object.entries(allFiles)) {
  rows.forEach((row, i) => walkForLocaleShape(row, fileLabel, `[${i}]`));
}

// ── Report ────────────────────────────────────────────────────────────────

if (errors.length === 0) {
  console.log("Phase 1 seed validation passed — no errors found.");
  console.log(`Checked: ${Object.keys(allFiles).length} files, ${Object.values(allFiles).reduce((n, r) => n + r.length, 0)} total rows.`);
  process.exit(0);
} else {
  console.error(`Phase 1 seed validation FAILED — ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
