# Database readiness map

This document maps the site's current static content structure to a set of
future database/CMS tables, so a later migration has a clear starting point.
It is a planning reference only.

**There is no backend, database, or CMS in this codebase today.** Every page
is statically exported (`output: "export"` in `next.config.mjs`) from
TypeScript data modules under `lib/`. The contact form has no persistence at
all — it only builds a `wa.me` WhatsApp deep link client-side; a submission
is never stored anywhere.

For each table: where the equivalent data lives today, whether it should
become DB-managed or stay static config, and a migration-priority phase.

---

## `site_settings`

- **Current mapping**: `lib/content.ts` (`company` — name, positioning,
  location, contact details), `next.config.mjs` (site-level build config),
  `app/(en)/layout.tsx` / `app/ar/layout.tsx` (fonts, `metadataBase`, global
  `<html>` attributes).
- **Recommendation**: mostly stays static config. Company contact details
  (phone, email, address) are reasonable DB candidates if they change more
  than once every year or two; build-level settings (fonts, export mode)
  should never be DB-managed.
- **Priority**: later — low churn, low risk either way.

## `locales`

- **Current mapping**: `lib/i18n.ts` (`Locale`, `locales`, `defaultLocale`,
  `dir`, `htmlLang`, `localizedPath`/`localeHref` helpers).
- **Recommendation**: stays static config. Adding a language is a structural
  change (new route tree under `app/`, new translated content everywhere) —
  not something a DB row can drive on a static-export site.
- **Priority**: later.

## `navigation_items`

- **Current mapping**: `lib/navigation.ts` (`primaryNav`, `serviceLinks`,
  `footerNav`).
- **Recommendation**: could go either way. It's low-volume and rarely
  changes, so static config is fine short-term; but it's a natural fit for a
  CMS-managed table once a non-technical editor needs to reorder/rename nav
  items without a code deploy. Flag as a genuine tradeoff, not a clear call.
- **Priority**: phase 2 — worth revisiting once `pages`/`products` prove the
  CMS pattern works, but not urgent on its own.

## `pages`

- **Current mapping**: the shared page-body components in
  `components/pages/*.tsx` (`AboutPage`, `ContactPage`, `PartnersPage`,
  `PrivateLabelPage`, `ProductsPage`, `ProductDetailPage`, `ServicePage`),
  each invoked by a thin `app/(en)/**/page.tsx` + `app/ar/**/page.tsx` pair
  that supplies `locale` and per-page `generateMetadata`.
- **Recommendation**: DB-managed is the long-term goal (this is the highest
  content-churn, highest-value area for non-technical editing), but the
  *layout/structure* of each page (which sections, in what order) can stay
  code-defined while the *content* of each section becomes data-driven.
- **Priority**: phase 1 for content; the page shells themselves can remain
  code for a long time.

## `page_sections`

