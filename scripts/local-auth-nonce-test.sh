#!/usr/bin/env bash
# =============================================================================
# LOCAL-ONLY real-PostgreSQL test for the durable single-use recovery/invite
# nonce (Production Patch 04). NOT a CI job.
# =============================================================================
# Boots an ephemeral PostgreSQL 16 cluster with Supabase-like auth (auth schema,
# auth.uid(), anon/authenticated/service_role roles), applies the P02+P03+P04
# migrations, and exercises the register/consume RPCs — including a genuine
# PARALLEL reuse race — proving the gate is single-use. Requires the PostgreSQL
# 16 server binaries and the ability to run as a non-root user (runuser ubuntu).
# Does not touch any remote project.
#   Usage: sudo bash scripts/local-auth-nonce-test.sh
# =============================================================================
set -u
export PATH=/usr/lib/postgresql/16/bin:$PATH
WORK=/tmp/p04-nonce
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT=55470
rm -rf "$WORK"; mkdir -p "$WORK"; chown ubuntu:ubuntu "$WORK"
runuser -u ubuntu -- env PATH="$PATH" initdb -D "$WORK/pgdata" -U postgres --auth=trust >/tmp/nonce-init.log 2>&1 || { echo "initdb failed"; tail /tmp/nonce-init.log; exit 1; }
runuser -u ubuntu -- env PATH="$PATH" pg_ctl -D "$WORK/pgdata" -o "-p $PORT -k $WORK -c listen_addresses=''" -l "$WORK/pg.log" start >/tmp/nonce-start.log 2>&1
sleep 2
PSQL() { runuser -u ubuntu -- env PATH="$PATH" psql -h "$WORK" -p "$PORT" -U postgres -d app -t -A "$@"; }
PASS=0; FAIL=0
ok(){ echo "  PASS $1"; PASS=$((PASS+1)); }
no(){ echo "  FAIL $1"; FAIL=$((FAIL+1)); }

runuser -u ubuntu -- env PATH="$PATH" psql -h "$WORK" -p "$PORT" -U postgres -d postgres -q -v ON_ERROR_STOP=1 >/tmp/nonce-setup.log 2>&1 <<'SQL'
create database app;
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
SQL

PSQL -q -v ON_ERROR_STOP=1 >/tmp/nonce-auth.log 2>&1 <<'SQL'
create schema auth;
grant usage on schema auth to anon, authenticated, service_role;
create table auth.users(id uuid primary key, email text unique);
create or replace function auth.uid() returns uuid language sql stable
  as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema public to anon, authenticated, service_role;
SQL

for m in 20260715120000_phase_1_database_foundation 20260716120000_dashboard_auth_rbac 20260719120000_dashboard_auth_flow_nonces; do
  PSQL -q -v ON_ERROR_STOP=1 -f "$REPO/supabase/migrations/$m.sql" >/tmp/nonce-$m.log 2>&1 && echo "applied $m" || { echo "FAILED $m"; tail -15 /tmp/nonce-$m.log; exit 1; }
done

U1=$(PSQL -c "select gen_random_uuid();")
U2=$(PSQL -c "select gen_random_uuid();")
PSQL -q -c "insert into auth.users(id,email) values('$U1','u1@example.invalid'),('$U2','u2@example.invalid');" >/dev/null

# helper: run a statement as an authenticated user with a jwt sub
as_user() { # $1=sub $2=sql
  PSQL -c "begin; set local role authenticated; select set_config('request.jwt.claim.sub','$1',true); $2; rollback;" 2>&1
}
# non-rollback variant (persist)
as_user_commit() { PSQL -c "begin; set local role authenticated; select set_config('request.jwt.claim.sub','$1',true); $2; commit;" 2>&1; }

# deterministic hashes (sha256 hex) computed in-DB to mirror the app
HASH=$(PSQL -c "select encode(digest('nonce-one','sha256'),'hex');")
HASH2=$(PSQL -c "select encode(digest('nonce-two','sha256'),'hex');")

echo ""
echo "=== A. register + first/second consume (single-use) ==="
R=$(as_user_commit "$U1" "select public.register_dashboard_flow_nonce('$HASH','recovery', now()+interval '15 min') as r" | grep -E '^(t|f)$' | tail -1)
[ "$R" = "t" ] && ok "register returns true" || no "register ($R)"
C1=$(as_user_commit "$U1" "select public.consume_dashboard_flow_nonce('$HASH','recovery') as c" | grep -E '^(t|f)$' | tail -1)
[ "$C1" = "t" ] && ok "first consume succeeds" || no "first consume ($C1)"
C2=$(as_user_commit "$U1" "select public.consume_dashboard_flow_nonce('$HASH','recovery') as c" | grep -E '^(t|f)$' | tail -1)
[ "$C2" = "f" ] && ok "second use of the same token fails" || no "second consume ($C2)"

