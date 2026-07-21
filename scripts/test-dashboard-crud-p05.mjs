#!/usr/bin/env node
// =============================================================================
// P05 dashboard CRUD / RBAC — real PostgreSQL 16 integration test (portable).
// =============================================================================
// Connects to `DATABASE_URL`, applies the P02 + P03 + P05 migrations with
// Supabase-like auth stubs, and proves — at the DATABASE boundary, using only
// the anon / authenticated roles (NEVER service_role) — that the RLS policies,
// grants, triggers and P05 RPCs enforce the P05 security model:
//   * owner/admin/editor content CRUD boundaries (editors cannot DELETE)
//   * inactive-member and anonymous rejection
//   * owner-only team RPC; editor rejection
//   * self-deactivation protection + last-active-owner protection
//   * enquiry audit fields (handled_by/handled_at) cannot be forged; valid
//     workflow updates are server-stamped
//   * referenced content rows cannot be destructively removed (FK)
//   * updated_at is bumped on update (basis for optimistic concurrency)
//
//   DATABASE_URL=postgres://user:pass@host:5432/db node scripts/test-dashboard-crud-p05.mjs
// =============================================================================

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const MIGRATIONS = join(ROOT, "supabase", "migrations");

let url = process.env.DATABASE_URL;
if (!url) {
  console.error("✖ DATABASE_URL is required (a PostgreSQL 16 connection string).");
  process.exit(1);
}

// Provision a DEDICATED, freshly-created database so this test is isolated from
// any other suite sharing the same server (e.g. the P04 nonce test, which
// applies the same P02/P03 migrations to the default DB). Without this, the
// second suite's plain CREATE TABLE would collide with the first's tables.
const TEST_DB = "dashboard_crud_p05_test";
async function provisionFreshDatabase() {
  const maint = new URL(url);
  maint.pathname = "/postgres";
  const target = new URL(url);
  target.pathname = `/${TEST_DB}`;
  const boot = new pg.Client({ connectionString: maint.toString() });
  await boot.connect();
  try {
    await boot.query(`drop database if exists ${TEST_DB} with (force)`);
    await boot.query(`create database ${TEST_DB}`);
  } finally {
    await boot.end();
  }
  url = target.toString();
}

let failures = 0;
const ok = (n, d = "") => console.log(`  ✓ ${n}${d ? " — " + d : ""}`);
const bad = (n, d = "") => {
  failures++;
  console.log(`  ✗ ${n}${d ? " — " + d : ""}`);
};
const expect = (n, cond, d = "") => (cond ? ok(n, d) : bad(n, d));

const LOC = JSON.stringify({ en: "En", ar: "Ar" });

// Run a query AS an authenticated user (JWT sub) or AS anon. Each call uses its
// own connection + transaction so locking/concurrency is genuine.
async function asRole(role, sub, text, params = []) {
  const c = new pg.Client({ connectionString: url });
  await c.connect();
  try {
    await c.query("begin");
    if (sub) await c.query("select set_config('request.jwt.claim.sub', $1, true)", [sub]);
    await c.query(`set local role ${role}`);
    const r = await c.query(text, params);
    await c.query("commit");
    return { ok: true, rows: r.rows, rowCount: r.rowCount };
  } catch (e) {
    try { await c.query("rollback"); } catch { /* ignore */ }
    return { ok: false, error: e };
  } finally {
    await c.end();
  }
}
const asUser = (sub, text, params) => asRole("authenticated", sub, text, params);
const asAnon = (text, params) => asRole("anon", null, text, params);

