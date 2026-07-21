#!/usr/bin/env node
// =============================================================================
// P04 durable single-use nonce — real PostgreSQL integration test (portable).
// =============================================================================
// Connects to `DATABASE_URL` (a PostgreSQL 16 instance — e.g. a CI service
// container), applies the P02+P03+P04 migrations with Supabase-like auth stubs,
// and proves the register/consume RPCs are single-use, atomic under CONCURRENCY,
// expiry/ownership-bounded, hash-only, and RLS-locked. No hardcoded paths or
// `runuser`; runs on GitHub Actions or any dev machine with a Postgres URL.
//
//   DATABASE_URL=postgres://user:pass@host:5432/db node scripts/test-auth-nonce.mjs
// =============================================================================

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import pg from "pg";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const MIGRATIONS = join(ROOT, "supabase", "migrations");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✖ DATABASE_URL is required (a PostgreSQL 16 connection string).");
  console.error("  In CI a postgres:16 service container supplies it; locally, point it");
  console.error("  at any disposable Postgres 16 instance.");
  process.exit(1);
}

let failures = 0;
function ok(name, detail = "") {
  console.log(`  ✓ ${name}${detail ? " — " + detail : ""}`);
}
function bad(name, detail = "") {
  failures++;
  console.log(`  ✗ ${name}${detail ? " — " + detail : ""}`);
}
function expect(name, cond, detail = "") {
  cond ? ok(name, detail) : bad(name, detail);
}

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

// Run a statement AS an authenticated user with a JWT sub (like Supabase). Each
// call uses its own connection + transaction so the concurrency test is real.
async function asUser(sub, text, params = []) {
  const c = new pg.Client({ connectionString: url });
  await c.connect();
  try {
    await c.query("begin");
    await c.query("select set_config('request.jwt.claim.sub', $1, true)", [sub]);
    await c.query("set local role authenticated");
    const r = await c.query(text, params);
    await c.query("commit");
    return r;
  } finally {
    await c.end();
  }
}

