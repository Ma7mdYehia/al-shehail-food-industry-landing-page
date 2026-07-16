# Production Patch 02 — Supabase Database Foundation

Creates the production-grade PostgreSQL/Supabase **database foundation** for the
Al Shehail Food Industries website: schema, constraints, indexes, `updated_at`
triggers, Row Level Security, least-privilege grants, a deterministic seed
importer, a read-only verifier, a dependency-free schema-structure validator,
and this documentation.

**Patch 02 does NOT connect the live website to Supabase.** Every page continues
to read from the TypeScript content modules under `lib/`. This patch produces
**zero visible website changes**.

## 1. Objective

- Stand up the Phase 1 database that mirrors the validated seed export under
  `data/seed/phase-1/`.
- Make all schema and seed work testable locally with no cloud project.
- Prepare (but do not implement) future Supabase-backed reads, a contact-form
  API, and an admin dashboard.

## 2. Branches

- **Source branch (source of truth / PR base):** `ui/homepage-glassmorphism-higgsfield-assets`
- **Required prior merge:** Production Patch 01 (PR #20, merge commit `69e3a074165e9bb5893a342c86f6a8bd2dd8a7d0`)
- **This implementation branch:** `prod/supabase-database-foundation-p02`

The PR is opened into the source branch and is **not merged** by this patch.

## 3. Schema tables

Created in foreign-key-safe order in
`supabase/migrations/20260715120000_phase_1_database_foundation.sql`:

| # | Table | Purpose |
|---|---|---|
| 1 | `media_assets` | Brand/partner/product/factory/certification/retail/OG image records |
| 2 | `product_categories` | Product category taxonomy |
| 3 | `products` | Catalog products |
| 4 | `product_details` | 1:1 rich detail per product |
| 5 | `product_options` | Use-case / private-label / variant / recipe options |
| 6 | `services` | Service landing pages |
| 7 | `service_sections` | Ordered content sections per service |
| 8 | `partners` | Partners / clients |
| 9 | `partner_projects` | Projects per partner |
| 10 | `partner_project_products` | Products within a partner project |
| 11 | `shared_content` | Single-row shared copy (recipe disclaimer, private-label / packaging / quality points) |
| 12 | `form_enquiries` | **Future** contact-form leads — created now, not wired to the site |

### Relationships

```
product_categories 1─┬─* products ──┬── image_asset_id ─────* media_assets
                     │              1─── product_details (1:1, cascade)
                     │              1─── product_options   (*, cascade)
services 1──* service_sections (cascade)
partners 1─┬─* partner_projects (cascade) 1──* partner_project_products (cascade)
           └── asset_id ──────────────────────────────────* media_assets
partner_project_products ── product_id ───────(nullable)──* products
partner_project_products ── image_asset_id ───(nullable)──* media_assets
shared_content (single row, id='default')
form_enquiries (standalone; no public access)
```

## 4. Primary-key decision — TEXT, not UUID (intentional deviation)

`docs/database-schema-phase-1.md` proposed `UUID` primary keys. The completed
Phase 1 seed export instead uses **deterministic text identifiers** (e.g.
`cat_flatbread_wraps`, `prod_arabic_bread`, `detail_arabic_bread`,
`media_product_arabic_bread`, `partner_ektifa`, `proj_halsa_bake`), and the seed
foreign keys reference those text ids.

Patch 02 therefore uses **`TEXT` primary keys** on all seed-backed content
tables and preserves the existing deterministic ids exactly — the seed JSON was
**not** rewritten to force UUIDs. Rows created later (and every `form_enquiries`
row) default to `gen_random_uuid()::text`, so new records still get
collision-resistant ids without disturbing the seed. This keeps the seed import
deterministic and idempotent (upsert on the stable id).

## 5. Seed counts & warnings

Row counts (from `data/seed/phase-1/seed-manifest.json`, re-confirmed by a real
local Postgres load):

| Table | Rows |
|---|---|
| media_assets | 44 |
| product_categories | 4 |
| products | 17 |
| product_details | 17 |
| product_options | 178 |
| services | 3 |
| service_sections | 20 |
| partners | 3 |
| partner_projects | 3 |
| partner_project_products | 20 |
| shared_content | 1 |
| **form_enquiries** | **0 (never seeded)** |

Carried-over seed warnings (unchanged by this patch — data is imported as-is):

- `media_assets.alt_localized.ar` is `null` for every row (English-only alt text
  today). Arabic alt text must be **authored, not machine-translated**, before
  it is surfaced. The `is_localized()` guard permits a null `ar` **value** as
  long as the `ar` **key** is present.
- `product_details.disclaimer_localized` is null for every product; the shared
  recipe disclaimer lives once in `shared_content`.
- `partner_project_products.product_id` is set only where a project product's
  slug exactly matches a catalog product; the rest are project-specific and
  intentionally null (not omissions).
- `partner_project_products` seed carries only 5 fields; the table's richer
  nullable columns default empty/`needs-data` and await a future fuller import.
- `NEEDS_VERIFICATION` placeholders (in `lib/partnerProjects.ts` richer fields)
  are not part of the 5-field seed and are preserved, never rewritten.

## 6. Import order, dry-run & apply

Importer: `scripts/import-phase-1-to-supabase.mjs` (shared metadata in
`scripts/phase-1-shared.mjs`).

**Import order** (foreign-key-safe): media_assets → product_categories →
products → product_details → product_options → services → service_sections →
partners → partner_projects → partner_project_products → shared_content.
`form_enquiries` is never seeded.

- **Dry run (default, `npm run db:seed:dry-run`)** — runs the seed validator,
  performs an independent pre-flight (duplicate ids, duplicate slugs/keys,
  missing `en`/`ar`, unknown enum/status/type, dangling foreign keys), prints
  the target **host only** (no credentials), the dependency order, expected row
  counts, and warnings, then confirms **no database connection was opened and no
  write occurred.**
- **Apply (`npm run db:seed:apply`, adds `--apply`)** — the **bootstrap-safe**
  default. Additionally requires `NEXT_PUBLIC_SUPABASE_URL` and
  `SUPABASE_SERVICE_ROLE_KEY`, connects with the server-only service role (used
  **only** inside this trusted script), and upserts each table on its
  deterministic id with **`ON CONFLICT DO NOTHING`** (`ignoreDuplicates: true`)
  — it **inserts only genuinely missing seed ids, preserves every existing row
  (including dashboard edits and dashboard-created rows), and never deletes.**
- **Overwrite (`npm run db:seed:overwrite`, adds `--apply --overwrite-existing`)**
  — opt-in only. Replaces seed-owned rows with **`ON CONFLICT DO UPDATE`**. This
  **can clobber dashboard edits** to deterministic seeded ids and must be used
  deliberately; it prints a warning before running.
- **Strict counts (`--strict-seed-counts`)** — optional. Requires each table's
  remote count to **equal** the seed baseline (only meaningful for a fresh
  bootstrap). By default the importer does **not** require exact counts.

The importer **never prints** the service-role key, database password, access
token, or Authorization header.

### Bootstrap semantics & idempotency

The Phase 1 seed is **bootstrap baseline data, not the permanent authority** once
the dashboard is in use. Remote tables are expected to **grow beyond the seed
counts** (new products, partners, services, media, and — after the contact form
launches — `form_enquiries`). Accordingly:

- Safe default apply is idempotent and additive: a re-run inserts only missing
  seed ids, creates **zero duplicates**, preserves dashboard edits and
  dashboard-created rows, and leaves counts unchanged (confirmed on a real local
  Postgres cluster: `ON CONFLICT DO NOTHING` preserves an edited row;
  `ON CONFLICT DO UPDATE` replaces it only under `--overwrite-existing`).
- The importer **never deletes** remote rows — Patch 02 performs no destructive
  synchronization.
- Post-write verification checks that **every deterministic seed id is present**,
  no seed id is duplicated, and each table's count is **at least** the seed
  baseline; extra dashboard rows are **reported, never a failure** (unless
  `--strict-seed-counts` is set).

## 7. Verifier

`scripts/verify-phase-1-supabase.mjs` — the default (`npm run db:verify`) is
**genuinely read-only**: it issues SELECT/count queries only and never calls
`insert`/`update`/`delete`. It never targets a content table with a write and
never touches a real seeded product. Two default layers:

- **Static (always, no network):** deterministic ids, unique slugs/keys, `en`/
  `ar` presence, known-null Arabic media alt values remain explicit nulls,
  `NEEDS_VERIFICATION` snapshot.
- **Live, read-only (only when Supabase env vars are set):** every seed id is
  present; each table's count is **at least** the seed baseline (extra dashboard
  rows reported, never a failure — so verification does **not** break once the
  dashboard adds rows); foreign keys resolve; anon can read active content; anon
  sees only active content; and anon **cannot read** `form_enquiries` (a SELECT
  that is expected to be denied — no write). `form_enquiries` is **not**
  count-checked, so additional enquiries never fail verification.

