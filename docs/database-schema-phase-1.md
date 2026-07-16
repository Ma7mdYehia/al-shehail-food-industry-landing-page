# Database schema — Phase 1

> **⚠️ Partially superseded (Production Patch 02).** The implemented schema now
> lives in `supabase/migrations/` and is documented in
> [`production-database-foundation-p02.md`](./production-database-foundation-p02.md).
> Two statements below are now factually obsolete: (1) seed-backed content tables
> use **`TEXT` primary keys** (preserving the deterministic seed ids), **not**
> the `UUID` primary keys proposed here — see the P02 doc's "Primary-key
> decision"; and (2) the schema is no longer only a plan. The original design
> reasoning is retained as historical context.

This document is a **planning artifact only**. It designs the Phase 1
database schema and seed architecture for Al Shehail Food Industries' content
(products, services, partners). Nothing in this document is connected to the
running site — see `docs/database-readiness-map.md` for the broader
table-by-table rationale and phasing this document narrows into concrete
column-level schemas for Phase 1.

**Nothing here changes runtime behavior.** The site still ships as a fully
static export (`output: "export"`), reading from the TypeScript modules under
`lib/`. This document describes what a *future* database would look like once
someone decides to build the write path and a runtime/serverless layer.

---

## Recommended database: PostgreSQL

**Recommendation: PostgreSQL.**

Why it fits this project specifically:

- **JSONB is a first-class column type**, not a bolted-on feature. This
  matters directly for the locale strategy below (JSONB localized fields) —
  Postgres can index into and query JSONB fields (`->>`, `@>`, GIN indexes)
  if a future need arises, whereas most alternatives either lack this or
  bolt it on awkwardly.
- **Relational integrity where it matters.** This content has real foreign
  keys (`products.category_id`, `product_details.product_id`,
  `partner_projects.partner_id`, `partner_project_products.product_id`) and
  benefits from real `FOREIGN KEY` constraints, cascade rules, and
  transactional writes — a document database would make these referential
  guarantees the application's problem instead of the database's.
- **Works with every realistic future architecture for this site.** Whether
  the eventual runtime is a Next.js server, a serverless function per route,
  or a separate headless CMS, Postgres is supported everywhere (managed
  Postgres on essentially every cloud provider, plus most "add a database to
  a static site" services default to it).
- **No vendor lock-in requirement.** The task explicitly rules out
  Supabase/Firebase/etc. as *dependencies* right now, but plain PostgreSQL
  keeps that door open later without betting the schema on a proprietary
  query layer — a plain Postgres schema can be adopted by Supabase (which is
  Postgres), a self-hosted instance, or any managed Postgres service without
  rework.
- **Enum types and check constraints** are a good fit for the small set of
  fixed vocabularies this content already has (`iconType`, `status`,
  `section_type`, `option_type`) — see individual table sections below.

Nothing about this content demands a NoSQL or graph database — it's a
handful of clearly-shaped, mostly-hierarchical content tables with two
languages per text field. Postgres is the boring, correct choice.

---

## Locale strategy

**Recommendation: JSONB localized fields, not separate translation rows —
at this stage.**

Pattern used throughout every table below:

```sql
name_localized JSONB NOT NULL
-- e.g. {"en": "Arabic Bread", "ar": "خبز عربي"}
```

A lightweight application-level check (or a Postgres `CHECK` constraint using
`jsonb_object_keys`) can enforce that every localized field contains exactly
the site's supported locales (`en`, `ar`) — mirroring `lib/i18n.ts`'s
`Locale`/`Localized` types today, which already model bilingual fields as
`{ en: T; ar: T }`. The DB shape is a direct, boring translation of a
TypeScript type the codebase already uses everywhere.

### Why JSONB localized fields over a translations table, for this project, now

- **This is a 2-locale site**, and adding a language is already a
  structural/code change (new route tree under `app/`, new fonts, new RTL
  handling) — not something content-only rows could drive. A `translations`
  table's main selling point (add a language without touching the schema)
  doesn't apply here.
- **One row = one concept, in both languages, always.** `SELECT * FROM
  products WHERE slug = 'arabic-bread'` returns the complete bilingual
  content in one row, matching how every component in this codebase already
  consumes it (`product.name[locale]`). A translations-table design would
  require a join (or two round trips) for something that is always needed
  together.
- **Every field is fully bilingual today — there's no partial-translation
  state to model.** The whole codebase currently guarantees both `en` and
  `ar` exist for every string (enforced by the `Localized` TypeScript type).
  A separate table only pays for itself once that guarantee stops holding.
- **Simpler migration from today's data.** The current `lib/products/*.ts`
  etc. already store `{ en, ar }` objects — a JSONB column is close to a
  1:1 dump of the existing TypeScript objects (see
  `docs/examples/phase-1-seed-shape.ts`). A translations table would require
  restructuring every object into rows first.

### When a translations table (or similar) becomes the better call

Revisit this decision if any of the following becomes true:

- **More than 2–3 languages.** JSONB blobs with many keys get harder to
  validate, index, and reason about; a normalized `(entity_id, locale,
  field, value)` or per-locale-row model scales better past a handful of
  languages.
- **An editorial workflow appears** — e.g. drafts, scheduled publish,
  reviewer sign-off per language. That needs per-translation status/timestamp
  metadata that doesn't fit cleanly inside a single JSONB blob.
- **Translation status/completeness tracking is needed** — e.g. "this
  product's Arabic description is stale relative to the English one," or a
  dashboard showing translation coverage. A translations table can carry
  `translated_at`, `translated_by`, `is_stale` per language; a JSONB blob
  can't represent "this half of the object is out of date."
- **Approval/revision tracking per language** — if Arabic and English copy
  need independent approval steps (e.g. a native Arabic editor sign-off
  workflow separate from the English one), each language's content needs its
  own row with its own state machine, not a shared JSON blob.

None of these apply to Al Shehail's site today (2 fixed locales, no CMS
editorial workflow, no approval pipeline) — so JSONB localized fields are the
right choice for Phase 1. This is worth re-evaluating if the site grows a
real CMS with multiple content editors.