async function main() {
  await provisionFreshDatabase();

  const admin = new pg.Client({ connectionString: url });
  await admin.connect();

  for (const role of ["anon", "authenticated"]) {
    await admin.query(`do $$ begin create role ${role} nologin; exception when duplicate_object then null; end $$;`);
  }
  await admin.query(`do $$ begin create role service_role nologin bypassrls; exception when duplicate_object then null; end $$;`);
  await admin.query("create schema if not exists auth");
  await admin.query("grant usage on schema auth to anon, authenticated, service_role");
  await admin.query("create table if not exists auth.users (id uuid primary key, email text unique)");
  await admin.query("create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$");
  await admin.query("grant usage on schema public to anon, authenticated, service_role");

  for (const file of [
    "20260715120000_phase_1_database_foundation.sql",
    "20260716120000_dashboard_auth_rbac.sql",
    "20260721120000_dashboard_crud_p05.sql",
  ]) {
    await admin.query(readFileSync(join(MIGRATIONS, file), "utf8"));
  }
  console.log("Applied P02 + P03 + P05 migrations.\n");

  // --- users + members ---
  const ids = (await admin.query(
    "select gen_random_uuid() owner1, gen_random_uuid() owner2, gen_random_uuid() admin, gen_random_uuid() editor, gen_random_uuid() inactive"
  )).rows[0];
  const U = ids;
  await admin.query(
    `insert into auth.users(id,email) values ($1,'o1@x.invalid'),($2,'o2@x.invalid'),($3,'a@x.invalid'),($4,'e@x.invalid'),($5,'i@x.invalid')`,
    [U.owner1, U.owner2, U.admin, U.editor, U.inactive]
  );
  const mem = {};
  for (const [k, uid, email, role, active] of [
    ["owner1", U.owner1, "o1@x.invalid", "owner", true],
    ["owner2", U.owner2, "o2@x.invalid", "owner", true],
    ["admin", U.admin, "a@x.invalid", "admin", true],
    ["editor", U.editor, "e@x.invalid", "editor", true],
    ["inactive", U.inactive, "i@x.invalid", "editor", false],
  ]) {
    const r = await admin.query(
      "insert into public.dashboard_members(user_id,email,display_name,role,is_active) values ($1,$2,$3,$4,$5) returning id",
      [uid, email, k, role, active]
    );
    mem[k] = r.rows[0].id;
  }

  // --- baseline content (as table owner / superuser, bypassing RLS) ---
  await admin.query(
    "insert into public.media_assets(id,key,alt_localized,type,status) values ('m_ref','k_ref',$1,'products','active')",
    [LOC]
  );
  await admin.query(
    "insert into public.product_categories(id,slug,name_localized,description_localized) values ('cat_ref','cat-ref',$1,$1)",
    [LOC]
  );
  await admin.query(
    "insert into public.products(id,category_id,slug,name_localized,short_description_localized,card_description_localized,image_asset_id,icon_type,is_active) values ('prod_ref','cat_ref','prod-ref',$1,$1,$1,'m_ref','loaf',true)",
    [LOC]
  );
  await admin.query(
    "insert into public.products(id,category_id,slug,name_localized,short_description_localized,card_description_localized,icon_type,is_active) values ('prod_draft','cat_ref','prod-draft',$1,$1,$1,'loaf',false)",
    [LOC]
  );
  await admin.query(
    "insert into public.form_enquiries(id,full_name,email,locale,source_path) values ('enq1','Test Person','p@x.invalid','en','/contact')"
  );

  console.log("A. Content CRUD boundaries (RLS + grants):");
  // editor may INSERT + UPDATE content
  const eIns = await asUser(U.editor, "insert into public.products(id,category_id,slug,name_localized,short_description_localized,card_description_localized,icon_type) values ('prod_e','cat_ref','prod-e',$1,$1,$1,'bun')", [LOC]);
  expect("editor can INSERT a product", eIns.ok, eIns.error?.message);
  const eUpd = await asUser(U.editor, "update public.products set featured=true where id='prod_ref'");
  expect("editor can UPDATE a product", eUpd.ok && eUpd.rowCount === 1);
  // editor may NOT DELETE (no delete policy → 0 rows, silently filtered)
  const eDel = await asUser(U.editor, "delete from public.products where id='prod_e'");
  expect("editor DELETE is blocked (0 rows via RLS)", eDel.ok && eDel.rowCount === 0);
  // owner/admin may DELETE an unreferenced row
  const aDel = await asUser(U.admin, "delete from public.products where id='prod_e'");
  expect("admin can DELETE an unreferenced product", aDel.ok && aDel.rowCount === 1);
  // owner may read a DRAFT (inactive) row via dashboard_read
  const oDraft = await asUser(U.owner1, "select id from public.products where id='prod_draft'");
  expect("owner reads inactive/draft content", oDraft.ok && oDraft.rows.length === 1);

  console.log("\nB. Inactive member + anonymous rejection:");
  const iDraft = await asUser(U.inactive, "select id from public.products where id='prod_draft'");
  expect("inactive member cannot read draft content", iDraft.ok && iDraft.rows.length === 0);
  const iIns = await asUser(U.inactive, "insert into public.product_categories(id,slug,name_localized,description_localized) values ('cx','cx',$1,$1)", [LOC]);
  expect("inactive member cannot INSERT content", !iIns.ok);
  const iEnq = await asUser(U.inactive, "select id from public.form_enquiries");
  expect("inactive member cannot read enquiries", iEnq.ok && iEnq.rows.length === 0);
  const anDraft = await asAnon("select id from public.products where id='prod_draft'");
  expect("anon cannot read draft content", anDraft.ok && anDraft.rows.length === 0);
  const anEnq = await asAnon("select id from public.form_enquiries");
  // anon has no grant on form_enquiries → the read is DENIED outright (stronger
  // than an empty result). Accept either denial or zero rows.
  expect("anon cannot read enquiries", !anEnq.ok || anEnq.rows.length === 0);
  const anActive = await asAnon("select id from public.products where id='prod_ref'");
  expect("anon CAN still read active public content (unchanged)", anActive.ok && anActive.rows.length === 1);

  console.log("\nC. Team management RPC (owner-only) + safeguards:");
  const eRpc = await asUser(U.editor, "select public.dashboard_set_member_state($1,'admin',true) as r", [mem.editor]);
  expect("editor cannot call the team RPC", !eRpc.ok);
  const anRpc = await asAnon("select public.dashboard_set_member_state($1,'admin',true)", [mem.editor]);
  expect("anon cannot EXECUTE the team RPC (no grant)", !anRpc.ok);
  // owner promotes editor → admin
  const promote = await asUser(U.owner1, "select role from public.dashboard_set_member_state($1,'admin',true)", [mem.editor]);
  expect("owner can change a member role via RPC", promote.ok && promote.rows[0]?.role === "admin", promote.error?.message);
  // self-deactivation protection (owner1 is NOT the last owner: owner2 active)
  const selfOff = await asUser(U.owner1, "select public.dashboard_set_member_state($1,'owner',false)", [mem.owner1]);
  expect("owner cannot deactivate their own membership (RPC)", !selfOff.ok);
  const selfDemote = await asUser(U.owner1, "select public.dashboard_set_member_state($1,'admin',true)", [mem.owner1]);
  expect("owner cannot demote their own membership (RPC)", !selfDemote.ok);
  // owner1 deactivates owner2 (allowed — owner1 remains)
  const off2 = await asUser(U.owner1, "select is_active from public.dashboard_set_member_state($1,'owner',false)", [mem.owner2]);
  expect("owner can deactivate ANOTHER owner while an owner remains", off2.ok && off2.rows[0]?.is_active === false, off2.error?.message);

  console.log("\nD. Last-active-owner protection (direct update trigger):");
  // owner1 is now the ONLY active owner. A direct self-deactivate is blocked by
  // the P03 protect_final_owner trigger (independent of the RPC).
  const lastOff = await asUser(U.owner1, "update public.dashboard_members set is_active=false where id=$1", [mem.owner1]);
  expect("final active owner cannot be disabled (trigger)", !lastOff.ok);
  const lastDemote = await asUser(U.owner1, "update public.dashboard_members set role='admin' where id=$1", [mem.owner1]);
  expect("final active owner cannot be demoted (trigger)", !lastDemote.ok);

  console.log("\nE. Enquiry audit stamping (unforgeable) + workflow update:");
  // Forging handled_by is blocked by the column-level UPDATE grant.
  const forge = await asUser(U.owner1, "update public.form_enquiries set handled_by=$1 where id='enq1'", [mem.owner1]);
  expect("handled_by cannot be set from the client (column grant)", !forge.ok);
  const forgeAt = await asUser(U.owner1, "update public.form_enquiries set handled_at=now() where id='enq1'");
  expect("handled_at cannot be set from the client (column grant)", !forgeAt.ok);
  // A legitimate workflow update is stamped by the DB trigger from auth.uid().
  const wf = await asUser(U.owner1, "update public.form_enquiries set status='contacted', internal_notes='called' where id='enq1'");
  expect("workflow update (status/notes) succeeds", wf.ok && wf.rowCount === 1, wf.error?.message);
  const stamp = (await admin.query("select status, internal_notes, handled_by, handled_at from public.form_enquiries where id='enq1'")).rows[0];
  expect("status + notes persisted", stamp.status === "contacted" && stamp.internal_notes === "called");
  expect("handled_by stamped to the acting member", stamp.handled_by === mem.owner1, String(stamp.handled_by));
  expect("handled_at stamped by the DB", stamp.handled_at !== null);
  // assign to an active member
  const assign = await asUser(U.owner1, "update public.form_enquiries set assigned_to=$1 where id='enq1'", [mem.admin]);
  expect("enquiry can be assigned to a member", assign.ok && assign.rowCount === 1);

  console.log("\nF. Referenced content cannot be destructively removed (FK):");
  const delMedia = await asUser(U.owner1, "delete from public.media_assets where id='m_ref'");
  expect("deleting a referenced media asset fails (FK)", !delMedia.ok);
  const delCat = await asUser(U.owner1, "delete from public.product_categories where id='cat_ref'");
  expect("deleting a referenced category fails (FK)", !delCat.ok);

  console.log("\nG. updated_at is bumped on update (optimistic-concurrency basis):");
  const before = (await admin.query("select updated_at from public.products where id='prod_ref'")).rows[0].updated_at;
  await new Promise((r) => setTimeout(r, 15));
  await asUser(U.owner1, "update public.products set sort_order=5 where id='prod_ref'");
  const after = (await admin.query("select updated_at from public.products where id='prod_ref'")).rows[0].updated_at;
  expect("updated_at advances on UPDATE", new Date(after).getTime() > new Date(before).getTime());

  console.log("\nH. P05 RPCs are safe (definer + fixed search_path + no anon):");
  const defs = (await admin.query("select count(*)::int n from pg_proc where proname in ('dashboard_set_member_state','dashboard_active_member_count','dashboard_assignable_members') and prosecdef and array_to_string(proconfig,',') like '%search_path=%'")).rows[0].n;
  expect("all three P05 RPCs are SECURITY DEFINER + fixed search_path", defs === 3);
  const anonCount = await asAnon("select public.dashboard_active_member_count()");
  expect("anon cannot execute the member-count RPC", !anonCount.ok);
  const memberCount = await asUser(U.admin, "select public.dashboard_active_member_count() as n");
  // owner1 active, owner2 deactivated, admin active, editor(now admin) active, inactive inactive → 3 active
  expect("active-member count RPC returns an accurate total to a member", memberCount.ok && memberCount.rows[0].n === 3, String(memberCount.rows[0]?.n));
  const assignable = await asUser(U.admin, "select count(*)::int n from public.dashboard_assignable_members()");
  expect("assignable-members RPC lists active members to a member", assignable.ok && assignable.rows[0].n === 3, String(assignable.rows[0]?.n));
  const anAssign = await asAnon("select public.dashboard_assignable_members()");
  expect("anon cannot execute the assignable-members RPC", !anAssign.ok);

  await admin.end();

  console.log("\n" + "-".repeat(60));
  if (failures) {
    console.error(`\n✖ ${failures} P05 CRUD/RBAC integration test(s) failed.`);
    process.exit(1);
  }
  console.log("\n✓ All P05 dashboard CRUD/RBAC PostgreSQL integration tests passed.");
}

main().catch((err) => {
  console.error("\n✖ P05 CRUD test crashed:", err?.stack || String(err));
  process.exit(1);
});
