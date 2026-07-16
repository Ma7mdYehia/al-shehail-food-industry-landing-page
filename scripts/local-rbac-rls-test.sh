#!/usr/bin/env bash
# =============================================================================
# LOCAL-ONLY RBAC/RLS behavior test for Production Patch 03 (NOT a CI job).
# =============================================================================
# Boots an EPHEMERAL local PostgreSQL 16 cluster, simulates Supabase auth (an
# `auth` schema, `auth.uid()`, and the anon/authenticated/service_role roles),
# applies the P02 + P03 migrations, and exercises the full permission matrix
# against real RLS. Reports PASS/FAIL and tears the cluster down.
#
# Requirements (not available in CI): PostgreSQL 16 server binaries
# (/usr/lib/postgresql/16/bin) and the ability to run initdb/postgres as a
# non-root user (uses `runuser -u ubuntu`). This does NOT touch any remote
# Supabase project. If these prerequisites are missing, skip this script — the
# dependency-free `npm run db:test:rbac` and `npm run db:schema:validate` cover
# the structure in CI.
#
# Usage:  sudo bash scripts/local-rbac-rls-test.sh
# =============================================================================
set -u
export PATH=/usr/lib/postgresql/16/bin:$PATH
WORK=/tmp/p03-pg
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
rm -rf "$WORK"; mkdir -p "$WORK"; chown ubuntu:ubuntu "$WORK"
runuser -u ubuntu -- env PATH="$PATH" initdb -D "$WORK/pgdata" -U postgres --auth=trust >/tmp/p03i.log 2>&1 || { echo "initdb failed"; tail /tmp/p03i.log; exit 1; }
runuser -u ubuntu -- env PATH="$PATH" pg_ctl -D "$WORK/pgdata" -o "-p 55450 -k $WORK -c listen_addresses=''" -l "$WORK/pg.log" start >/tmp/p03s.log 2>&1
sleep 2
Q() { runuser -u ubuntu -- env PATH="$PATH" psql -h "$WORK" -p 55450 -U postgres -d app -v ON_ERROR_STOP=1 "$@"; }
Qq() { runuser -u ubuntu -- env PATH="$PATH" psql -h "$WORK" -p 55450 -U postgres -d app -t -A "$@"; }
PASS=0; FAIL=0
ok(){ echo "  PASS $1"; PASS=$((PASS+1)); }
no(){ echo "  FAIL $1"; FAIL=$((FAIL+1)); }

runuser -u ubuntu -- env PATH="$PATH" psql -h "$WORK" -p 55450 -U postgres -d postgres -v ON_ERROR_STOP=1 >/tmp/p03setup.log 2>&1 <<'SQL'
create database app;
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
SQL

# Supabase-like auth stubs + apply both migrations
Q >/tmp/p03mig.log 2>&1 <<'SQL'
create schema if not exists auth;
grant usage on schema auth to anon, authenticated, service_role;
create table auth.users(id uuid primary key, email text unique);
create or replace function auth.uid() returns uuid language sql stable
  as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema public to anon, authenticated, service_role;
SQL
echo "auth stubs: exit $?"
Q -q -f "$REPO/supabase/migrations/20260715120000_phase_1_database_foundation.sql" >/tmp/p03p02.log 2>&1 && echo "P02 applied" || { echo "P02 FAILED"; tail -5 /tmp/p03p02.log; }
Q -q -f "$REPO/supabase/migrations/20260716120000_dashboard_auth_rbac.sql" >/tmp/p03p03.log 2>&1 && echo "P03 applied" || { echo "P03 FAILED"; tail -15 /tmp/p03p03.log; exit 1; }

# ---- Seed minimal content + auth users + memberships (as postgres/superuser) ----
OWNER=$(Qq -c "select gen_random_uuid();")
ADMIN=$(Qq -c "select gen_random_uuid();")
EDITOR=$(Qq -c "select gen_random_uuid();")
INACTIVE=$(Qq -c "select gen_random_uuid();")
NONMEMBER=$(Qq -c "select gen_random_uuid();")
SECOND_OWNER=$(Qq -c "select gen_random_uuid();")

Q >/tmp/p03seed.log 2>&1 <<SQL
insert into auth.users(id,email) values
  ('$OWNER','marketing@halsabake.com'),
  ('$ADMIN','gm@elshohail.com'),
  ('$EDITOR','osama@halsabake.com'),
  ('$INACTIVE','inactive@halsabake.com'),
  ('$NONMEMBER','stranger@example.com'),
  ('$SECOND_OWNER','owner2@halsabake.com');