Write protection (anon cannot INSERT/UPDATE/DELETE content) is proven by static
structure inspection, the local disposable PostgreSQL test, and RLS/grants
review — **not** by writing to the live database in the normal verifier.

**Optional, opt-in write probe (never part of `db:verify`, never in CI):**
`node scripts/verify-phase-1-supabase.mjs --allow-write-probes` (requires
`SUPABASE_SERVICE_ROLE_KEY`) runs a single **synthetic** insert against
`form_enquiries` **only**, using an `example.invalid` address, to confirm anon
inserts are rejected. It refuses to run under `CI`, cleans up in a `finally`
block, and **fails loudly if cleanup cannot be confirmed**. It never writes to
products or any content table, and never updates or deletes anything.

## 8. Row Level Security matrix

RLS is **enabled on every table**. Explicit least-privilege grants back the
policies (RLS does not replace grants): `anon`/`authenticated` are granted
`SELECT` only on the eleven public-read tables and **nothing** on
`form_enquiries`. The `service_role` bypasses RLS and is used only by the
trusted importer.

| Table | anon / authenticated SELECT | anon/auth INSERT/UPDATE/DELETE |
|---|---|---|
| media_assets | ✅ where `status = 'active'` | ❌ |
| product_categories | ✅ where `is_active` | ❌ |
| products | ✅ where `is_active` | ❌ |
| product_details | ✅ where active **and** parent product active | ❌ |
| product_options | ✅ where active **and** parent product active | ❌ |
| services | ✅ where `is_active` | ❌ |
| service_sections | ✅ where active **and** parent service active | ❌ |
| partners | ✅ where `is_active` | ❌ |
| partner_projects | ✅ where active **and** parent partner active | ❌ |
| partner_project_products | ✅ only where parent project **and** partner active | ❌ |
| shared_content | ✅ (public) | ❌ |
| **form_enquiries** | ❌ (no grant, no policy) | ❌ (no grant, no policy) |