async function main() {
  const admin = new pg.Client({ connectionString: url });
  await admin.connect();

  // --- Supabase-like roles + auth stubs (idempotent) ---
  for (const role of ["anon", "authenticated"]) {
    await admin.query(
      `do $$ begin create role ${role} nologin; exception when duplicate_object then null; end $$;`
    );
  }
  await admin.query(
    `do $$ begin create role service_role nologin bypassrls; exception when duplicate_object then null; end $$;`
  );
  await admin.query("create schema if not exists auth");
  await admin.query("grant usage on schema auth to anon, authenticated, service_role");
  await admin.query(
    "create table if not exists auth.users (id uuid primary key, email text unique)"
  );
  await admin.query(
    "create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$"
  );
  await admin.query("grant usage on schema public to anon, authenticated, service_role");

  // --- apply migrations in order ---
  for (const file of [
    "20260715120000_phase_1_database_foundation.sql",
    "20260716120000_dashboard_auth_rbac.sql",
    "20260719120000_dashboard_auth_flow_nonces.sql",
  ]) {
    await admin.query(readFileSync(join(MIGRATIONS, file), "utf8"));
  }
  console.log("Applied P02+P03+P04 migrations.\n");

  // --- test users ---
  const { rows: u1 } = await admin.query("select gen_random_uuid() id");
  const { rows: u2 } = await admin.query("select gen_random_uuid() id");
  const U1 = u1[0].id;
  const U2 = u2[0].id;
  await admin.query("insert into auth.users(id,email) values ($1,'u1@example.invalid'),($2,'u2@example.invalid')", [U1, U2]);

  const REG = "select public.register_dashboard_flow_nonce($1,$2,$3) as r";
  const CON = "select public.consume_dashboard_flow_nonce($1,$2) as c";
  const in15 = "now() + interval '15 minutes'";

  console.log("A. Register boundary:");
  const h1 = sha256("nonce-" + U1 + "-1");
  expect("valid 15-minute expiry accepted", (await asUser(U1, `select public.register_dashboard_flow_nonce($1,$2, ${in15}) as r`, [h1, "recovery"])).rows[0].r === true);
  expect("duplicate registration rejected (insert-only true)", (await asUser(U1, `select public.register_dashboard_flow_nonce($1,$2, ${in15}) as r`, [h1, "recovery"])).rows[0].r === false);
  expect("far-future expiry rejected (> TTL+skew)", (await asUser(U1, REG, [sha256("far"), "recovery", new Date(Date.now() + 60 * 60 * 1000).toISOString()])).rows[0].r === false);
  expect("past expiry rejected", (await asUser(U1, REG, [sha256("past"), "recovery", new Date(Date.now() - 60 * 1000).toISOString()])).rows[0].r === false);
  expect("bad purpose rejected", (await asUser(U1, `select public.register_dashboard_flow_nonce($1,$2, ${in15}) as r`, [sha256("bp"), "admin"])).rows[0].r === false);

  console.log("\nB. Consume single-use + ownership:");
  expect("first consume succeeds", (await asUser(U1, CON, [h1, "recovery"])).rows[0].c === true);
  expect("second use of the same token fails", (await asUser(U1, CON, [h1, "recovery"])).rows[0].c === false);
  expect("consumed hash cannot be registered again", (await asUser(U1, `select public.register_dashboard_flow_nonce($1,$2, ${in15}) as r`, [h1, "recovery"])).rows[0].r === false);
  const h2 = sha256("nonce-" + U1 + "-2");
  await asUser(U1, `select public.register_dashboard_flow_nonce($1,$2, ${in15})`, [h2, "recovery"]);
  expect("cross-user consume fails", (await asUser(U2, CON, [h2, "recovery"])).rows[0].c === false);
  expect("wrong-purpose consume fails", (await asUser(U1, CON, [h2, "invite"])).rows[0].c === false);
  expect("wrong/forged hash fails", (await asUser(U1, CON, [sha256("nope"), "recovery"])).rows[0].c === false);
  await asUser(U1, CON, [h2, "recovery"]); // clean up h2

  console.log("\nC. Expired nonce cannot be consumed:");
  const he = sha256("expired-" + U1);
  await admin.query("insert into public.dashboard_auth_flow_nonces(nonce_hash,user_id,purpose,expires_at) values ($1,$2,'recovery', now() - interval '1 minute')", [he, U1]);
  expect("expired nonce consume fails", (await asUser(U1, CON, [he, "recovery"])).rows[0].c === false);

  console.log("\nD. Concurrent reuse → exactly one success:");
  const hc = sha256("race-" + U1);
  await asUser(U1, `select public.register_dashboard_flow_nonce($1,$2, ${in15})`, [hc, "recovery"]);
  const results = await Promise.all(
    Array.from({ length: 30 }, () => asUser(U1, CON, [hc, "recovery"]).then((r) => r.rows[0].c))
  );
  const wins = results.filter((x) => x === true).length;
  expect("exactly one of 30 concurrent consumes won", wins === 1, `winners=${wins}`);

  console.log("\nE. Hash-only storage + RLS + definer:");
  const cols = (await admin.query("select column_name from information_schema.columns where table_name='dashboard_auth_flow_nonces' order by 1")).rows.map((r) => r.column_name);
  expect("no raw nonce/token column (hash only)", cols.includes("nonce_hash") && !cols.some((c) => /^(nonce|token|raw)$/.test(c)), cols.join(","));
  const badHash = (await admin.query("select count(*)::int n from public.dashboard_auth_flow_nonces where nonce_hash !~ '^[0-9a-f]{64}$'")).rows[0].n;
  expect("every stored value is a 64-hex SHA-256 digest", badHash === 0);
  let anonBlocked = false;
  try {
    await asUser("00000000-0000-0000-0000-000000000000", "select count(*) from public.dashboard_auth_flow_nonces");
  } catch (e) {
    anonBlocked = /permission denied/i.test(e.message);
  }
  expect("authenticated cannot read the nonce table directly (RPC-only)", anonBlocked);
  const defCount = (await admin.query("select count(*)::int n from pg_proc where proname in ('register_dashboard_flow_nonce','consume_dashboard_flow_nonce') and prosecdef and array_to_string(proconfig,',') like '%search_path=%'")).rows[0].n;
  expect("both RPCs are SECURITY DEFINER + fixed search_path", defCount === 2);

  await admin.end();

  console.log("\n" + "-".repeat(60));
  if (failures) {
    console.error(`\n✖ ${failures} nonce integration test(s) failed.`);
    process.exit(1);
  }
  console.log("\n✓ All P04 nonce PostgreSQL integration tests passed.");
}

main().catch((err) => {
  console.error("\n✖ Nonce test crashed:", err?.stack || String(err));
  process.exit(1);
});