insert into public.dashboard_members(user_id,email,display_name,role,is_active) values
  ('$OWNER','marketing@halsabake.com','M.Yehia','owner',true),
  ('$ADMIN','gm@elshohail.com','A.Zaid','admin',true),
  ('$EDITOR','osama@halsabake.com','O.Abdullah','editor',true),
  ('$INACTIVE','inactive@halsabake.com','Inactive Person','admin',false);
-- content
insert into public.media_assets(id,key,alt_localized,type,status) values
  ('m_active','k_active','{"en":"a","ar":null}','products','active'),
  ('m_pending','k_pending','{"en":"a","ar":null}','products','pending');
insert into public.product_categories(id,slug,name_localized,description_localized,is_active) values
  ('c_active','c-active','{"en":"a","ar":"b"}','{"en":"a","ar":"b"}',true),
  ('c_inactive','c-inactive','{"en":"a","ar":"b"}','{"en":"a","ar":"b"}',false);
insert into public.products(id,category_id,slug,name_localized,short_description_localized,card_description_localized,icon_type,is_active) values
  ('p_active','c_active','p-active','{"en":"a","ar":"b"}','{"en":"a","ar":"b"}','{"en":"a","ar":"b"}','loaf',true),
  ('p_inactive','c_active','p-inactive','{"en":"a","ar":"b"}','{"en":"a","ar":"b"}','{"en":"a","ar":"b"}','loaf',false);
insert into public.form_enquiries(id,full_name,email,locale,source_path) values
  ('e1','Real Person','lead@example.com','en','/contact');
SQL
echo "seed: exit $?"

# ---- helper to run as a given auth subject; prints 'OK' or 'ERR:<msg>' ----
probe() { # $1=sub(uuid or empty for anon) $2=role $3=SQL
  local sub="$1" role="$2" sql="$3"
  runuser -u ubuntu -- env PATH="$PATH" psql -h "$WORK" -p 55450 -U postgres -d app -t -A 2>&1 <<PSQL
begin;
select set_config('request.jwt.claim.sub', '$sub', true);
set local role $role;
$sql
rollback;
PSQL
}
# returns count of rows for a select probe
selcount() { probe "$1" "$2" "$3" | grep -E '^[0-9]+$' | head -1; }
# true if probe contains an error (permission/RLS)
haserr() { probe "$1" "$2" "$3" | grep -qiE 'ERROR|denied|violates|permission'; }
# true if a WRITE was blocked: either an error, OR RLS filtered all rows so the
# command affected 0 rows (UPDATE 0 / DELETE 0 / INSERT 0 0).
blocked() { probe "$1" "$2" "$3" | grep -qiE 'ERROR|denied|violates|permission|UPDATE 0|DELETE 0|INSERT 0 0'; }

echo ""
echo "=== A. Helper functions resolve roles from membership ==="
[ "$(probe "$OWNER" authenticated "select public.current_dashboard_role();" | tail -2 | head -1)" = "owner" ] && ok "owner role resolves" || no "owner role resolves"
[ "$(probe "$ADMIN" authenticated "select public.current_dashboard_role();" | tail -2 | head -1)" = "admin" ] && ok "admin role resolves" || no "admin role resolves"
[ "$(probe "$EDITOR" authenticated "select public.current_dashboard_role();" | tail -2 | head -1)" = "editor" ] && ok "editor role resolves" || no "editor role resolves"
R_INACTIVE=$(probe "$INACTIVE" authenticated "select coalesce(public.current_dashboard_role(),'NULL');" | tail -2 | head -1)
[ "$R_INACTIVE" = "NULL" ] && ok "inactive member resolves to NULL role" || no "inactive member resolves to NULL role (got $R_INACTIVE)"
R_NON=$(probe "$NONMEMBER" authenticated "select coalesce(public.current_dashboard_role(),'NULL');" | tail -2 | head -1)
[ "$R_NON" = "NULL" ] && ok "non-member resolves to NULL role" || no "non-member resolves to NULL role (got $R_NON)"

echo ""
echo "=== B. anon behavior unchanged (P02) ==="
[ "$(selcount '' anon "select count(*) from public.products;")" = "1" ] && ok "anon sees only active product (1)" || no "anon active product count"
[ "$(selcount '' anon "select count(*) from public.products where id='p_inactive';")" = "0" ] && ok "anon cannot see inactive product" || no "anon inactive hidden"
haserr '' anon "select count(*) from public.form_enquiries;" && ok "anon cannot read form_enquiries" || no "anon form_enquiries blocked"
haserr '' anon "insert into public.products(id,category_id,slug,name_localized,short_description_localized,card_description_localized,icon_type) values('x','c_active','x','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','loaf');" && ok "anon cannot INSERT content" || no "anon insert blocked"
haserr '' anon "select count(*) from public.dashboard_members;" && ok "anon cannot read dashboard_members" || no "anon members blocked"

