# Database seed map — Phase 1

Maps each current source-of-truth file to the future database tables it
would seed, per the schema in `docs/database-schema-phase-1.md`. This is a
planning document — no seed script exists yet, and nothing here is wired
into the running site. See `docs/examples/phase-1-seed-shape.ts` for a
docs-only sketch of what a normalized seed object could look like (not
imported anywhere).

| Source file | Exports used | Seeds table(s) |
|---|---|---|
| `lib/products/catalog.ts` | `productCategories` | `product_categories` |
| `lib/products/catalog.ts` | `products` | `products`, plus `product_options` for each product's `useCases`, `privateLabelOptions`, `variants` |
| `lib/products/shared.ts` | `CAT_*`, `wrapsSandwiches`, `healthyBakery`, `grabAndGo`, `wrapOptions`, `wrapDetailUseCases`, `wrapRecipeOptions`, `wrapOverview()` | not a table itself — these are the *shared fragments* referenced by many `products`/`productDetails` entries today (e.g. 7 of the 17 products reuse the same `wrapOptions` triplet). A seed script should de-duplicate these into single `product_options` rows reused across products via `product_id` joins, rather than inserting the same `{en, ar}` text 7 times — this is exactly the kind of duplication a normalized table is meant to remove |
| `lib/products/details.ts` | `productDetails` | `product_details` (`positioning`, `overview`, `detailUseCases`, `recipeOptions` per product) |
| `lib/products/details.ts` | `recipeDisclaimer`, `privateLabelPoints`, `packagingOptions`, `qualityPoints` | **not seeded per-product** — these are shared, identical-across-all-products content. Per the design decision in `docs/database-schema-phase-1.md`, keep these as static config (or a single shared config row) rather than duplicating them into every product's `product_options`/`product_details` row |
| `lib/products/details.ts` | `whatsappForProduct()` | not a data table — this is a runtime template function (builds a `wa.me` link per locale); stays as application code regardless of where product data lives |
| `lib/services.ts` | `services` (top-level fields: `slug`, `metaTitle`, `metaDescription`, `heroEyebrow`, `heroTitle`, `heroSubtitle`, `heroPrimary`, `heroSecondary`, `ctaPrimary`, `ctaSecondary`) | `services` |
| `lib/services.ts` | `services[*].introEyebrow/introTitle/introDesc` | one `service_sections` row per service, `section_type = 'intro'` |
| `lib/services.ts` | `services[*].coverageEyebrow/coverageTitle/coverageDesc/coverage` | one `service_sections` row per service, `section_type = 'coverage'`, `items_json` = the `coverage: Feature[]` array |
| `lib/services.ts` | `services[*].processEyebrow/processTitle/processDesc/process` | one `service_sections` row per service, `section_type = 'process'`, `items_json` = the `process: Step[]` array |
| `lib/services.ts` | `services[*].audience` (distribution only) | one `service_sections` row, `section_type = 'audience'` |
| `lib/services.ts` | `services[*].deliverables` (brand-design, digital-marketing) | one `service_sections` row, `section_type = 'deliverables'` |
| `lib/services.ts` | `services[*].categories` (brand-design, digital-marketing) | one `service_sections` row, `section_type = 'categories'` |
| `lib/services.ts` | `services[*].relatedEyebrow/relatedTitle/relatedDesc/related` | one `service_sections` row per service, `section_type = 'related'`, `items_json` = the `related: Related[]` array |
| `lib/services.ts` | `services[*].noteLabel/noteText` | one `service_sections` row per service, `section_type = 'note'` |
| `lib/content.ts` | `manufacturingPartners` (`name`, `assetKey`, `projectSlug`) | `partners` — `assetKey` resolves to a `media_assets.id` via the `key` column; `projectSlug` becomes the join target for `partner_projects.partner_id` (via matching `partner_projects.slug`, then swapped for the real FK) |
| `lib/partnerProjects.ts` | `partnerProjects` (top-level fields per project) | `partner_projects` — `overview`, `productionFocus`, `ingredientStrategy`, `processNotes`, `nutritionFocus`, `complianceNotes` bundle into `project_detail_json`; `category`/`categoryLabel` fold into the same JSON blob (see schema doc) |
| `lib/partnerProjects.ts` | `partnerProjects[*].products` (`PartnerProjectProduct[]`) | `partner_project_products` — one row per array entry, `product_id` left null unless a real match against `products.slug` is confirmed during migration (today's data doesn't cross-reference the main catalog) |
| `lib/partnerProjects.ts` | `NEEDS_VERIFICATION` placeholder convention | not a table — carries over as literal placeholder text inside the localized fields it already appears in (`key_notes_localized`, `nutrition_highlights_localized`, etc.); a seed script must **not** silently drop or resolve these, only migrate the placeholder text verbatim |
| `lib/assets.ts` | `assets` manifest (all sections: `brand`, `partners`, `products`, `factory`, `certifications`, `retail`, `og`) | `media_assets` — one row per manifest key, `key` = the object key (e.g. `arabicBread`), `path` = the value (or `NULL`), `status` = `active`/`pending`/`legacy` per the section comments already in the file |
| `lib/assets.ts` | `productAssetKeyBySlug` | not a separate table — becomes the join used to backfill `products.image_asset_id` from `media_assets.key` during the products seed, since today's mapping is slug→key, not slug→id |
| `lib/assets.ts` | `getAssetAlt()` / `altTexts` | seeds `media_assets.alt_localized.en`; **Arabic alt text does not exist in the current codebase** (`altTexts` is English-only) and must be authored fresh during migration, not auto-translated without review — flagged explicitly so this isn't missed |

## Seeding order (respects foreign keys)

1. `media_assets` (no dependencies)
2. `product_categories` (no dependencies)
3. `products` (depends on `product_categories`, `media_assets`)
4. `product_details` (depends on `products`)
5. `product_options` (depends on `products`)
6. `services` (no dependencies)
7. `service_sections` (depends on `services`)
8. `partners` (depends on `media_assets`)
9. `partner_projects` (depends on `partners`)
10. `partner_project_products` (depends on `partner_projects`, optionally `products`)

## What a seed script would need to do that a straight data dump wouldn't

- **De-duplicate shared fragments** (`lib/products/shared.ts`'s reused
  constants) into single rows referenced by multiple products, rather than
  copy-pasting the same bilingual text into every row that currently
  references the same TypeScript constant.
- **Resolve `assetKey`/`productAssetKeyBySlug` string lookups into real
  foreign keys** (`media_assets.id`), since today's code links by string key,
  not by ID.
- **Decide what to do with `partnerProjects[*].category`/`categoryLabel`**
  (fold into JSON vs. promote to a real lookup table) — flagged as a
  judgment call in the schema doc, not resolved here.
- **Author missing Arabic alt text** for `media_assets` — this is net-new
  content, not a mechanical migration, since `lib/assets.ts` today only has
  English alt text.
- **Leave `NEEDS_VERIFICATION` placeholders untouched** — the seed migrates
  placeholder text as-is; resolving them into real verified data is a
  separate content task, not part of any schema/seed migration.