echo ""
echo "=== B. cross-user + wrong-hash + wrong-purpose ==="
as_user_commit "$U1" "select public.register_dashboard_flow_nonce('$HASH2','recovery', now()+interval '15 min')" >/dev/null
CX=$(as_user_commit "$U2" "select public.consume_dashboard_flow_nonce('$HASH2','recovery') as c" | grep -E '^(t|f)$' | tail -1)
[ "$CX" = "f" ] && ok "cross-user consume fails" || no "cross-user ($CX)"
CW=$(as_user_commit "$U1" "select public.consume_dashboard_flow_nonce(encode(digest('does-not-exist','sha256'),'hex'),'recovery') as c" | grep -E '^(t|f)$' | tail -1)
[ "$CW" = "f" ] && ok "wrong/forged hash fails" || no "wrong-hash ($CW)"
CP=$(as_user_commit "$U1" "select public.consume_dashboard_flow_nonce('$HASH2','invite') as c" | grep -E '^(t|f)$' | tail -1)
[ "$CP" = "f" ] && ok "wrong purpose fails" || no "wrong-purpose ($CP)"
# consume the still-valid HASH2 as U1/recovery to clean state
as_user_commit "$U1" "select public.consume_dashboard_flow_nonce('$HASH2','recovery')" >/dev/null

echo ""
echo "=== C. expired nonce ==="
# insert an already-expired, unconsumed nonce directly, then attempt consume
EHASH=$(PSQL -c "select encode(digest('expired-one','sha256'),'hex');")
PSQL -q -c "insert into public.dashboard_auth_flow_nonces(nonce_hash,user_id,purpose,expires_at) values('$EHASH','$U1','recovery', now()-interval '1 min');" >/dev/null
CE=$(as_user_commit "$U1" "select public.consume_dashboard_flow_nonce('$EHASH','recovery') as c" | grep -E '^(t|f)$' | tail -1)
[ "$CE" = "f" ] && ok "expired nonce fails" || no "expired ($CE)"
# register also rejects a past expiry
RE=$(as_user_commit "$U1" "select public.register_dashboard_flow_nonce(encode(digest('past','sha256'),'hex'),'recovery', now()-interval '1 min') as r" | grep -E '^(t|f)$' | tail -1)
[ "$RE" = "f" ] && ok "register rejects past expiry" || no "register-past ($RE)"

echo ""
echo "=== D. concurrent reuse → exactly one success ==="
CHASH=$(PSQL -c "select encode(digest('race-one','sha256'),'hex');")
as_user_commit "$U1" "select public.register_dashboard_flow_nonce('$CHASH','recovery', now()+interval '15 min')" >/dev/null
cat > "$WORK/consume.sql" <<SQL
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','$U1',true);
select public.consume_dashboard_flow_nonce('$CHASH','recovery') as consumed;
commit;
SQL
chown ubuntu:ubuntu "$WORK/consume.sql"
export PATH WORK PORT
run_one() { runuser -u ubuntu -- env PATH="$PATH" psql -h "$WORK" -p "$PORT" -U postgres -d app -t -A -f "$WORK/consume.sql" 2>/dev/null | grep -E '^(t|f)$' | tail -1; }
export -f run_one
WINS=$(seq 1 30 | xargs -P 30 -I{} bash -c 'run_one' | grep -c '^t$')
[ "$WINS" = "1" ] && ok "exactly one concurrent consume succeeded (of 30)" || no "concurrent winners=$WINS (expected 1)"

echo ""
echo "=== E. no raw nonce/token stored; only 64-hex hash ==="
COLS=$(PSQL -c "select string_agg(column_name,',' order by column_name) from information_schema.columns where table_name='dashboard_auth_flow_nonces';")
echo "  columns: $COLS"
echo "$COLS" | grep -qiE "nonce_hash" && ! echo "$COLS" | grep -qiE "(^|,)(nonce|token|raw)(,|$)" && ok "no raw nonce/token column (hash only)" || no "unexpected columns ($COLS)"
BADHASH=$(PSQL -c "select count(*) from public.dashboard_auth_flow_nonces where nonce_hash !~ '^[0-9a-f]{64}\$';")
[ "$BADHASH" = "0" ] && ok "every stored value is a 64-hex SHA-256 digest" || no "non-hash values present ($BADHASH)"

echo ""
echo "=== F. RLS: anon/authenticated have no direct table access ==="
AN=$(PSQL -c "begin; set local role anon; select count(*) from public.dashboard_auth_flow_nonces; rollback;" 2>&1 | grep -ciE 'permission denied|denied')
[ "$AN" -ge 1 ] && ok "anon cannot read the nonce table" || no "anon table access not denied"
AU=$(PSQL -c "begin; set local role authenticated; select count(*) from public.dashboard_auth_flow_nonces; rollback;" 2>&1 | grep -ciE 'permission denied|denied')
[ "$AU" -ge 1 ] && ok "authenticated cannot read the nonce table directly (RPC-only)" || no "authenticated direct access not denied"

echo ""
echo "=== G. functions are SECURITY DEFINER with fixed search_path ==="
DEF=$(PSQL -c "select count(*) from pg_proc where proname in ('register_dashboard_flow_nonce','consume_dashboard_flow_nonce') and prosecdef and array_to_string(proconfig,',') like '%search_path=%';")
[ "$DEF" = "2" ] && ok "both RPCs are SECURITY DEFINER + fixed search_path" || no "definer/search_path count=$DEF"

echo ""
echo "================= RESULT: $PASS passed, $FAIL failed ================="
runuser -u ubuntu -- env PATH="$PATH" pg_ctl -D "$WORK/pgdata" stop -m fast >/dev/null 2>&1
rm -rf "$WORK"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
