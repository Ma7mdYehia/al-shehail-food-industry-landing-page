-- =============================================================================
-- Production Patch 03 — Dashboard Auth / RBAC foundation
-- =============================================================================
-- FORWARD-ONLY migration layered on top of the P02 database foundation
-- (20260715120000_phase_1_database_foundation.sql). It does NOT edit P02.
--
-- Adds:
--   * public.dashboard_members — the authorization source of truth, linked to
--     auth.users(id). Membership + role, not client metadata, decides access.
--   * SECURITY DEFINER authorization helpers with a fixed empty search_path,
--     schema-qualified objects, and no dynamic SQL. Inactive members resolve to
--     no role. Reading membership inside a definer function avoids recursive RLS.
--   * A transaction-safe trigger protecting the final active owner from being
--     deleted, disabled, or downgraded.
--   * form_enquiries workflow columns (status already exists from P02:
--     internal_notes, assigned_to, handled_at, handled_by).
--   * Per-action (SELECT/INSERT/UPDATE/DELETE) RLS policies + least-privilege
--     grants for every P02 table. The existing public active-content SELECT
--     policies from P02 are PRESERVED (this migration only adds policies).
--
-- Authorization is derived server-side from auth.uid() and the membership row —
-- never from client-supplied role metadata, JWT user_metadata, cookies, or
-- email text alone. anon behavior is unchanged: anon may still SELECT only
-- active public content and has no access to form_enquiries or memberships.
-- =============================================================================

begin;

-- pgcrypto is already present from P02; re-assert defensively (idempotent).
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. dashboard_members — authorization source of truth
-- -----------------------------------------------------------------------------
create table public.dashboard_members (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique references auth.users (id) on delete cascade,
  email        text not null unique,
  display_name text not null,
  role         text not null,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint dashboard_members_role_check check (role in ('owner', 'admin', 'editor')),
  -- emails are stored normalized lowercase; enforce it at the database level
  constraint dashboard_members_email_lower_check check (email = lower(email)),
  constraint dashboard_members_email_format_check check (position('@' in email) > 1)
);

create index dashboard_members_active_role_idx
  on public.dashboard_members (role) where is_active;
create index dashboard_members_is_active_idx
  on public.dashboard_members (is_active);
create index dashboard_members_email_idx
  on public.dashboard_members (email);

drop trigger if exists set_updated_at on public.dashboard_members;
create trigger set_updated_at before update on public.dashboard_members
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 2. Authorization helpers (SECURITY DEFINER, fixed empty search_path)
-- -----------------------------------------------------------------------------
-- These read the membership record for auth.uid(). SECURITY DEFINER lets them
-- read public.dashboard_members while bypassing that table's RLS (the function
-- owner is the table owner), which both avoids leaking the member list to
-- callers and prevents recursive RLS evaluation when the helpers are used
-- inside dashboard_members' own policies. search_path is empty and every object
-- is schema-qualified, so the functions cannot be hijacked via a mutable path.
-- An inactive member (or no membership) resolves to NULL / false.

create or replace function public.current_dashboard_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select dm.role
  from public.dashboard_members dm
  where dm.user_id = auth.uid()
    and dm.is_active
  limit 1;
$$;

create or replace function public.is_dashboard_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_dashboard_role() is not null;
$$;

-- owner OR admin — allowed to hard-DELETE content.
create or replace function public.is_dashboard_content_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_dashboard_role() in ('owner', 'admin');
$$;

-- owner only — allowed to manage dashboard memberships/roles.
create or replace function public.is_dashboard_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_dashboard_role() = 'owner';
$$;

-- Least-privilege EXECUTE: only authenticated sessions evaluate these (via RLS
-- policies). Revoke the default PUBLIC grant; anon never needs them.
revoke all on function
  public.current_dashboard_role(),
  public.is_dashboard_member(),
  public.is_dashboard_content_admin(),
  public.is_dashboard_owner()
  from public;
