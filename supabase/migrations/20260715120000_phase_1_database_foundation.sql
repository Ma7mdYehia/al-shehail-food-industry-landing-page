-- =============================================================================
-- Production Patch 02 — Supabase Database Foundation (Phase 1)
-- =============================================================================
-- Creates the production PostgreSQL/Supabase schema that mirrors the validated
-- Phase 1 seed export under data/seed/phase-1/. This migration ONLY defines the
-- database; it does not connect the running website to Supabase. The website
-- continues to read from the TypeScript content modules under lib/.
--
-- Primary-key decision (intentional deviation from docs/database-schema-phase-1.md,
-- which proposed UUID PKs): seed-backed content tables use TEXT primary keys so
-- the existing deterministic seed IDs (e.g. cat_flatbread_wraps, prod_arabic_bread,
-- detail_arabic_bread, media_product_arabic_bread, partner_ektifa, proj_halsa_bake)
-- and the foreign keys that reference them are preserved EXACTLY. Rows created
-- later (and form_enquiries) default to gen_random_uuid()::text.
--
-- Idempotency: tables are created with plain CREATE TABLE (no blanket
-- IF NOT EXISTS) so a conflicting pre-existing schema fails loudly instead of
-- silently drifting. Extensions, shared functions, triggers, and policies use
-- create-or-replace / drop-if-exists patterns so those parts are safely
-- re-runnable. This migration is intended to be applied once by the Supabase
-- migration runner.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- Task 2 — Extensions & shared functions
-- -----------------------------------------------------------------------------

-- pgcrypto provides gen_random_uuid(), used as the default ID strategy for
-- rows created after the seed (and for form_enquiries).
create extension if not exists pgcrypto;

-- Reusable updated_at maintenance. Runs as the table owner's privileges (no
-- SECURITY DEFINER needed) and never trusts client-supplied timestamps.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Localized-object guard: value must be a JSON object that contains BOTH an
-- `en` and an `ar` key. The `ar` VALUE may be JSON null where the validated
-- seed intentionally has no Arabic text yet (e.g. media alt text) — the `?`
-- operator only checks key presence, so a null value still passes. Arabic text
-- must be authored, never machine-translated, before such fields are surfaced.
create or replace function public.is_localized(value jsonb)
returns boolean
language sql
immutable
as $$
  select value is not null
     and jsonb_typeof(value) = 'object'
     and value ? 'en'
     and value ? 'ar';
$$;

-- =============================================================================
-- Task 3 — Content tables (created in foreign-key-safe order)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 3.1 media_assets
-- -----------------------------------------------------------------------------
create table public.media_assets (
  id            text primary key default gen_random_uuid()::text,
  key           text not null unique,
  path          text,
  alt_localized jsonb not null,
  type          text not null,
  status        text not null default 'pending',
  width         integer,
  height        integer,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- type values mirror lib/assets.ts asset category groups and the seed exactly
  -- (plural forms). This is an intentional, documented deviation from the
  -- earlier planning-doc's singular list — the validated seed is authoritative.
  constraint media_assets_type_check
    check (type in ('brand', 'partners', 'products', 'factory',
                    'certifications', 'retail', 'og')),
  constraint media_assets_status_check
    check (status in ('active', 'pending', 'legacy')),
  constraint media_assets_alt_localized_check
    check (public.is_localized(alt_localized)),
  constraint media_assets_width_check  check (width  is null or width  > 0),
  constraint media_assets_height_check check (height is null or height > 0)
);

create index media_assets_type_status_idx on public.media_assets (type, status);

-- -----------------------------------------------------------------------------
-- 3.2 product_categories
-- -----------------------------------------------------------------------------
create table public.product_categories (
  id                    text primary key default gen_random_uuid()::text,
  slug                  text not null unique,
  name_localized        jsonb not null,
  description_localized  jsonb not null,
  sort_order            integer not null default 0,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint product_categories_name_localized_check
    check (public.is_localized(name_localized)),
  constraint product_categories_description_localized_check
    check (public.is_localized(description_localized))
);

create index product_categories_active_sort_idx
  on public.product_categories (is_active, sort_order);