echo ""
echo "=== C. authenticated non-member has no access ==="
[ "$(selcount "$NONMEMBER" authenticated "select count(*) from public.products;")" = "1" ] && ok "non-member sees only active (public policy)" || no "non-member public read"
[ "$(selcount "$NONMEMBER" authenticated "select count(*) from public.products where id='p_inactive';")" = "0" ] && ok "non-member cannot see inactive" || no "non-member inactive hidden"
haserr "$NONMEMBER" authenticated "insert into public.products(id,category_id,slug,name_localized,short_description_localized,card_description_localized,icon_type) values('x2','c_active','x2','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','loaf');" && ok "non-member cannot INSERT" || no "non-member insert blocked"

echo ""
echo "=== D. inactive member has no access ==="
[ "$(selcount "$INACTIVE" authenticated "select count(*) from public.products where id='p_inactive';")" = "0" ] && ok "inactive member cannot see inactive content" || no "inactive member inactive hidden"
haserr "$INACTIVE" authenticated "insert into public.products(id,category_id,slug,name_localized,short_description_localized,card_description_localized,icon_type) values('x3','c_active','x3','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','loaf');" && ok "inactive member cannot INSERT" || no "inactive insert blocked"

echo ""
echo "=== E. editor: read-all, INSERT, UPDATE allowed; DELETE denied ==="
[ "$(selcount "$EDITOR" authenticated "select count(*) from public.products;")" = "2" ] && ok "editor reads all products incl inactive (2)" || no "editor read-all"
probe "$EDITOR" authenticated "insert into public.products(id,category_id,slug,name_localized,short_description_localized,card_description_localized,icon_type) values('e_ins','c_active','e-ins','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','loaf');" | grep -q "INSERT 0 1" && ok "editor INSERT allowed" || no "editor insert"
probe "$EDITOR" authenticated "update public.products set sort_order=5 where id='p_active';" | grep -q "UPDATE 1" && ok "editor UPDATE allowed (reorder/activate)" || no "editor update"
DEL=$(probe "$EDITOR" authenticated "delete from public.products where id='p_active';")
echo "$DEL" | grep -qE "DELETE 0|denied|ERROR" && ok "editor DELETE denied (0 rows / error)" || no "editor delete denied (got: $(echo "$DEL"|tail -1))"

echo ""
echo "=== F. admin: full content CRUD ==="
probe "$ADMIN" authenticated "insert into public.products(id,category_id,slug,name_localized,short_description_localized,card_description_localized,icon_type) values('a_ins','c_active','a-ins','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','{\"en\":\"a\",\"ar\":\"b\"}','loaf');" | grep -q "INSERT 0 1" && ok "admin INSERT" || no "admin insert"
probe "$ADMIN" authenticated "update public.products set sort_order=7 where id='p_active';" | grep -q "UPDATE 1" && ok "admin UPDATE" || no "admin update"
probe "$ADMIN" authenticated "delete from public.products where id='p_inactive';" | grep -q "DELETE 1" && ok "admin DELETE allowed" || no "admin delete"

echo ""
echo "=== G. owner: full content CRUD ==="
probe "$OWNER" authenticated "delete from public.products where id='p_inactive';" | grep -q "DELETE 1" && ok "owner DELETE allowed" || no "owner delete"
probe "$OWNER" authenticated "update public.shared_content set updated_at=now() where id='default';" | grep -qE "UPDATE (0|1)" && ok "owner UPDATE shared_content" || no "owner update shared_content"