grant execute on function
  public.current_dashboard_role(),
  public.is_dashboard_member(),
  public.is_dashboard_content_admin(),
  public.is_dashboard_owner()
  to authenticated;

-- -----------------------------------------------------------------------------
-- 3. Final-owner protection (transaction-safe)
-- -----------------------------------------------------------------------------
-- Prevents the last active owner from being deleted, disabled, or downgraded.
-- Locks the other active-owner rows FOR UPDATE so concurrent transactions that
-- would each individually leave one owner cannot both succeed.
create or replace function public.protect_final_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  other_active_owners integer;
begin
  if tg_op = 'DELETE' then
    if old.role = 'owner' and old.is_active then
      -- Lock the OTHER active-owner rows (FOR UPDATE lives in the subquery so it
      -- is not combined with the aggregate), then count them. Locking serializes
      -- concurrent transactions that would each leave a single owner.
      select count(*) into other_active_owners from (
        select id from public.dashboard_members
        where role = 'owner' and is_active and id <> old.id
        for update
      ) locked_owners;
      if other_active_owners = 0 then
        raise exception 'Cannot delete the final active dashboard owner';
      end if;
    end if;
    return old;
  else -- UPDATE
    if old.role = 'owner' and old.is_active
       and (new.role <> 'owner' or new.is_active = false) then
      select count(*) into other_active_owners from (
        select id from public.dashboard_members
        where role = 'owner' and is_active and id <> old.id
        for update
      ) locked_owners;
      if other_active_owners = 0 then
        raise exception 'Cannot downgrade or disable the final active dashboard owner';
      end if;
    end if;
    return new;
  end if;
end;
$$;

drop trigger if exists protect_final_owner on public.dashboard_members;
create trigger protect_final_owner
  before update or delete on public.dashboard_members
  for each row execute function public.protect_final_owner();

-- -----------------------------------------------------------------------------
-- 4. form_enquiries workflow columns (status already exists from P02)
-- -----------------------------------------------------------------------------
alter table public.form_enquiries
  add column internal_notes text,
  add column assigned_to uuid references public.dashboard_members (id) on delete set null,
  add column handled_at timestamptz,
  add column handled_by uuid references public.dashboard_members (id) on delete set null;

-- Audit fields are set together or not at all — never one without the other.
alter table public.form_enquiries
  add constraint form_enquiries_handled_pair_check
  check ((handled_by is null) = (handled_at is null));

-- Server-side audit stamping: when an ACTIVE dashboard member performs a
-- workflow update, the database records who/when from auth.uid() + now(),
-- overriding any client-supplied value. This makes handled_by/handled_at
-- unforgeable (they are also excluded from the authenticated column grant
-- below). Service-role/backend maintenance (no active member for auth.uid())
-- leaves the audit fields untouched, so trusted backends may set them
-- explicitly without the client-identity path.
create or replace function public.stamp_enquiry_handler()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  acting_member uuid;
begin
  select dm.id into acting_member
  from public.dashboard_members dm
  where dm.user_id = auth.uid() and dm.is_active
  limit 1;

  if acting_member is not null then
    new.handled_by := acting_member;
    new.handled_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists stamp_enquiry_handler on public.form_enquiries;
create trigger stamp_enquiry_handler
  before update on public.form_enquiries
  for each row execute function public.stamp_enquiry_handler();

-- =============================================================================
-- 5. RLS + least-privilege grants for the 11 public content tables
-- =============================================================================
-- The P02 public active-content SELECT policies are PRESERVED. Here we ADD, for
-- authenticated dashboard members: read-all (incl. inactive/draft), INSERT,
-- UPDATE (USING + WITH CHECK), and DELETE (owner/admin only — editors get no
-- DELETE policy). Non-member authenticated users match no write policy and are
-- denied. anon matches none of these ('to authenticated') and is unchanged.
do $$
declare
  t text;
  content_tables text[] := array[
    'media_assets', 'product_categories', 'products', 'product_details',
    'product_options', 'services', 'service_sections', 'partners',
    'partner_projects', 'partner_project_products', 'shared_content'
  ];