There are **no public write policies** and **no authenticated write policies**.
Dashboard write access is deferred to a later patch, after the Auth/role model
is designed.

### Public vs server access

- **Public (anon):** read-only access to active content, enforced by both
  grants (SELECT only) and RLS predicates.
- **Server (service role):** full access, used **only** by the trusted import
  script and (in a future patch) by server-side API routes such as the
  contact-form handler.

### `form_enquiries` privacy model

- No `anon` SELECT/INSERT; no `authenticated` SELECT/INSERT by default; no
  public UPDATE/DELETE policies.
- **No raw IP storage and no fingerprinting columns** by design.
- The future contact API will validate and insert via a trusted server path
  (service role), never a public direct insert.

## 9. Confirmed future dashboard users (roles TBD)

| User | Email | Role |
|---|---|---|
| M.Yehia | marketing@halsabake.com | TBD |
| O.Abdullah | osama@halsabake.com | TBD |
| A.Zaid | gm@elshohail.com | TBD |

No Auth users are created and no roles/permissions are assigned in Patch 02.

## 10. Commands

```bash
npm run db:schema:validate   # dependency-free structural + safety guard (CI-safe)
npm run db:test:safety       # dependency-free bootstrap-safety unit tests (CI-safe)
npm run db:seed:dry-run      # validate + plan, NO writes (default)
npm run db:seed:apply        # SAFE import — inserts missing seed ids, preserves
                             #   existing rows, never deletes (requires Supabase env)
npm run db:seed:overwrite    # OPT-IN overwrite of seed-owned rows (may replace
                             #   dashboard edits) — use deliberately
npm run db:verify            # READ-ONLY verification (static + live if configured)
# Optional, local-only, opt-in synthetic write probe (never in CI, form_enquiries only):
#   node scripts/verify-phase-1-supabase.mjs --allow-write-probes
```