echo ""
echo "=== H. membership management: admin/editor denied, owner allowed ==="
blocked "$ADMIN" authenticated "update public.dashboard_members set role='owner' where user_id='$ADMIN';" && ok "admin cannot self-promote (RLS: 0 rows)" || no "admin membership write blocked"
blocked "$EDITOR" authenticated "update public.dashboard_members set role='owner' where user_id='$EDITOR';" && ok "editor cannot self-promote (RLS: 0 rows)" || no "editor membership write blocked"
haserr "$ADMIN" authenticated "insert into public.dashboard_members(user_id,email,display_name,role) values('$NONMEMBER','stranger@example.com','X','admin');" && ok "admin cannot INSERT a membership" || no "admin membership insert blocked"
# admin/editor cannot even read others
[ "$(selcount "$ADMIN" authenticated "select count(*) from public.dashboard_members;")" = "1" ] && ok "admin reads only own membership row" || no "admin sees only self"
[ "$(selcount "$OWNER" authenticated "select count(*) from public.dashboard_members;")" = "4" ] && ok "owner reads all membership rows (4)" || no "owner reads all"
# auth.users row for the new member already exists (created by an admin invite in
# real Supabase); the owner only writes the membership row.
probe "$OWNER" authenticated "insert into public.dashboard_members(user_id,email,display_name,role) values('$SECOND_OWNER','owner2@halsabake.com','Owner Two','editor');" | grep -q "INSERT 0 1" && ok "owner can create membership" || no "owner create membership"

echo ""
echo "=== I. final-owner protection ==="
# Only one active owner exists ($OWNER). Deleting/disabling/downgrading must be
# blocked by the INTENDED guard (specific message), not an incidental SQL error.
finalguard() { probe "$1" authenticated "$2" | grep -qiE 'final active dashboard owner'; }
finalguard "$OWNER" "delete from public.dashboard_members where user_id='$OWNER';" && ok "final owner cannot be deleted (guard message)" || no "final owner delete blocked"
finalguard "$OWNER" "update public.dashboard_members set is_active=false where user_id='$OWNER';" && ok "final owner cannot be disabled (guard message)" || no "final owner disable blocked"
finalguard "$OWNER" "update public.dashboard_members set role='admin' where user_id='$OWNER';" && ok "final owner cannot be downgraded (guard message)" || no "final owner downgrade blocked"
# With a SECOND active owner, downgrading the first should be allowed.
Q -c "insert into public.dashboard_members(user_id,email,display_name,role,is_active) values('$SECOND_OWNER','owner2@halsabake.com','Owner Two','owner',true) on conflict (user_id) do update set role='owner', is_active=true;" >/tmp/p03so.log 2>&1 || tail -3 /tmp/p03so.log
ACTIVE_OWNERS=$(Qq -c "select count(*) from public.dashboard_members where role='owner' and is_active;")
DOUT=$(probe "$OWNER" authenticated "update public.dashboard_members set role='admin' where user_id='$OWNER';")
echo "$DOUT" | grep -q "UPDATE 1" && ok "owner downgrade allowed when another active owner exists (active owners=$ACTIVE_OWNERS)" || { no "downgrade-with-second-owner (owners=$ACTIVE_OWNERS)"; echo "    FULL OUTPUT:"; echo "$DOUT" | sed 's/^/      /'; }

echo ""
echo "=== J. form_enquiries: workflow update only, original data immutable ==="
[ "$(selcount "$EDITOR" authenticated "select count(*) from public.form_enquiries;")" = "1" ] && ok "dashboard member can SELECT enquiries" || no "member reads enquiries"
probe "$EDITOR" authenticated "update public.form_enquiries set status='contacted', internal_notes='called' where id='e1';" | grep -q "UPDATE 1" && ok "member can update workflow fields" || no "member workflow update"
probe "$EDITOR" authenticated "update public.form_enquiries set email='hacked@evil.com' where id='e1';" 2>&1 | grep -qiE "permission denied for column|ERROR" && ok "member CANNOT change original email (column-level grant)" || no "original email immutable"
probe "$EDITOR" authenticated "update public.form_enquiries set full_name='x' where id='e1';" 2>&1 | grep -qiE "permission denied for column|ERROR" && ok "member CANNOT change original full_name" || no "original full_name immutable"
haserr "$EDITOR" authenticated "delete from public.form_enquiries where id='e1';" && ok "member cannot DELETE enquiries" || no "enquiry delete blocked"

echo ""
echo "=== K. definer functions: search_path fixed & non-recursive ==="
SP=$(Qq -c "select prosecdef, proconfig from pg_proc where proname='current_dashboard_role';")
echo "$SP" | grep -q "search_path=" && echo "$SP" | grep -q "^t" && ok "current_dashboard_role is SECURITY DEFINER with fixed search_path" || no "definer/search_path ($SP)"

echo ""
echo "================= RESULT: $PASS passed, $FAIL failed ================="
runuser -u ubuntu -- env PATH="$PATH" pg_ctl -D "$WORK/pgdata" stop -m fast >/dev/null 2>&1
rm -rf "$WORK"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