-- -----------------------------------------------------------------------------
-- 3.3 products
-- -----------------------------------------------------------------------------
create table public.products (
  id                          text primary key default gen_random_uuid()::text,
  category_id                 text not null references public.product_categories (id),
  slug                        text not null unique,
  name_localized              jsonb not null,
  short_description_localized jsonb not null,
  card_description_localized  jsonb not null,
  image_asset_id              text references public.media_assets (id),
  icon_type                   text not null,
  featured                    boolean not null default false,
  sort_order                  integer not null default 0,
  is_active                   boolean not null default true,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  -- icon_type values are derived from the TypeScript ProductIconType union
  -- (components/ProductIcon.tsx) — not guessed.
  constraint products_icon_type_check
    check (icon_type in ('flatbread', 'loaf', 'samoon', 'bun', 'croissant',
                         'croissantLarge', 'puff', 'maamoul', 'date')),
  constraint products_name_localized_check
    check (public.is_localized(name_localized)),
  constraint products_short_description_localized_check
    check (public.is_localized(short_description_localized)),
  constraint products_card_description_localized_check
    check (public.is_localized(card_description_localized))
);

create index products_category_idx on public.products (category_id);
create index products_category_sort_idx on public.products (category_id, sort_order);
create index products_featured_active_idx on public.products (featured)
  where featured and is_active;

-- -----------------------------------------------------------------------------
-- 3.4 product_details (1:1 with products)
-- -----------------------------------------------------------------------------
create table public.product_details (
  id                          text primary key default gen_random_uuid()::text,
  product_id                  text not null unique
                                references public.products (id) on delete cascade,
  positioning_localized       jsonb not null,
  overview_localized          jsonb not null default '[]'::jsonb,
  detail_use_cases_localized  jsonb not null default '[]'::jsonb,
  recipe_options_localized    jsonb not null default '[]'::jsonb,
  disclaimer_localized        jsonb,
  is_active                   boolean not null default true,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  constraint product_details_positioning_localized_check
    check (public.is_localized(positioning_localized)),
  constraint product_details_disclaimer_localized_check
    check (disclaimer_localized is null or public.is_localized(disclaimer_localized)),
  -- the three ordered-list columns must be JSON arrays
  constraint product_details_overview_array_check
    check (jsonb_typeof(overview_localized) = 'array'),
  constraint product_details_use_cases_array_check
    check (jsonb_typeof(detail_use_cases_localized) = 'array'),
  constraint product_details_recipe_options_array_check
    check (jsonb_typeof(recipe_options_localized) = 'array')
);

-- -----------------------------------------------------------------------------
-- 3.5 product_options
-- -----------------------------------------------------------------------------
create table public.product_options (
  id              text primary key default gen_random_uuid()::text,
  product_id      text not null references public.products (id) on delete cascade,
  type            text not null,
  label_localized jsonb not null,
  sort_order      integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint product_options_type_check
    check (type in ('use_case', 'private_label_option', 'variant', 'recipe_option')),
  constraint product_options_label_localized_check
    check (public.is_localized(label_localized))
);

create index product_options_product_type_sort_idx
  on public.product_options (product_id, type, sort_order);

-- -----------------------------------------------------------------------------
-- 3.6 services
-- -----------------------------------------------------------------------------
create table public.services (
  id                        text primary key default gen_random_uuid()::text,
  slug                      text not null unique,
  meta_title_localized      jsonb not null,
  meta_description_localized jsonb not null,
  hero_eyebrow_localized    jsonb not null,
  hero_title_localized      jsonb not null,
  hero_subtitle_localized   jsonb not null,
  cta_json                  jsonb not null,
  sort_order                integer not null default 0,
  is_active                 boolean not null default true,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint services_meta_title_localized_check
    check (public.is_localized(meta_title_localized)),
  constraint services_meta_description_localized_check
    check (public.is_localized(meta_description_localized)),
  constraint services_hero_eyebrow_localized_check
    check (public.is_localized(hero_eyebrow_localized)),
  constraint services_hero_title_localized_check
    check (public.is_localized(hero_title_localized)),
  constraint services_hero_subtitle_localized_check
    check (public.is_localized(hero_subtitle_localized)),
  constraint services_cta_json_object_check
    check (jsonb_typeof(cta_json) = 'object')
);

-- -----------------------------------------------------------------------------
-- 3.7 service_sections
-- -----------------------------------------------------------------------------
create table public.service_sections (
  id                    text primary key default gen_random_uuid()::text,
  service_id            text not null references public.services (id) on delete cascade,
  section_type          text not null,
  title_localized       jsonb,
  eyebrow_localized     jsonb,
  description_localized  jsonb,
  items_json            jsonb not null default '[]'::jsonb,
  sort_order            integer not null default 0,
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint service_sections_section_type_check
    check (section_type in ('intro', 'coverage', 'process', 'audience',
                            'deliverables', 'categories', 'related', 'note')),
  constraint service_sections_title_localized_check
    check (title_localized is null or public.is_localized(title_localized)),
  constraint service_sections_eyebrow_localized_check
    check (eyebrow_localized is null or public.is_localized(eyebrow_localized)),
  constraint service_sections_description_localized_check
    check (description_localized is null or public.is_localized(description_localized)),
  constraint service_sections_items_array_check
    check (jsonb_typeof(items_json) = 'array')
);

