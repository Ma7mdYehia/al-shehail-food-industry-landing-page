#!/usr/bin/env node
// Generates normalized static seed JSON files (data/seed/phase-1/) from the
// current TypeScript content modules under lib/. See
// docs/static-seed-export-phase-1b.md for the full explanation.
//
// This script is NEVER imported by, or run as part of, the website itself
// (no page, component, or build step references it or its output). It only
// runs when invoked directly: `node scripts/export-phase-1-seed.mjs` (or
// `npm run seed:export`).
//
// No new dependencies: uses only Node.js builtins and the `typescript`
// package, which is already a devDependency of this project.

import path from "node:path";
import {
  repoRoot,
  installTsRequireHooks,
  requireTs,
  idFor,
  slugToSnake,
  camelToSnake,
  writeJson,
} from "./seed-lib.mjs";

installTsRequireHooks();

const lib = (p) => path.join(repoRoot, "lib", p);

const catalog = requireTs(lib("products/catalog.ts"));
const details = requireTs(lib("products/details.ts"));
const servicesMod = requireTs(lib("services.ts"));
const contentMod = requireTs(lib("content.ts"));
const partnerProjectsMod = requireTs(lib("partnerProjects.ts"));
const assetsMod = requireTs(lib("assets.ts"));

const outDir = path.join(repoRoot, "data", "seed", "phase-1");
const warnings = [];

// Asset keys with no current data reference at all (kept only for backward
// compatibility) — mirrors the `// LEGACY` comments already in lib/assets.ts.
// This is a maintained list, not parsed from comments; keep it in sync if
// those LEGACY markers in lib/assets.ts ever change.
const LEGACY_ASSET_KEYS = new Set(["alTaj", "breadWraps"]);

// ── media_assets.json ────────────────────────────────────────────────────
// Manifest section order matches lib/assets.ts's AssetManifest type exactly.
const ASSET_SECTIONS = [
  "brand",
  "partners",
  "products",
  "factory",
  "certifications",
  "retail",
  "og",
];

// Singular form used only for ID readability (e.g. media_product_arabic_bread,
// not media_products_arabic_bread) — the `type` field below still uses the
// literal manifest section name (plural where the manifest key is plural).
const SECTION_ID_LABEL = {
  brand: "brand",
  partners: "partner",
  products: "product",
  factory: "factory",
  certifications: "certification",
  retail: "retail",
  og: "og",
};

const mediaAssets = [];
const mediaIdByKey = new Map(); // key -> id, for cross-referencing below

for (const section of ASSET_SECTIONS) {
  const sectionData = assetsMod.assets[section];
  for (const [key, value] of Object.entries(sectionData)) {
    const id = `media_${SECTION_ID_LABEL[section]}_${camelToSnake(key)}`;
    mediaIdByKey.set(key, id);
    const path_ = typeof value === "string" ? value : null;
    const status = path_ ? "active" : LEGACY_ASSET_KEYS.has(key) ? "legacy" : "pending";
    mediaAssets.push({
      id,
      key,
      path: path_,
      // English alt text is migrated as-is. Arabic alt text does not exist
      // in lib/assets.ts today (altTexts is English-only) — left null
      // rather than guessed/duplicated; see warnings below.
      alt_localized: { en: assetsMod.getAssetAlt(key), ar: null },
      type: section,
      status,
      width: null,
      height: null,
    });
  }
}
warnings.push(
  "media_assets.alt_localized.ar is null for every row: lib/assets.ts's altTexts map is English-only today. Arabic alt text must be authored (not machine-translated blindly) before this field is used for anything user-facing."
);
warnings.push(
  "media_assets.status for null-path entries is derived from a maintained LEGACY_ASSET_KEYS list in scripts/export-phase-1-seed.mjs mirroring the `// LEGACY` comments in lib/assets.ts, not parsed from the comments automatically. Keep the two in sync manually."
);

writeJson(path.join(outDir, "media_assets.json"), mediaAssets);

// ── product_categories.json ──────────────────────────────────────────────

const productCategories = catalog.productCategories.map((cat, index) => ({
  id: idFor("cat", cat.slug),
  slug: cat.slug,
  name_localized: cat.name,
  description_localized: cat.description,
  sort_order: index,
  is_active: true,
}));
writeJson(path.join(outDir, "product_categories.json"), productCategories);