---

## Common conventions (apply to every table below)

- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()` (via the `pgcrypto` or
  `pgcrypto`/`uuid-ossp` extension) — avoids leaking sequential row counts
  and is safe to generate client-side if ever needed (e.g. optimistic UI).
- `slug`: `TEXT NOT NULL UNIQUE` where present — always the *English* slug,
  matching current code exactly (e.g. `arabic-bread`, `distribution`,
  `halsa-bake`). Slugs are locale-agnostic identifiers, exactly like today —
  `/products/arabic-bread` and `/ar/products/arabic-bread` are the same
  product row.
- `sort_order`: `INTEGER NOT NULL DEFAULT 0` — explicit ordering column
  rather than relying on insertion order or `id`, since display order is
  meaningful content (category order, featured order, process steps, etc.)
  and today is expressed purely by array position in the `lib/` files.
- `is_active`: `BOOLEAN NOT NULL DEFAULT true` — soft-hide without deleting,
  matching the "don't delete pending/legacy keys" principle already used in
  `lib/assets.ts`.
- `created_at` / `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT now()`, with
  `updated_at` maintained by a standard `BEFORE UPDATE` trigger.
- Every `*_localized` column is `JSONB NOT NULL` shaped `{"en": "...", "ar":
  "..."}` per the locale strategy above, unless explicitly marked nullable.
- Every `*_localized_array` / `*_json` column is `JSONB NOT NULL DEFAULT
  '[]'::jsonb` — see per-table notes for the array-of-localized-strings shape
  used today (`Localized[]` in TypeScript).

---

## Product schema

### `product_categories`

Maps from `lib/products/catalog.ts` (`productCategories`, 4 rows today:
Flatbread & Wraps, Soft Bread, Pastry, Sweets).

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `slug` | `TEXT UNIQUE NOT NULL` | e.g. `flatbread-wraps` |
| `name_localized` | `JSONB NOT NULL` | `{en, ar}` |
| `description_localized` | `JSONB NOT NULL` | `{en, ar}` |
| `sort_order` | `INTEGER NOT NULL DEFAULT 0` | category display order |
| `is_active` | `BOOLEAN NOT NULL DEFAULT true` | |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | |

Indexes: unique index on `slug` (via the constraint); index on
`(is_active, sort_order)` for the common "active categories in order" query.

### `products`

Maps from `lib/products/catalog.ts` (`products`, 17 rows today).

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `category_id` | `UUID NOT NULL REFERENCES product_categories(id)` | replaces today's denormalized `category`/`categorySlug` pair on each product |
| `slug` | `TEXT UNIQUE NOT NULL` | e.g. `arabic-bread` — drives `generateStaticParams` for `/products/[slug]` today |
| `name_localized` | `JSONB NOT NULL` | `{en, ar}` |
| `short_description_localized` | `JSONB NOT NULL` | `{en, ar}` — today's `shortDescription` |
| `card_description_localized` | `JSONB NOT NULL` | `{en, ar}` — today's `cardDescription` |
| `image_asset_id` | `UUID NULL REFERENCES media_assets(id)` | see Media assets section — nullable because not every product has a confirmed photo path in every environment |
| `icon_type` | `TEXT NOT NULL` | matches today's `ProductIconType` union (`flatbread`, `loaf`, `bun`, `samoon`, `croissantLarge`, `croissant`, `puff`, `maamoul`, `date`, ...) — a Postgres `CHECK (icon_type IN (...))` or a dedicated `product_icon_type` enum should mirror the TS union exactly so the two never drift |
| `featured` | `BOOLEAN NOT NULL DEFAULT false` | drives the homepage "Featured" filter — same field as today |
| `sort_order` | `INTEGER NOT NULL DEFAULT 0` | preserves today's array order within `productsByCategory` |
| `is_active` | `BOOLEAN NOT NULL DEFAULT true` | |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | |

Indexes: unique index on `slug`; index on `category_id`; partial index on
`(featured) WHERE featured = true AND is_active = true` for the homepage
featured-products query; index on `(category_id, sort_order)` for
category-filtered listings (mirrors `productsByCategory` today).

Note: `imagePlaceholderLabel` (today's per-product placeholder alt text) is
folded into `media_assets.alt_localized` once a real `media_assets` row
exists for the product photo — see below — rather than kept as a separate
column here.

### `product_details`

Maps from `lib/products/details.ts` (`productDetails`, keyed by slug — one
entry per product with detail content, today all 17 products have one).

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `product_id` | `UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE` | 1:1 with `products` — `UNIQUE` enforces that |
| `positioning_localized` | `JSONB NOT NULL` | `{en, ar}` — today's `positioning` |
| `overview_localized` | `JSONB NOT NULL DEFAULT '[]'` | array of `{en, ar}` objects — today's `overview: Localized[]` (always 2 paragraphs today, but modeled as an array to match the source shape exactly) |
| `detail_use_cases_localized` | `JSONB NOT NULL DEFAULT '[]'` | array of `{en, ar}` — today's `detailUseCases` |
| `recipe_options_localized` | `JSONB NOT NULL DEFAULT '[]'` | array of `{en, ar}` — today's `recipeOptions` |
| `disclaimer_localized` | `JSONB NULL` | `{en, ar}`, nullable — today's shared `recipeDisclaimer` is identical across every product, so most rows would either leave this null and fall back to a site-wide default, or (simpler for Phase 1) leave this column out entirely and keep `recipeDisclaimer` as static config (see note below) |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | |

**Design decision — arrays as JSONB, not normalized rows:** `overview`,
`detailUseCases`, and `recipeOptions` are ordered lists of paragraphs/phrases
that are always read together, always in order, and never queried
individually ("find all products whose recipe options mention X" is not a
real product requirement today). Normalizing these into a child table
(`product_detail_items`) would add joins and ordering complexity for no
query benefit — JSONB arrays are the right call here, same reasoning as the
locale strategy above.

**Design decision — shared generic content stays static, not per-row:**
`lib/products/details.ts` also exports `recipeDisclaimer`, `privateLabelPoints`,
`packagingOptions`, and `qualityPoints` — these are **identical across every
product** (not per-product data at all; they're shared page chrome rendered
on every `/products/[slug]` page). Do not model these as `product_options`
rows with a null `product_id` — that invites accidental per-product
divergence. Recommendation: keep these four as static config (a small seed
table like `site_content_blocks`, or simply left in code) even after
`products`/`product_details` move to the database. Revisit only if a real
per-product override need appears.

### `product_options`

Maps from the per-product arrays that vary by product:
`products.useCases`, `products.privateLabelOptions`, `products.variants`
(all in `lib/products/catalog.ts`), plus `product_details.detailUseCases`
and `product_details.recipeOptions` *could* also live here instead of as
JSONB arrays on `product_details` — see the tradeoff note below.

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `product_id` | `UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE` | |
| `type` | `TEXT NOT NULL` | one of `use_case`, `private_label_option`, `variant`, `recipe_option` — `CHECK` constraint or enum |
| `label_localized` | `JSONB NOT NULL` | `{en, ar}` |
| `sort_order` | `INTEGER NOT NULL DEFAULT 0` | |
| `is_active` | `BOOLEAN NOT NULL DEFAULT true` | |

Indexes: index on `(product_id, type, sort_order)` for the common "give me
this product's use cases in order" query.

**Tradeoff note — `product_options` table vs. JSONB arrays on
`product_details`:** the task specification asks for both a normalized
`product_options` table *and* JSONB array columns on `product_details`
(`overview_localized`, `detail_use_cases_localized`,
`recipe_options_localized`). This document keeps both, but assigns them
different content:

- **Catalog-level lists that could be reused/queried across products**
  (`useCases`, `privateLabelOptions`, `variants` — currently reused verbatim
  across many wrap-variant products via shared constants like
  `wrapsSandwiches`/`wrapOptions` in `lib/products/shared.ts`) → normalized
  `product_options` rows. This is exactly the kind of data the readiness map
  flagged as benefiting from normalization ("which products offer seeded
  variants").
- **Detail-page narrative content that's always read as an ordered whole and
  never cross-product-queried** (`overview`, plus `detailUseCases` and
  `recipeOptions` if a team prefers simplicity over normalization) → JSONB
  arrays on `product_details`.

A simpler Phase 1 alternative: skip `product_options` normalization
entirely and keep `useCases`/`privateLabelOptions`/`variants` as JSONB array
columns on `products` too, matching `product_details`'s treatment exactly,
and only introduce `product_options` in Phase 2 if a real
cross-product-query need shows up. Either approach is valid; this document
recommends starting with `product_options` since the shared-constant reuse
pattern already in the source data (`wrapOptions`, `wrapDetailUseCases`,
etc.) suggests these values *are* meant to be shared/queried, not just
displayed.

---

## Services schema

### `services`

Maps from `lib/services.ts` (`services`, 3 rows today: `distribution`,
`brand-design`, `digital-marketing`). Note the real source data is richer
than a flat hero+CTA — every service also carries an intro block, a
coverage block, a process block, one of three optional blocks
(audience/deliverables/categories), a related-services block, and a closing
note+CTA block. Modeling all of that as columns on `services` would make the
table very wide; instead, `services` carries only the true per-service
top-level identity + hero + primary CTAs, and every other block moves to
`service_sections` below.

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `slug` | `TEXT UNIQUE NOT NULL` | e.g. `distribution` — matches `ServiceSlug` |
| `meta_title_localized` | `JSONB NOT NULL` | `{en, ar}` |
| `meta_description_localized` | `JSONB NOT NULL` | `{en, ar}` |
| `hero_eyebrow_localized` | `JSONB NOT NULL` | `{en, ar}` |
| `hero_title_localized` | `JSONB NOT NULL` | `{en, ar}` |
| `hero_subtitle_localized` | `JSONB NOT NULL` | `{en, ar}` |
| `cta_json` | `JSONB NOT NULL` | holds the today's four `Cta` objects (`heroPrimary`, `heroSecondary`, `ctaPrimary`, `ctaSecondary`) as `{"heroPrimary": {"label": {en, ar}, "href": "..."}, ...}` — small, fixed shape, not worth 4 more columns or a child table |
| `sort_order` | `INTEGER NOT NULL DEFAULT 0` | order on any future "all services" listing |
| `is_active` | `BOOLEAN NOT NULL DEFAULT true` | |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | |

### `service_sections`

One row per named content block within a service (`intro`, `coverage`,
`process`, `audience` / `deliverables` / `categories` — mutually exclusive
per service today, `related`, `note`).

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `service_id` | `UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE` | |
| `section_type` | `TEXT NOT NULL` | one of `intro`, `coverage`, `process`, `audience`, `deliverables`, `categories`, `related`, `note` — `CHECK` constraint |
| `title_localized` | `JSONB NULL` | `{en, ar}` — e.g. `introTitle`, `coverageTitle`; null where a section has no title (e.g. `note`) |
| `eyebrow_localized` | `JSONB NULL` | `{en, ar}` — e.g. `introEyebrow`, `processEyebrow` |
| `description_localized` | `JSONB NULL` | `{en, ar}` — e.g. `introDesc`, `coverageDesc` |
| `items_json` | `JSONB NOT NULL DEFAULT '[]'` | the section's structured list — shape varies by `section_type` (see below) |
| `sort_order` | `INTEGER NOT NULL DEFAULT 0` | |
| `is_active` | `BOOLEAN NOT NULL DEFAULT true` | |

`items_json` shape per `section_type` (documented here since the column is
intentionally polymorphic — this is the one place in the schema where JSONB
is used for genuine shape flexibility, not just localization):

- `coverage`: array of `{title: {en,ar}, description: {en,ar}, icon: string}`
  (today's `Feature[]`, icon is one of `ServiceIconKey`).
- `process`: array of `{title: {en,ar}, text: {en,ar}}` (today's `Step[]`).
- `audience` / `deliverables` / `categories`: `{items: [{en,ar}, ...]}` plus
  (for `deliverables`) an extra `desc: {en,ar}` field folded in alongside
  `description_localized` above.
- `related`: array of `{title: {en,ar}, description: {en,ar}, href: string}`
  (today's `Related[]`) — note `href` values point at other `services` rows
  by slug (or at `/private-label`, which is outside the `services` table
  entirely) so this is a soft reference, not a foreign key, matching how the
  code links today (`relPrivateLabel`, `relBrandDesign`, etc. are just
  `{title, description, href}` literals, not slug lookups).
- `note`: no items — just `title_localized`/`description_localized` (today's
  `noteLabel`/`noteText`).

Indexes: index on `(service_id, sort_order)`.

---

## Partners schema

### `partners`

Maps from `lib/content.ts` (`manufacturingPartners`, 3 rows today: Al Tahan,
HÄLSA Bake, EKTIFA — plus a reserved 4th slot, "Al Taj", already present as
a `PENDING`/`LEGACY` asset key in `lib/assets.ts` but not yet a real
partner).

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `slug` | `TEXT UNIQUE NOT NULL` | new column — today's code keys the partner→project relationship via `projectSlug` on the partner and matches it to `partnerProjects[].slug`; a stable partner slug (e.g. `al-tahan`) makes `partners` independently addressable |
| `name` | `TEXT NOT NULL` | plain text, not localized — partner/brand names are proper nouns shown as-is in both locales today (e.g. "HÄLSA Bake" renders unchanged on the Arabic site) |
| `asset_id` | `UUID NULL REFERENCES media_assets(id)` | replaces today's `assetKey` lookup into `lib/assets.ts`'s `partners` object |
| `sort_order` | `INTEGER NOT NULL DEFAULT 0` | |
| `is_active` | `BOOLEAN NOT NULL DEFAULT true` | lets the reserved-but-unused "Al Taj" slot exist as an inactive row instead of a dangling asset key with no data row, once migrated |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | |

### `partner_projects`

Maps from `lib/partnerProjects.ts` (`partnerProjects`, one project per
partner today — a 1:1 relationship in practice, modeled as 1:many for
flexibility since nothing prevents a partner having more than one project
later).

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `partner_id` | `UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE` | |
| `slug` | `TEXT UNIQUE NOT NULL` | e.g. `halsa-bake` — today's project slug, currently equal to the partner's own slug but kept independent |
| `title_localized` | `JSONB NOT NULL` | `{en, ar}` — maps from today's `categoryLabel` (display category name) combined with `partnerName`; recommend deriving a clean project title at migration time rather than reusing `categoryLabel` verbatim, since today's `category`/`categoryLabel` is really a taxonomy tag, not a project title |
| `summary_localized` | `JSONB NOT NULL` | `{en, ar}` — today's `positioning` |
| `project_detail_json` | `JSONB NOT NULL` | bundles today's `overview`, `productionFocus`, `ingredientStrategy`, `processNotes`, `nutritionFocus`, `complianceNotes` (all `Localized[]`) as `{"overview": [...], "productionFocus": [...], ...}` — same reasoning as `product_details.overview_localized`: ordered narrative content, always read as a whole, never queried piecemeal |
| `sort_order` | `INTEGER NOT NULL DEFAULT 0` | |
| `is_active` | `BOOLEAN NOT NULL DEFAULT true` | |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | |

Note: today's `category`/`categoryLabel` (a small fixed taxonomy — "Healthy
Bakery / Functional Bread", "Organic / Government Food Brand Bakery
Production", "Date-Based Sweets / Bakery") is folded into
`project_detail_json` as `{"categoryLabel": {en, ar}}` for Phase 1 rather
than getting its own `partner_project_categories` table — there are only 3
values today and no evidence they need independent management from the
project itself.

### `partner_project_products`

Maps from `lib/partnerProjects.ts` (`PartnerProject.products`, each
project's associated product list — some of these are real catalog products,
others are project-specific products with no catalog entry, using
`NEEDS_VERIFICATION` placeholder text for unconfirmed data).

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `partner_project_id` | `UUID NOT NULL REFERENCES partner_projects(id) ON DELETE CASCADE` | |
| `product_id` | `UUID NULL REFERENCES products(id)` | set when the project product is also a real catalog product; today's data doesn't actually cross-reference the main `products` table by slug, so this FK is new structure, not a migration of an existing field |
| `product_name_localized` | `JSONB NULL` | `{en, ar}` — used when `product_id` is null (a project-specific product not in the main catalog) — today's `PartnerProjectProduct.name` |
| `category_localized` | `JSONB NULL` | `{en, ar}` — today's `PartnerProjectProduct.category` |
| `short_description_localized` | `JSONB NULL` | `{en, ar}` |
| `key_notes_localized` | `JSONB NOT NULL DEFAULT '[]'` | array of `{en, ar}` |
| `nutrition_highlights_localized` | `JSONB NOT NULL DEFAULT '[]'` | array of `{en, ar}` — note today's `NEEDS_VERIFICATION` placeholder convention should carry over unchanged: unverified values stay explicitly marked, never silently invented |
| `image_asset_id` | `UUID NULL REFERENCES media_assets(id)` | |
| `status` | `TEXT NOT NULL DEFAULT 'needs-data'` | one of `active`, `planned`, `needs-data` — matches today's `PartnerProductStatus` exactly |
| `sort_order` | `INTEGER NOT NULL DEFAULT 0` | |

Indexes: index on `(partner_project_id, sort_order)`; index on `product_id`
where not null.

---

## Media assets schema

### `media_assets`

Maps from `lib/assets.ts` (the `assets` manifest, `productAssetKeyBySlug`,
and the `ACTIVE`/`PENDING`/`LEGACY` categorization already added there).

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `key` | `TEXT UNIQUE NOT NULL` | today's manifest key, e.g. `arabicBread`, `halsaBake`, `logoMark` — kept for continuity with existing code/asset naming even after a DB migration |
| `path` | `TEXT NULL` | e.g. `/assets/products/arabic-bread.webp` — nullable, matching today's `AssetPath = string | null` (null = no file yet) |
| `alt_localized` | `JSONB NOT NULL` | `{en, ar}` — today's `altTexts` map is English-only; Arabic alt text should be added as part of this migration, not left English-only, since alt text is user-facing accessibility content like everything else on the Arabic site |
| `type` | `TEXT NOT NULL` | one of `brand`, `partner`, `product`, `factory`, `certification`, `retail`, `og` — mirrors today's manifest sections (`AssetManifest` keys) |
| `status` | `TEXT NOT NULL DEFAULT 'pending'` | one of `active`, `pending`, `legacy` — direct copy of the section comments just added to `lib/assets.ts` in this same migration effort |
| `width` | `INTEGER NULL` | not tracked at all today; nullable until real dimensions are known |
| `height` | `INTEGER NULL` | same |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | |

Indexes: unique index on `key`; index on `(type, status)`.

**Clarification: media stays static for Phase 1.** This table is
**future-facing only**. Actual image files continue to live in
`public/assets/...` and `lib/assets.ts` continues to be the runtime source
of truth for asset paths — nothing about page rendering changes. This table
exists so that once `products`/`partners`/etc. move to the database, their
`image_asset_id` / `asset_id` foreign keys have a real table to point at,
without requiring a simultaneous "and also migrate all media to a real DAM/
upload system" project. When media *does* move to real infrastructure (S3,
Cloudinary, etc.), `path` becomes a URL instead of a `/public` reference and
nothing else in this schema needs to change.

---

## Relationships (summary)

```
product_categories 1──* products
products           1─1 product_details
products           1──* product_options
products           0──* partner_project_products (optional FK)
media_assets       0──* products              (image_asset_id)
media_assets       0──* partners              (asset_id)
media_assets       0──* partner_project_products (image_asset_id)