## 11. Local Supabase / database test

The local **Supabase** stack requires Docker, which is **not available** in this
environment, so `supabase start` / `supabase db` were **not** run. Instead, the
migration and seed were validated against a **real, ephemeral local PostgreSQL
16 cluster** (created with `initdb`, Supabase-like `anon`/`authenticated`/
`service_role` roles), which confirmed:

- the migration applies cleanly;
- all 309 seed content rows load with every CHECK/FK constraint active
  (counts match exactly; `form_enquiries` = 0);
- CHECK constraints reject bad enum values and non-localized JSON, and the
  `is_localized()` guard permits `ar = null`;
- foreign keys reject dangling references;
- the `updated_at` trigger advances on UPDATE;
- **idempotency:** re-running the full upsert load leaves row counts unchanged;
- **bootstrap safety (DB-level):** `ON CONFLICT DO NOTHING` (the safe default
  apply) preserves an edited row; `ON CONFLICT DO UPDATE` (opt-in overwrite)
  replaces it; a missing id is inserted and the count grows — matching the
  `db:test:safety` unit results;
- **RLS:** `anon` reads only active content, cannot see an inactive product or
  the child rows of an inactive parent, and is denied all access to
  `form_enquiries` and all writes to content tables.

The JS importer/verifier talk to Supabase over PostgREST (an HTTP API that the
Supabase stack provides), so their end-to-end HTTP paths were exercised only in
dry-run/static mode here; their data semantics were validated via the equivalent
SQL load against the local cluster, and the bootstrap-safe apply/verify logic is
covered by `npm run db:test:safety` (dependency-free unit tests) and the static
guards in `db:schema:validate`. A full `supabase start` run should be repeated in
an environment with Docker before the first remote apply.

### Future remote-linking steps (a later, explicitly-authorized action)

1. Create/confirm the Supabase project in the Supabase dashboard (manual).
2. `supabase link --project-ref <ref>` (requires an access token; never commit
   it).
3. Review the migration, then `supabase db push` to apply it to the linked
   project.
4. `npm run db:seed:apply` with `NEXT_PUBLIC_SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` set in the shell (not committed).
5. `npm run db:verify` with the public env vars set.

None of these are performed by Patch 02.

## 12. Future Vercel environment variables

Set in Vercel (Project → Settings → Environment Variables) when the site later
reads from Supabase — server secrets must never use a `NEXT_PUBLIC_` name:

| Variable | Scope |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public |
| `SUPABASE_SERVICE_ROLE_KEY` | **server-only secret** |

(Contact/email/Turnstile/admin variables from Patch 01's `.env.example` remain
for later patches.)

## 13. Rollback

Patch 02 adds files and a migration but **applies nothing remotely** and changes
no website behavior.

- **Abandon:** close the PR without merging; delete
  `prod/supabase-database-foundation-p02`. The source branch is untouched.
- **After a merge, before any remote apply:** `git revert` the merge commit —
  the added files (`supabase/`, `scripts/import-*`, `scripts/verify-*`,
  `scripts/validate-schema-structure.mjs`, `scripts/phase-1-shared.mjs`, this
  doc) and the `package.json` script/devDependency additions are the only
  changes. No database exists to undo.
- **After a remote apply (future):** because the migration only creates new
  objects, a down-migration would `drop` the created tables/functions; write it
  as an explicit, reviewed migration — Patch 02 intentionally ships no
  destructive/reset scripts.

## 14. What Patch 02 intentionally does NOT implement

Live Supabase project creation; remote database mutation; website reads from
Supabase; dynamic product/partner/service pages; ISR/revalidation; the
contact-form API; Resend; Turnstile; rate limiting; admin login; dashboard UI;
dashboard roles/permissions; content editing; media uploads; Auth middleware;
invitation emails; production deployment; a Next.js 15/16 upgrade; and any
visual/copy/SEO/route change.

## 15. Related planning docs

`docs/database-schema-phase-1.md`, `docs/database-readiness-map.md`,
`docs/database-seed-map.md`, and `docs/static-seed-export-phase-1b.md` remain as
historical planning context. Where a statement is now factually obsolete (the
UUID primary-key assumption, and "no database connection exists"), a short note
points here; their original reasoning is left intact.