const categoryIdBySlug = new Map(productCategories.map((c) => [c.slug, c.id]));

// ── products.json ─────────────────────────────────────────────────────────

const products = catalog.products.map((p, index) => {
  const assetKey = assetsMod.productAssetKeyBySlug[p.slug];
  const imageAssetId = assetKey ? mediaIdByKey.get(assetKey) ?? null : null;
  return {
    id: idFor("prod", p.slug),
    category_id: categoryIdBySlug.get(p.categorySlug) ?? null,
    slug: p.slug,
    name_localized: p.name,
    short_description_localized: p.shortDescription,
    card_description_localized: p.cardDescription,
    image_asset_id: imageAssetId,
    icon_type: p.iconType,
    featured: Boolean(p.featured),
    sort_order: index,
    is_active: true,
  };
});
writeJson(path.join(outDir, "products.json"), products);

const productIdBySlug = new Map(products.map((p) => [p.slug, p.id]));
for (const p of catalog.products) {
  if (!categoryIdBySlug.has(p.categorySlug)) {
    warnings.push(`Product "${p.slug}" references unknown category slug "${p.categorySlug}".`);
  }
}

// ── product_options.json ─────────────────────────────────────────────────
// use_case / private_label_option / variant come from lib/products/catalog.ts;
// recipe_option comes from lib/products/details.ts (per this task's spec).
// detail_use_cases is NOT duplicated here — it stays solely in
// product_details.json's detail_use_cases_localized array.

const productOptions = [];

for (const p of catalog.products) {
  const productId = productIdBySlug.get(p.slug);
  const pushOptions = (type, items) => {
    (items ?? []).forEach((label, idx) => {
      productOptions.push({
        id: `opt_${slugToSnake(p.slug)}_${type}_${idx}`,
        product_id: productId,
        type,
        label_localized: label,
        sort_order: idx,
        is_active: true,
      });
    });
  };
  pushOptions("use_case", p.useCases);
  pushOptions("private_label_option", p.privateLabelOptions);
  if (p.variants) pushOptions("variant", p.variants);

  const detail = details.productDetails[p.slug];
  if (detail) pushOptions("recipe_option", detail.recipeOptions);
}
writeJson(path.join(outDir, "product_options.json"), productOptions);

// ── product_details.json ─────────────────────────────────────────────────
// disclaimer_localized is null for every row: the recipe disclaimer is
// identical across all products (see shared_content.json), not per-product
// content — duplicating it into every row would contradict the "don't
// duplicate generic shared content" guidance in docs/database-schema-phase-1.md.

const productDetails = Object.entries(details.productDetails).map(([slug, d]) => ({
  id: idFor("detail", slug),
  product_id: productIdBySlug.get(slug) ?? null,
  positioning_localized: d.positioning,
  overview_localized: d.overview,
  detail_use_cases_localized: d.detailUseCases,
  recipe_options_localized: d.recipeOptions,
  disclaimer_localized: null,
  is_active: true,
}));
writeJson(path.join(outDir, "product_details.json"), productDetails);
warnings.push(
  "product_details.disclaimer_localized is null for every product — the shared recipe disclaimer lives once in shared_content.json (recipe_disclaimer_localized) instead of being duplicated per row."
);

for (const [slug] of Object.entries(details.productDetails)) {
  if (!productIdBySlug.has(slug)) {
    warnings.push(`product_details entry "${slug}" has no matching product in products.json.`);
  }
}

// ── shared_content.json (extra file, not part of the 11 requested — holds
// generic content that is identical across every product, per the "avoid
// duplicating generic shared content" instruction in this task). ─────────

const sharedContent = {
  recipe_disclaimer_localized: details.recipeDisclaimer,
  private_label_points_localized: details.privateLabelPoints,
  packaging_options_localized: details.packagingOptions,
  quality_points_localized: details.qualityPoints,
};
writeJson(path.join(outDir, "shared_content.json"), sharedContent);

// ── services.json ────────────────────────────────────────────────────────