services           1──* service_sections

partners           1──* partner_projects
partner_projects    1──* partner_project_products
```

`form_enquiries` (see below) has no relationships into the content tables —
it's a standalone lead-capture table.

---

## Indexes (consolidated)

- `product_categories`: unique(`slug`); index(`is_active`, `sort_order`)
- `products`: unique(`slug`); index(`category_id`); partial
  index(`featured`) `WHERE featured AND is_active`;
  index(`category_id`, `sort_order`)
- `product_details`: unique(`product_id`)
- `product_options`: index(`product_id`, `type`, `sort_order`)
- `services`: unique(`slug`)
- `service_sections`: index(`service_id`, `sort_order`)
- `partners`: unique(`slug`)
- `partner_projects`: unique(`slug`); index(`partner_id`)
- `partner_project_products`: index(`partner_project_id`, `sort_order`);
  index(`product_id`) `WHERE product_id IS NOT NULL`
- `media_assets`: unique(`key`); index(`type`, `status`)
- `form_enquiries`: index(`created_at` DESC); index(`status`)

---

## Migration phases

This mirrors and narrows `docs/database-readiness-map.md`'s phase order,
scoped to the tables this document actually designs:

1. **Phase 1 (this document's scope):** `product_categories`, `products`,
   `product_details`, `product_options`, `services`, `service_sections`,
   `partners`, `partner_projects`. Highest content churn, clearest 1:1
   mapping from existing `lib/` modules, no routing/SEO entanglement.
2. **Phase 1, architecturally separate:** `form_enquiries` — same business
   priority as Phase 1, but needs a write path (server/serverless) the
   static site doesn't have, so it can't land as a pure schema-plus-seed
   change the way the tables above can.
3. **Phase 2 (out of scope here, see readiness map):** `partner_project_products`'s
   full normalization against a live `products` table (today's data doesn't
   actually cross-reference `products` by slug, so backfilling real
   `product_id` values is a Phase 2 data-quality pass, not just a schema
   change), `media_assets` going from "future-facing table" to
   "actually replaces `lib/assets.ts` at runtime", `pages`, `page_sections`,
   `navigation_items`.
4. **Later:** `seo_metadata`, `site_settings`, `locales`, `contact_settings`
   — see readiness map for why these stay static longest.

---

## Static export limitation notes

- The site builds with `output: "export"` — there is **no server at request
  time**. A database schema existing does not, by itself, let any page read
  from it. Static export means every page's HTML is generated once, at
  build time, from whatever data source the build process reads.
- The realistic path to actually using this schema without abandoning static
  export: **read from the database at build time** (e.g. in
  `generateStaticParams`/page components, fetch from Postgres during `next
  build`, exactly the same place `lib/products/catalog.ts` is read from
  today) and keep serving a static export at request time. This is a build
  pipeline change, not a hosting/architecture change, and is the natural
  next step after this document — but it is explicitly **not** part of this
  task (no DB connection is being wired up here).
- **Writes are the real blocker**, not reads. `form_enquiries` cannot be
  populated by a database-read-at-build-time approach — a genuine
  submission has to happen after the static HTML is already served to a
  real visitor, which requires *something* running at request time (a
  Next.js API route on a real server, a serverless function, or a
  third-party form backend/webhook). This is the one table in this document
  that forces an actual runtime decision, not just a data-source decision.

## What must wait until runtime/serverless exists

- **Any write operation at all** — `form_enquiries` inserts, obviously, but
  also anything like "an editor updates a product description and it goes
  live without a rebuild." Static export means content changes require a
  rebuild+redeploy regardless of whether the data source is a TypeScript
  file or a database row, *unless* a runtime layer is added.
- **On-demand/incremental static regeneration (ISR)** — Next.js supports
  this, but it requires a Node.js server runtime (or a host that emulates
  one), which is incompatible with `output: "export"` as currently
  configured. Not needed for Phase 1 (build-time reads are sufficient for
  read-only content), but relevant context for whoever plans the eventual
  runtime.
- **Media uploads through the DB** — `media_assets` rows can exist and be
  seeded, but an actual "upload a new product photo without touching code"
  workflow needs a runtime upload endpoint (or a third-party media host)
  the static site doesn't have.
- **Contact-form persistence, notifications, or CRM handoff** — anything
  beyond "open a WhatsApp link" for the contact form needs the same runtime
  write path as `form_enquiries` above.

---

## Proposed `form_enquiries` schema (documented separately, not built)

Not part of the Phase 1 content-schema tables above — kept separate because,
per the static-export limitation notes, it cannot ship as a pure schema/seed
change the way the content tables can.

**It cannot be implemented as a pure static/DB swap.** `products`,
`services`, `partners`, etc. can move from TypeScript files to database rows
and still be *read* at build time with zero change to how the site is
hosted. `form_enquiries` is different: a real enquiry only exists after a
real visitor submits the form, which happens after the static HTML has
already been served — there is no build-time moment where "read this table"
could substitute for "insert into this table."

**It requires a write path**, one of:

- A Next.js runtime API route (requires moving off `output: "export"`, or
  running the API route on a separate small Node/Edge service alongside the
  still-static site).
- A serverless function (e.g. a single Lambda/Cloud Function endpoint the
  static site's contact form `fetch()`s to — this is the option that
  disturbs the current static-export architecture *least*, since the site
  itself doesn't need a server, only one small external endpoint).
- An external form backend (Formspree, Getform, etc.) — fastest to add,
  least control, but genuinely zero architecture change.
- A CRM/webhook integration — if there's already a CRM the sales team uses,
  posting enquiries straight there (via its API or a webhook) may make more
  sense than owning a `form_enquiries` table at all.

**Recommendation: keep WhatsApp as the primary contact path for now** (it
works, requires nothing, and matches the "From idea to shelf" B2B tone of
direct conversation) **and add persistence later**, once there's an actual
decision about which of the four write-path options above fits the team's
operational needs. Don't build a `form_enquiries` write path speculatively —
build it when there's a concrete need (e.g. "we're losing track of who
enquired" or "we want form analytics").

Proposed schema, for when that need arises:

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID PK` | |
| `full_name` | `TEXT NOT NULL` | |
| `company_name` | `TEXT NULL` | |
| `country` | `TEXT NULL` | |
| `email` | `TEXT NOT NULL` | |
| `whatsapp` | `TEXT NULL` | |
| `category` | `TEXT NULL` | free-form today (matches the product-category `<select>` in `ContactForm.tsx`); could become a soft reference to `product_categories.slug` later |
| `product` | `TEXT NULL` | same — matches the product `<select>`; could reference `products.slug` later |
| `existing_recipe` | `BOOLEAN NOT NULL DEFAULT false` | today's Yes/No field |
| `packaging_support` | `BOOLEAN NOT NULL DEFAULT false` | today's Yes/No field |
| `quantity` | `TEXT NULL` | kept as free text — today's field is an open text input ("e.g. cartons / units per month"), not a structured quantity |
| `target_market` | `TEXT NULL` | |
| `message` | `TEXT NULL` | |
| `locale` | `TEXT NOT NULL` | `en` or `ar` — which language the form was submitted in, so the right-language WhatsApp message text (already generated client-side today) can be reconstructed/audited |
| `source_path` | `TEXT NOT NULL` | the page the form was submitted from, e.g. `/contact` or `/ar/products/arabic-bread` (product-specific enquiries reuse the same form pattern via `whatsappForProduct`) |
| `status` | `TEXT NOT NULL DEFAULT 'new'` | e.g. `new`, `contacted`, `closed` — simple pipeline state for whoever follows up |
| `created_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` | |

Indexes: index on `created_at DESC` (recency listing); index on `status`
(follow-up queue).
