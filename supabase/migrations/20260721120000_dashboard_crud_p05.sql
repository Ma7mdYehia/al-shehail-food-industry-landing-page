-- =============================================================================
-- Production Patch 05 — Dashboard content-management support (RPCs only)
-- =============================================================================
-- FORWARD-ONLY migration layered on top of P02 (foundation), P03 (RBAC/RLS) and
-- P04 (auth-flow nonces). It does NOT edit any earlier migration.
--
-- P05 delivers the content-management dashboard UI on top of the EXISTING P03
-- policies and grants. The only database additions it needs are two narrowly
-- scoped SECURITY DEFINER functions that cannot be expressed safely through
-- direct RLS updates:
--
--   1. dashboard_set_member_state(member_id, role, is_active) — the single,
--      owner-only, race-safe entry point for team role/state changes. It layers
--      TWO protections that a plain UPDATE policy cannot enforce atomically:
--        * an owner may never demote or deactivate THEIR OWN membership; and
--        * the final active owner may never be demoted or deactivated
--          (belt-and-braces with the P03 protect_final_owner trigger, but with a
--          generic error and explicit row locking inside one transaction).
--
--   2. dashboard_active_member_count() — returns ONLY an integer count of active
--      members for the overview tile, without exposing the member list to
--      admins/editors (whose RLS otherwise limits them to their own row).
--
-- Both derive identity from auth.uid(), use a fixed empty search_path with
-- schema-qualified objects, are EXECUTE-only for `authenticated` (never anon),
-- and require NO service-role key at runtime. No table, column, policy, or grant
-- from P02/P03 is modified.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Owner-only, race-safe team member state change
-- -----------------------------------------------------------------------------
create or replace function public.dashboard_set_member_state(
  p_member_id uuid,
  p_role text,
  p_is_active boolean
)
returns table (id uuid, role text, is_active boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_caller       uuid := auth.uid();
  v_caller_id    uuid;
  v_caller_role  text;
  v_target_role  text;
  v_target_active boolean;
  v_other_owners integer;
begin
  -- Must be an authenticated session.
  if v_caller is null then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  -- Validate the requested role against the same enum the table CHECK uses.
  if p_role is null or p_role not in ('owner', 'admin', 'editor') then
    raise exception 'invalid role' using errcode = '22023';
  end if;
  if p_member_id is null or p_is_active is null then
    raise exception 'invalid arguments' using errcode = '22023';
  end if;

  -- The caller must be an ACTIVE OWNER. Lock the caller's own row so a
  -- concurrent change to the caller's role/state is serialized against this one.
  select dm.id, dm.role
    into v_caller_id, v_caller_role
  from public.dashboard_members dm
  where dm.user_id = v_caller and dm.is_active
  for update;

  if v_caller_id is null or v_caller_role <> 'owner' then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  -- Lock the target row for the duration of the transaction.
  select dm.role, dm.is_active
    into v_target_role, v_target_active
  from public.dashboard_members dm
  where dm.id = p_member_id
  for update;

  if v_target_role is null then
    raise exception 'member not found' using errcode = 'P0002';
  end if;

  -- Self-protection: an owner cannot demote or deactivate their OWN membership
  -- (avoids an owner accidentally locking themselves out).
  if p_member_id = v_caller_id and (p_is_active = false or p_role <> 'owner') then
    raise exception 'cannot change your own owner status' using errcode = '42501';
  end if;

  -- Final-owner protection: block a change that would remove the last active
  -- owner. Lock the OTHER active-owner rows so two concurrent demotions that
  -- would each leave a single owner cannot both succeed.
  if v_target_role = 'owner' and v_target_active
     and (p_role <> 'owner' or p_is_active = false) then
    select count(*) into v_other_owners from (
      select dm.id from public.dashboard_members dm
      where dm.role = 'owner' and dm.is_active and dm.id <> p_member_id
      for update
    ) locked_owners;
    if v_other_owners = 0 then
      raise exception 'cannot demote or deactivate the final active owner'
        using errcode = '42501';
    end if;
  end if;

  update public.dashboard_members dm
    set role = p_role, is_active = p_is_active
  where dm.id = p_member_id;

  return query
    select dm.id, dm.role, dm.is_active
    from public.dashboard_members dm
    where dm.id = p_member_id;
end;
$$;

revoke all on function public.dashboard_set_member_state(uuid, text, boolean) from public;
grant execute on function public.dashboard_set_member_state(uuid, text, boolean) to authenticated;

-- -----------------------------------------------------------------------------
-- 2. Safe active-member count for the overview tile
-- -----------------------------------------------------------------------------
-- Returns ONLY a count, and only to active members. It does not expose any
-- membership rows, so admins/editors (whose RLS limits them to their own row)
-- get an accurate total without seeing the member list.
create or replace function public.dashboard_active_member_count()
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  if not public.is_dashboard_member() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  select count(*)::integer into v_count
  from public.dashboard_members dm
  where dm.is_active;
  return coalesce(v_count, 0);
end;
$$;

revoke all on function public.dashboard_active_member_count() from public;
grant execute on function public.dashboard_active_member_count() to authenticated;

-- -----------------------------------------------------------------------------
-- 3. Assignable members for the enquiry workflow
-- -----------------------------------------------------------------------------
-- Enquiries can be assigned to any ACTIVE dashboard member, but non-owners can
-- only self-read the membership table under RLS. This returns the minimal
-- (id, display_name) pairs an active member needs to populate an assignee
-- picker — no email, role, or state — without widening the RLS read surface.
create or replace function public.dashboard_assignable_members()
returns table (id uuid, display_name text)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_dashboard_member() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  return query
    select dm.id, dm.display_name
    from public.dashboard_members dm
    where dm.is_active
    order by dm.display_name;
end;
$$;

revoke all on function public.dashboard_assignable_members() from public;
grant execute on function public.dashboard_assignable_members() to authenticated;

commit;