const serviceSlugs = Object.keys(servicesMod.services);
const services = serviceSlugs.map((slug, index) => {
  const s = servicesMod.services[slug];
  return {
    id: idFor("svc", slug),
    slug,
    meta_title_localized: s.metaTitle,
    meta_description_localized: s.metaDescription,
    hero_eyebrow_localized: s.heroEyebrow,
    hero_title_localized: s.heroTitle,
    hero_subtitle_localized: s.heroSubtitle,
    cta_json: {
      heroPrimary: s.heroPrimary,
      heroSecondary: s.heroSecondary,
      ctaPrimary: s.ctaPrimary,
      ctaSecondary: s.ctaSecondary,
    },
    sort_order: index,
    is_active: true,
  };
});
writeJson(path.join(outDir, "services.json"), services);

const serviceIdBySlug = new Map(services.map((s) => [s.slug, s.id]));

// ── service_sections.json ────────────────────────────────────────────────
// Mirrors the real section structure of lib/services.ts (intro, coverage,
// process, one of audience/deliverables/categories, related, note) — not a
// generic guess.

const serviceSections = [];

for (const slug of serviceSlugs) {
  const s = servicesMod.services[slug];
  const serviceId = serviceIdBySlug.get(slug);
  let order = 0;
  const addSection = (sectionType, titleLoc, eyebrowLoc, descLoc, items) => {
    serviceSections.push({
      id: `svcsec_${slugToSnake(slug)}_${sectionType}`,
      service_id: serviceId,
      section_type: sectionType,
      title_localized: titleLoc ?? null,
      eyebrow_localized: eyebrowLoc ?? null,
      description_localized: descLoc ?? null,
      items_json: items ?? [],
      sort_order: order++,
      is_active: true,
    });
  };

  addSection("intro", s.introTitle, s.introEyebrow, s.introDesc, []);
  addSection("coverage", s.coverageTitle, s.coverageEyebrow, s.coverageDesc, s.coverage);
  addSection("process", s.processTitle, s.processEyebrow, s.processDesc, s.process);
  if (s.audience) {
    addSection("audience", s.audience.title, s.audience.eyebrow, null, s.audience.items);
  }
  if (s.deliverables) {
    addSection(
      "deliverables",
      s.deliverables.title,
      s.deliverables.eyebrow,
      s.deliverables.desc,
      s.deliverables.items
    );
  }
  if (s.categories) {
    addSection("categories", s.categories.title, s.categories.eyebrow, null, s.categories.items);
  }
  addSection("related", s.relatedTitle, s.relatedEyebrow, s.relatedDesc, s.related);
  addSection("note", s.noteLabel, null, s.noteText, []);
}
writeJson(path.join(outDir, "service_sections.json"), serviceSections);

// ── partners.json ─────────────────────────────────────────────────────────
// lib/content.ts's manufacturingPartners already carries a stable slug via
// `projectSlug` (which is also the slug lib/partnerProjects.ts uses) — reused
// directly as the partner's own slug rather than re-slugifying the name.

const partners = contentMod.manufacturingPartners.map((partner, index) => ({
  id: idFor("partner", partner.projectSlug),
  slug: partner.projectSlug,
  name: partner.name,
  asset_id: mediaIdByKey.get(partner.assetKey) ?? null,
  sort_order: index,
  is_active: true,
}));
writeJson(path.join(outDir, "partners.json"), partners);

const partnerIdBySlug = new Map(partners.map((p) => [p.slug, p.id]));
warnings.push(
  '"Al Taj" (lib/assets.ts partners.alTaj) is a reserved/legacy asset key with no corresponding entry in lib/content.ts\'s manufacturingPartners — not seeded as a partner row.'
);

// ── partner_projects.json ────────────────────────────────────────────────

const partnerProjects = partnerProjectsMod.partnerProjects.map((project, index) => ({
  id: idFor("proj", project.slug),
  partner_id: partnerIdBySlug.get(project.slug) ?? null,
  slug: project.slug,
  // DERIVED — lib/partnerProjects.ts has no literal "title" field for a
  // project; this combines partnerName (plain text) with categoryLabel
  // (localized) per docs/database-schema-phase-1.md's recommendation.
  title_localized: {
    en: `${project.partnerName} — ${project.categoryLabel.en}`,
    ar: `${project.partnerName} — ${project.categoryLabel.ar}`,
  },
  summary_localized: project.positioning,
  project_detail_json: {
    categoryLabel: project.categoryLabel,
    overview: project.overview,
    productionFocus: project.productionFocus,
    ingredientStrategy: project.ingredientStrategy,
    processNotes: project.processNotes,
    nutritionFocus: project.nutritionFocus,
    complianceNotes: project.complianceNotes,
  },
  sort_order: index,
  is_active: true,
}));
writeJson(path.join(outDir, "partner_projects.json"), partnerProjects);
warnings.push(
  "partner_projects.title_localized is derived (partnerName + categoryLabel) at export time — no literal title field exists in lib/partnerProjects.ts source data."
);