create index service_sections_service_sort_idx
  on public.service_sections (service_id, sort_order);

-- -----------------------------------------------------------------------------
-- 3.8 partners
-- -----------------------------------------------------------------------------
create table public.partners (
  id         text primary key default gen_random_uuid()::text,
  slug       text not null unique,
  name       text not null,
  asset_id   text references public.media_assets (id),
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 3.9 partner_projects
-- -----------------------------------------------------------------------------
create table public.partner_projects (
  id                  text primary key default gen_random_uuid()::text,
  partner_id          text not null references public.partners (id) on delete cascade,
  slug                text not null unique,
  title_localized     jsonb not null,
  summary_localized   jsonb not null,
  project_detail_json jsonb not null,
  sort_order          integer not null default 0,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint partner_projects_title_localized_check
    check (public.is_localized(title_localized)),
  constraint partner_projects_summary_localized_check
    check (public.is_localized(summary_localized)),
  constraint partner_projects_detail_object_check
    check (jsonb_typeof(project_detail_json) = 'object')
);

create index partner_projects_partner_idx on public.partner_projects (partner_id);

-- -----------------------------------------------------------------------------
-- 3.10 partner_project_products
-- -----------------------------------------------------------------------------
-- The Phase 1 seed populates only 5 fields (id, partner_project_id, product_id,
-- product_name_localized, sort_order); the richer nullable columns below are
-- ready for a future, fuller import and default empty/needs-data meanwhile.
create table public.partner_project_products (
  id                            text primary key default gen_random_uuid()::text,
  partner_project_id            text not null
                                  references public.partner_projects (id) on delete cascade,
  product_id                    text references public.products (id),
  product_name_localized        jsonb,
  category_localized            jsonb,
  short_description_localized   jsonb,
  key_notes_localized           jsonb not null default '[]'::jsonb,
  nutrition_highlights_localized jsonb not null default '[]'::jsonb,
  image_asset_id                text references public.media_assets (id),
  status                        text not null default 'needs-data',
  sort_order                    integer not null default 0,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now(),
  constraint partner_project_products_status_check
    check (status in ('active', 'planned', 'needs-data')),
  constraint partner_project_products_name_localized_check
    check (product_name_localized is null or public.is_localized(product_name_localized)),
  constraint partner_project_products_category_localized_check
    check (category_localized is null or public.is_localized(category_localized)),
  constraint partner_project_products_short_desc_localized_check
    check (short_description_localized is null or public.is_localized(short_description_localized)),
  constraint partner_project_products_key_notes_array_check
    check (jsonb_typeof(key_notes_localized) = 'array'),
  constraint partner_project_products_nutrition_array_check
    check (jsonb_typeof(nutrition_highlights_localized) = 'array')
);

create index partner_project_products_project_sort_idx
  on public.partner_project_products (partner_project_id, sort_order);
create index partner_project_products_product_idx
  on public.partner_project_products (product_id)
  where product_id is not null;

-- -----------------------------------------------------------------------------
-- 3.11 shared_content (single row, id = 'default')
-- -----------------------------------------------------------------------------
create table public.shared_content (
  id                          text primary key default 'default',
  recipe_disclaimer_localized jsonb not null,
  private_label_points_localized jsonb not null default '[]'::jsonb,
  packaging_options_localized jsonb not null default '[]'::jsonb,
  quality_points_localized    jsonb not null default '[]'::jsonb,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  constraint shared_content_recipe_disclaimer_localized_check
    check (public.is_localized(recipe_disclaimer_localized)),
  constraint shared_content_private_label_array_check
    check (jsonb_typeof(private_label_points_localized) = 'array'),
  constraint shared_content_packaging_array_check
    check (jsonb_typeof(packaging_options_localized) = 'array'),
  constraint shared_content_quality_array_check
    check (jsonb_typeof(quality_points_localized) = 'array')
);

-- -----------------------------------------------------------------------------
-- 3.12 form_enquiries (future lead table — NOT wired to the site in Patch 02)
-- -----------------------------------------------------------------------------
create table public.form_enquiries (
  id                text primary key default gen_random_uuid()::text,
  full_name         text not null,
  company_name      text,
  country           text,
  email             text not null,
  whatsapp          text,
  category          text,
  product           text,
  existing_recipe   boolean not null default false,
  packaging_support boolean not null default false,
  quantity          text,
  target_market     text,
  message           text,
  locale            text not null,
  source_path       text not null,
  status            text not null default 'new',
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_content       text,
  utm_term          text,
  referrer          text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint form_enquiries_locale_check check (locale in ('en', 'ar')),
  constraint form_enquiries_status_check
    check (status in ('new', 'contacted', 'qualified', 'closed', 'spam'))
);

create index form_enquiries_created_at_idx on public.form_enquiries (created_at desc);
create index form_enquiries_status_idx on public.form_enquiries (status);
create index form_enquiries_email_idx on public.form_enquiries (email);
create index form_enquiries_status_created_at_idx
  on public.form_enquiries (status, created_at desc);

-- =============================================================================
-- Task 4 — updated_at triggers (every table has updated_at)
-- =============================================================================
do $$
declare
  t text;
  tables text[] := array[
    'media_assets', 'product_categories', 'products', 'product_details',
    'product_options', 'services', 'service_sections', 'partners',
    'partner_projects', 'partner_project_products', 'shared_content',
    'form_enquiries'
  ];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format(
      'create trigger set_updated_at before update on public.%I '
      || 'for each row execute function public.set_updated_at();', t);
  end loop;
end;
$$;

-- =============================================================================
-- Task 5 — Row Level Security, policies & least-privilege grants
-- =============================================================================
-- RLS is enabled on every table. Anonymous (and authenticated) roles may SELECT
-- only ACTIVE public content; there are NO public write policies and NO policies
-- at all on form_enquiries. The service_role (used only by the trusted import
-- script) bypasses RLS. Dashboard write policies are deferred to a later patch
-- once the Auth/role model is designed.

alter table public.media_assets              enable row level security;
alter table public.product_categories        enable row level security;
alter table public.products                  enable row level security;
alter table public.product_details           enable row level security;
alter table public.product_options           enable row level security;
alter table public.services                  enable row level security;
alter table public.service_sections          enable row level security;
alter table public.partners                  enable row level security;
alter table public.partner_projects          enable row level security;
alter table public.partner_project_products  enable row level security;
alter table public.shared_content            enable row level security;
alter table public.form_enquiries            enable row level security;

-- Explicit least-privilege grants. Start by revoking everything the Supabase
-- default grants may have given anon/authenticated, then grant only SELECT on
-- public-read tables. form_enquiries is granted NOTHING to anon/authenticated.
revoke all on public.media_assets, public.product_categories, public.products,
  public.product_details, public.product_options, public.services,
  public.service_sections, public.partners, public.partner_projects,
  public.partner_project_products, public.shared_content, public.form_enquiries
  from anon, authenticated;

grant select on public.media_assets, public.product_categories, public.products,
  public.product_details, public.product_options, public.services,
  public.service_sections, public.partners, public.partner_projects,
  public.partner_project_products, public.shared_content
  to anon, authenticated;

-- ---- public-read SELECT policies (active content only) ----------------------

create policy media_assets_public_read on public.media_assets
  for select to anon, authenticated
  using (status = 'active');

create policy product_categories_public_read on public.product_categories
  for select to anon, authenticated
  using (is_active);

create policy products_public_read on public.products
  for select to anon, authenticated
  using (is_active);

create policy product_details_public_read on public.product_details
  for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.products p
      where p.id = product_details.product_id and p.is_active
    )
  );

create policy product_options_public_read on public.product_options
  for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.products p
      where p.id = product_options.product_id and p.is_active
    )
  );

create policy services_public_read on public.services
  for select to anon, authenticated
  using (is_active);

create policy service_sections_public_read on public.service_sections
  for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.services s
      where s.id = service_sections.service_id and s.is_active
    )
  );

create policy partners_public_read on public.partners
  for select to anon, authenticated
  using (is_active);

create policy partner_projects_public_read on public.partner_projects
  for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.partners p
      where p.id = partner_projects.partner_id and p.is_active
    )
  );

create policy partner_project_products_public_read on public.partner_project_products
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.partner_projects pj
      join public.partners pt on pt.id = pj.partner_id
      where pj.id = partner_project_products.partner_project_id
        and pj.is_active
        and pt.is_active
    )
  );

create policy shared_content_public_read on public.shared_content
  for select to anon, authenticated
  using (true);

-- form_enquiries: intentionally NO policies for anon/authenticated. With RLS
-- enabled and no permissive policy, those roles can neither read nor write. The
-- future contact API inserts via a trusted server path (service role), which
-- bypasses RLS. No raw IP / fingerprinting columns exist by design.

commit;
