-- =============================================================================
-- Production Patch 04 — durable single-use recovery/invite nonces
-- =============================================================================
-- FORWARD-ONLY migration (does NOT edit P02/P03). Makes the password
-- recovery/invite authorization gate genuinely single-use across browsers and
-- concurrent requests by persisting a one-time nonce and consuming it ATOMICALLY.
--
-- Security properties:
--   * Only a SHA-256 HASH of the nonce is stored — never the raw nonce or the
--     signed gate token.
--   * Each nonce is bound to { auth user id, purpose (recovery|invite), expiry,
--     consumed state }.
--   * RLS is enabled with NO anon/authenticated policies; the table is reached
--     ONLY through narrowly-scoped SECURITY DEFINER RPCs (fixed empty
--     search_path, schema-qualified, EXECUTE granted to `authenticated` only).
--   * No service-role key is used by the application runtime — the RPCs run with
--     definer rights and derive identity from auth.uid().
-- =============================================================================

begin;

create extension if not exists pgcrypto;

create table public.dashboard_auth_flow_nonces (
  nonce_hash  text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  purpose     text not null,
  expires_at  timestamptz not null,
  consumed_at timestamptz,
  created_at  timestamptz not null default now(),
  constraint dashboard_auth_flow_nonces_purpose_check
    check (purpose in ('recovery', 'invite')),
  -- store only a hex SHA-256 digest (64 hex chars); never a raw nonce/token
  constraint dashboard_auth_flow_nonces_hash_check
    check (nonce_hash ~ '^[0-9a-f]{64}$')
);

create index dashboard_auth_flow_nonces_user_idx
  on public.dashboard_auth_flow_nonces (user_id);
create index dashboard_auth_flow_nonces_expires_idx
  on public.dashboard_auth_flow_nonces (expires_at);

alter table public.dashboard_auth_flow_nonces enable row level security;

-- No policies: with RLS enabled and no permissive policy, anon and authenticated
-- have zero direct access. The SECURITY DEFINER RPCs (owned by the table owner)
-- are the only path in. Also revoke any default table privileges.
revoke all on public.dashboard_auth_flow_nonces from anon, authenticated;

-- --- register: create a one-time nonce for the CURRENT auth user -------------
create or replace function public.register_dashboard_flow_nonce(
  p_nonce_hash text,
  p_purpose text,
  p_expires_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  inserted boolean;
begin
  if uid is null then return false; end if;
  if p_purpose not in ('recovery', 'invite') then return false; end if;
  if p_nonce_hash !~ '^[0-9a-f]{64}$' then return false; end if;
  -- Bound the expiry to the gate TTL (15 min) plus a small clock-skew allowance.
  -- Reject already-expired values AND values reaching beyond the intended window,
  -- so a caller cannot mint a long-lived nonce.
  if p_expires_at <= now() or p_expires_at > now() + interval '16 minutes' then
    return false;
  end if;

  -- Insert-only success: true is returned ONLY when a brand-new row is written.
  -- A conflict (hash already exists — whether still pending OR already consumed)
  -- inserts nothing, leaves `inserted` NULL, and yields false. This guarantees an
  -- already-consumed nonce hash can never be treated as freshly registered.
  insert into public.dashboard_auth_flow_nonces (nonce_hash, user_id, purpose, expires_at)
  values (p_nonce_hash, uid, p_purpose, p_expires_at)
  on conflict (nonce_hash) do nothing
  returning true into inserted;

  return coalesce(inserted, false);
end;
$$;

-- --- consume: atomically mark the nonce consumed; true for the ONE winner ----
create or replace function public.consume_dashboard_flow_nonce(
  p_nonce_hash text,
  p_purpose text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  did boolean;
begin
  if uid is null then return false; end if;

  -- The UPDATE row-locks the matching row; under concurrency only the first
  -- transaction sees consumed_at IS NULL, so exactly one call returns true.
  update public.dashboard_auth_flow_nonces
    set consumed_at = now()
    where nonce_hash = p_nonce_hash
      and user_id = uid
      and purpose = p_purpose
      and consumed_at is null
      and expires_at > now()
    returning true into did;

  return coalesce(did, false);
end;
$$;

revoke all on function
  public.register_dashboard_flow_nonce(text, text, timestamptz),
  public.consume_dashboard_flow_nonce(text, text)
  from public;
grant execute on function
  public.register_dashboard_flow_nonce(text, text, timestamptz),
  public.consume_dashboard_flow_nonce(text, text)
  to authenticated;

commit;