for (const project of partnerProjectsMod.partnerProjects) {
  if (!partnerIdBySlug.has(project.slug)) {
    warnings.push(`partner_project "${project.slug}" has no matching partner in partners.json.`);
  }
}

const projectIdBySlug = new Map(partnerProjects.map((p) => [p.slug, p.id]));

// ── partner_project_products.json ────────────────────────────────────────
// product_id is set only on an exact slug match against the main catalog
// (products.json). Most partner-project product slugs (e.g.
// "healthy-flatbread", "samoon", "high-protein-bread") do not correspond to
// a main catalog product and are intentionally left null.

const partnerProjectProducts = [];

for (const project of partnerProjectsMod.partnerProjects) {
  const projectId = projectIdBySlug.get(project.slug);
  project.products.forEach((prod, index) => {
    const matchedProductId = productIdBySlug.get(prod.slug) ?? null;
    partnerProjectProducts.push({
      id: `ppp_${slugToSnake(project.slug)}_${slugToSnake(prod.slug)}`,
      partner_project_id: projectId,
      product_id: matchedProductId,
      product_name_localized: prod.name,
      sort_order: index,
    });
  });
}
writeJson(path.join(outDir, "partner_project_products.json"), partnerProjectProducts);
warnings.push(
  "partner_project_products.product_id is set only where a partner-project product's slug exactly matches a main catalog product slug (e.g. \"burger-buns\", \"maamoul\", \"tamriya\", \"toast\", \"mini-croissant\", \"pate\"); all other partner-project products (e.g. \"healthy-flatbread\", \"samoon\") are project-specific and have no catalog match, so product_id is null there by design, not by omission."
);
warnings.push(
  "partner_project_products.json intentionally includes only the 5 fields this task specified (id, partner_project_id, product_id, product_name_localized, sort_order). Richer per-project-product fields already exist in lib/partnerProjects.ts (category, shortDescription, keyNotes, nutritionHighlights, image, status, including NEEDS_VERIFICATION placeholders) and are available for a future, richer migration — see docs/database-seed-map.md."
);

// ── seed-manifest.json ────────────────────────────────────────────────────

const recordCounts = {
  product_categories: productCategories.length,
  products: products.length,
  product_details: productDetails.length,
  product_options: productOptions.length,
  services: services.length,
  service_sections: serviceSections.length,
  partners: partners.length,
  partner_projects: partnerProjects.length,
  partner_project_products: partnerProjectProducts.length,
  media_assets: mediaAssets.length,
  shared_content: 1,
};

const manifest = {
  generated_at: "manual/static seed export",
  source_branch: "db/static-seed-export-phase-1b",
  source_modules: [
    "lib/products/catalog.ts",
    "lib/products/details.ts",
    "lib/products/shared.ts",
    "lib/products/types.ts",
    "lib/services.ts",
    "lib/content.ts",
    "lib/partnerProjects.ts",
    "lib/assets.ts",
  ],
  output_files: [
    "product_categories.json",
    "products.json",
    "product_details.json",
    "product_options.json",
    "services.json",
    "service_sections.json",
    "partners.json",
    "partner_projects.json",
    "partner_project_products.json",
    "media_assets.json",
    "shared_content.json",
    "seed-manifest.json",
  ],
  record_counts: recordCounts,
  warnings,
  static_export_note:
    "This site builds with output: \"export\" (next.config.mjs) — there is no server at request time. These seed files are a build-time artifact only; nothing in the running site reads them, and generating them does not change the static export in any way.",
  no_database_connection_note:
    "No database connection, driver, ORM, or CMS dependency was added by this export. These are plain JSON files on disk, produced by a standalone Node.js script that is never imported by app/, components/, or lib/.",
};
writeJson(path.join(outDir, "seed-manifest.json"), manifest);

console.log("Phase 1 seed export complete:");
for (const [file, count] of Object.entries(recordCounts)) {
  console.log(`  ${file}: ${count} record(s)`);
}
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s) recorded in seed-manifest.json:`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}