begin
  foreach t in array content_tables loop
    -- SELECT was already granted to authenticated in P02; add write privileges.
    execute format('grant insert, update, delete on public.%I to authenticated;', t);

    -- dashboard members may read every row (including inactive/draft content).
    execute format('create policy %I on public.%I for select to authenticated using (public.is_dashboard_member());', t || '_dashboard_read', t);

    -- INSERT: any active dashboard member.
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_dashboard_member());', t || '_dashboard_insert', t);

    -- UPDATE always has BOTH using and with check.
    execute format('create policy %I on public.%I for update to authenticated using (public.is_dashboard_member()) with check (public.is_dashboard_member());', t || '_dashboard_update', t);

    -- hard DELETE is owner/admin only; editors have no DELETE policy.
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_dashboard_content_admin());', t || '_dashboard_delete', t);
  end loop;
end;
$$;

-- =============================================================================
-- 6. form_enquiries — dashboard read + workflow-only update
-- =============================================================================
-- anon remains fully locked out (no grant, no policy — unchanged from P02).
-- Dashboard members may SELECT and may UPDATE ONLY the workflow columns. The
-- original submitted contact data is protected by a COLUMN-LEVEL update grant:
-- authenticated may update only these five columns, so an attempt to change
-- full_name/email/message/etc. is rejected by PostgreSQL before RLS even runs.
grant select on public.form_enquiries to authenticated;
-- Column-scoped UPDATE grant: dashboard clients may set ONLY genuine workflow
-- inputs. handled_by/handled_at are intentionally EXCLUDED — they are stamped by
-- the database (stamp_enquiry_handler) from auth.uid(), so they cannot be forged.
-- The original submission columns are likewise excluded and remain immutable.
grant update (status, internal_notes, assigned_to)
  on public.form_enquiries to authenticated;

create policy form_enquiries_dashboard_read on public.form_enquiries
  for select to authenticated
  using (public.is_dashboard_member());

create policy form_enquiries_dashboard_update on public.form_enquiries
  for update to authenticated
  using (public.is_dashboard_member())
  with check (public.is_dashboard_member());

-- No INSERT policy (contact API inserts via the trusted service role) and no
-- DELETE policy for enquiries in this patch.

-- =============================================================================
-- 7. dashboard_members — RLS (members read self, owners manage all)
-- =============================================================================
alter table public.dashboard_members enable row level security;

revoke all on public.dashboard_members from anon, authenticated;
grant select, insert, update, delete on public.dashboard_members to authenticated;

-- A member may read their own row ONLY while active (needed by
-- getCurrentDashboardMember()). An inactive member sees zero rows and therefore
-- has zero dashboard capability.
create policy dashboard_members_self_read on public.dashboard_members
  for select to authenticated
  using (user_id = auth.uid() and is_active);

-- An active owner may read every membership row.
create policy dashboard_members_owner_read on public.dashboard_members
  for select to authenticated
  using (public.is_dashboard_owner());

-- Only an active owner may create/modify/remove memberships. Admins and editors
-- match no write policy here, so they cannot manage members or roles, and no
-- one can self-assign a stronger role. The final-owner trigger further blocks
-- removing the last owner.
create policy dashboard_members_owner_insert on public.dashboard_members
  for insert to authenticated
  with check (public.is_dashboard_owner());

create policy dashboard_members_owner_update on public.dashboard_members
  for update to authenticated
  using (public.is_dashboard_owner())
  with check (public.is_dashboard_owner());

create policy dashboard_members_owner_delete on public.dashboard_members
  for delete to authenticated
  using (public.is_dashboard_owner());

commit;