- **Current mapping**: individual section components within each page (e.g.
  `components/private-label/PrivateLabelProcess.tsx`,
  `components/home/ManufacturingProcessSection.tsx`,
  `components/home/ServicesEcosystem.tsx`) plus their backing data (e.g.
  `lib/content.ts`'s `privateLabelSteps`, `lib/homepageEcosystem.ts`).
- **Recommendation**: DB-managed content, code-managed rendering — same
  reasoning as `pages`. Section *order and presence* per page is a good
  candidate for a `page_sections` join/ordering table once `pages` is DB-backed.
- **Priority**: phase 2 (depends on `pages` landing first).

## `services`

- **Current mapping**: `lib/services.ts` (service metadata + copy for
  Distribution / Brand Design / Digital Marketing), rendered by
  `components/pages/ServicePage.tsx`.
- **Recommendation**: DB-managed — this is content-heavy, bilingual, and
  changes as the company's service lineup evolves.
- **Priority**: phase 1.

## `service_sections`

- **Current mapping**: sub-sections within `lib/services.ts` (feature grids,
  process steps, related-services lists) consumed by
  `components/services/ServiceFeatureGrid.tsx`,
  `components/services/ServiceProcess.tsx`,
  `components/services/ServiceRelatedServices.tsx`.
- **Recommendation**: DB-managed alongside `services`, likely as nested/JSON
  fields on the same table rather than a fully normalized join table — the
  data doesn't need cross-service querying.
- **Priority**: phase 1 (bundled with `services`).

## `product_categories`

- **Current mapping**: `lib/products/catalog.ts` (`productCategories`).
- **Recommendation**: DB-managed — small table, but products reference it and
  it changes when the catalog is restructured.
- **Priority**: phase 1.

## `products`

- **Current mapping**: `lib/products/catalog.ts` (`products`,
  `productsByCategory`, `featuredProducts`, `getProductBySlug`,
  `getRelatedProducts`).
- **Recommendation**: DB-managed — the single highest-value migration target;
  this is the most content-heavy, most frequently updated data in the site
  (17 products today and growing), and it directly drives `generateStaticParams`
  for `/products/[slug]` in both locales.
- **Priority**: phase 1.

## `product_details`

- **Current mapping**: `lib/products/details.ts` (`productDetails`,
  `getProductDetail`, plus the shared `recipeDisclaimer`, `privateLabelPoints`,
  `packagingOptions`, `qualityPoints` used across every detail page).
- **Recommendation**: DB-managed, same table family as `products` (likely a
  1:1 child table or a JSON column) since it's keyed by the same slug.
- **Priority**: phase 1 (bundled with `products`).

## `product_options`

- **Current mapping**: no dedicated structure today — options are inline
  arrays on each product (`useCases`, `privateLabelOptions`,
  `recipeOptions`, `variants`) inside `lib/products/catalog.ts` and
  `lib/products/details.ts`.
- **Recommendation**: DB-managed as a normalized child table once products
  move to a DB — today these are just string lists, but a real table would
  let options be reused/queried across products (e.g. "which products offer
  seeded variants").
- **Priority**: phase 1 (bundled with `products`), though normalizing this
  fully can wait until phase 2 if the flat-array approach still works.

## `partners`

- **Current mapping**: `lib/content.ts` (`manufacturingPartners` — name,
  asset key, project slug), rendered via
  `components/partners/PartnerProjectGrid.tsx`.
- **Recommendation**: DB-managed — small table (3 entries today, a 4th
  reserved via the `alTaj` asset key in `lib/assets.ts`), low risk to migrate
  early.
- **Priority**: phase 1.

## `partner_projects`

- **Current mapping**: `lib/partnerProjects.ts` (per-partner project detail
  content — the "Single Partner Project" pages/modals), rendered via
  `components/partners/PartnerProjectModal.tsx`.
- **Recommendation**: DB-managed alongside `partners`.
- **Priority**: phase 1.

## `partner_project_products`

- **Current mapping**: also inside `lib/partnerProjects.ts` (each project's
  associated product list), rendered via
  `components/partners/PartnerProjectProducts.tsx`.
- **Recommendation**: DB-managed as a join table between `partner_projects`
  and `products` once both are migrated.
- **Priority**: phase 2 (depends on both `partners` and `products` landing).

## `media_assets`

- **Current mapping**: `lib/assets.ts` (`assets` manifest, `productAssetKeyBySlug`,
  `hasAsset`/`getAsset`/`getProductAsset`/`getAssetAlt` helpers). Already
  organized into ACTIVE / PENDING / LEGACY sections as of this cleanup pass,
  which maps cleanly onto future upload-status fields on a `media_assets` row.
- **Recommendation**: DB-managed once real file uploads need to happen without
  a code deploy (e.g. a non-technical editor swapping a product photo). Until
  then, the static manifest is simpler and has zero infrastructure cost.
- **Priority**: phase 2 — do this after the content tables (products,
  services, partners) so asset references have somewhere real to point to.

## `seo_metadata`

- **Current mapping**: scattered `generateMetadata()`/`export const metadata`
  calls across every `app/(en)/**/page.tsx` and `app/ar/**/page.tsx` (titles,
  descriptions, `alternates.languages`, Open Graph fields, and the inline
  JSON-LD blocks in the homepage route files).
- **Recommendation**: DB-managed eventually, but this is the most
  structurally entangled with Next.js's per-route `generateMetadata` API — a
  migration here needs each page to fetch its SEO row and pass it through,
  which is more invasive than the pure-data tables above.
- **Priority**: later — do this only after `pages`/`products` are DB-backed,
  since SEO metadata is naturally keyed off the same page/product records.

## `contact_settings`

- **Current mapping**: `lib/content.ts` (`company.email`, `company.phone`,
  `company.phoneDigits`, `whatsappLink()`), consumed by `components/Footer.tsx`
  and `components/ContactForm.tsx`.
- **Recommendation**: stays static config short-term (it's just a handful of
  values); low priority to move to a DB on its own, though it's trivial to
  bundle into `site_settings` if that table is ever migrated.
- **Priority**: later.

## `form_enquiries`

- **Current mapping**: none — this is the clearest gap. `components/ContactForm.tsx`
  builds a `wa.me` deep link (`buildWhatsAppLink`) with the form fields
  encoded as URL text and opens it in a new tab; nothing is saved, logged, or
  queryable. There is no way today to see how many enquiries came in, retry a
  failed WhatsApp open, or follow up if the visitor didn't have WhatsApp
  installed.
- **Recommendation**: DB-managed — this is the one table that doesn't
  currently exist as durable data in any form, and it's also the one with the
  clearest business value (a lead record, even a minimal one, beats none).
  Note this requires a server or serverless function, which the current
  `output: "export"` static site does not have — this is the item most likely
  to force an architecture decision (e.g. a small serverless endpoint or a
  third-party form backend) rather than a pure "add a table" change.
- **Priority**: phase 1 for the business need, but technically it's the
  odd one out — it can't be done as a drop-in DB swap the way the content
  tables can, since it needs a write path the static site doesn't have today.

---

## Suggested phase order

1. **Phase 1** — `products`, `product_categories`, `product_details`,
   `product_options`, `services`, `service_sections`, `partners`,
   `partner_projects`: the highest-churn, most content-heavy, lowest
   structural-risk tables. Migrating these first proves the pattern without
   touching routing or SEO. `form_enquiries` is also phase 1 by business
   priority, but is architecturally distinct (needs a write path/server).
2. **Phase 2** — `pages`, `page_sections`, `navigation_items`,
   `partner_project_products`, `media_assets`: structural/navigational
   content that benefits from phase 1's DB patterns already existing.
3. **Later** — `seo_metadata` (entangled with Next.js routing, do last),
   `site_settings`, `locales`, `contact_settings`: low-churn or
   structurally-coupled-to-code data that's fine as static config
   indefinitely unless a concrete need (multi-tenant, non-technical
   language/site-settings editing) appears.
