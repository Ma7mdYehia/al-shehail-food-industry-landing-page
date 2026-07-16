# Production Patch 03 — Dashboard Auth / RBAC foundation

Builds the secure Supabase Auth/RBAC **authorization foundation** for the future
dashboard and layers authenticated dashboard RLS policies on top of the P02
database foundation. This is the authorization layer **only** — it does not build
the content-management dashboard UI, and it makes **no remote database, Auth, or
production changes**. Public website behavior is unchanged.

## 0. Codex review fixes (applied)

This patch incorporates the review-requested changes:
1. **Membership verifier now verifies Auth identity** (shared resolver; matches `membership.user_id` to the resolved confirmed Auth user; honest skip accounting; partial env = error).
2. **Inactive members read nothing** — the self-read policy requires `is_active`.
3. **Enquiry audit fields are unforgeable** — `handled_by`/`handled_at` are removed from the authenticated grant and stamped server-side from `auth.uid()` + `now()`, with a both-or-neither constraint.
4. **Bootstrap is atomic** — a single bulk upsert + read-back verification (no per-user write loop).
5. **Client-bundle scan runs post-build** as its own command; a missing `.next/static` is a CI failure.
6. **Runtime aligned to Node 22** (engines, `.nvmrc`, CI, Vercel note).

## 1. Branches

- **Source branch (PR base / source of truth):** `ui/homepage-glassmorphism-higgsfield-assets`
- **Required prior merge:** Production P02, commit `fceaa64535d3b6818df7e1a93564df8ac1bc083f` (confirmed present)
- **This branch:** `prod/dashboard-auth-rbac-p03`

## 2. Confirmed members & role matrix

| User | Email (normalized) | Role |
|---|---|---|
| M.Yehia | marketing@halsabake.com | owner |
| A.Zaid | gm@elshohail.com | admin |
| O.Abdullah | osama@halsabake.com | editor |

| Capability | owner | admin | editor | anon / non-member / inactive |
|---|:---:|:---:|:---:|:---:|
| SELECT active public content | ✅ | ✅ | ✅ | ✅ (public) |
| SELECT all content (incl. inactive/draft) | ✅ | ✅ | ✅ | ❌ |
| INSERT content | ✅ | ✅ | ✅ | ❌ |
| UPDATE content (incl. activate/deactivate, reorder) | ✅ | ✅ | ✅ | ❌ |
| DELETE content (hard) | ✅ | ✅ | ❌ | ❌ |
| Read enquiries | ✅ | ✅ | ✅ | ❌ |
| Update enquiry **workflow** fields only | ✅ | ✅ | ✅ | ❌ |
| Change original enquiry submission data | ❌ | ❌ | ❌ | ❌ |
| Manage memberships / roles | ✅ | ❌ | ❌ | ❌ |
| Delete/disable/downgrade the **final** active owner | ❌ | ❌ | ❌ | ❌ |

Anon behavior is **exactly** as in P02: SELECT active public content only; no
content writes; no access to `form_enquiries`; no access to memberships.

## 3. Membership model — `public.dashboard_members`

The authorization source of truth. A member links a Supabase Auth user to a role.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `user_id` | uuid | **unique**, `references auth.users(id) on delete cascade` |
| `email` | text | **unique**, normalized lowercase (DB CHECK `email = lower(email)`) |
| `display_name` | text | not null |
| `role` | text | CHECK `in ('owner','admin','editor')` |
| `is_active` | boolean | default true; inactive ⇒ **no** permissions |
| `created_at` / `updated_at` | timestamptz | `updated_at` maintained by trigger |

Indexes: partial `(role) where is_active`, `(is_active)`, `(email)`.

## 4. Authorization derivation (server-side only)

Authorization is derived from `auth.uid()` **and** the membership row — never from
client-supplied role metadata, `localStorage`, cookies, email text, or editable
JWT `user_metadata`. SQL helpers (all `SECURITY DEFINER`, `set search_path = ''`,
schema-qualified, no dynamic SQL, EXECUTE revoked from `public` and granted only
to `authenticated`):

- `public.current_dashboard_role()` → `owner|admin|editor|NULL` (filters `is_active`; inactive ⇒ NULL).
- `public.is_dashboard_member()` → any active role.
- `public.is_dashboard_content_admin()` → owner/admin (content DELETE).
- `public.is_dashboard_owner()` → owner (membership management).

Reading `dashboard_members` **inside** a definer function (owned by the table
owner) bypasses that table's RLS, which both avoids leaking the member list and
**prevents recursive RLS** when the helpers are used in `dashboard_members`' own
policies.

## 5. RLS policy matrix (per table / action)

RLS is enabled on every table. The P02 public active-content SELECT policies are
**preserved**; P03 **adds** the authenticated dashboard policies. Separate
policies per action (no broad `FOR ALL`); every UPDATE policy has **USING + WITH
CHECK**. Grants are least-privilege (RLS does not replace grants).

**11 content tables** (`media_assets`, `product_categories`, `products`,
`product_details`, `product_options`, `services`, `service_sections`, `partners`,
`partner_projects`, `partner_project_products`, `shared_content`):

| Action | Policy `to` | Predicate |
|---|---|---|
| SELECT (public) | anon, authenticated | P02 active-content rule (unchanged) |
| SELECT (dashboard, all rows) | authenticated | `is_dashboard_member()` |
| INSERT | authenticated | WITH CHECK `is_dashboard_member()` |
| UPDATE | authenticated | USING + WITH CHECK `is_dashboard_member()` |
| DELETE | authenticated | USING `is_dashboard_content_admin()` (owner/admin) |

**`form_enquiries`:**

| Action | anon | authenticated (member) |
|---|---|---|
| SELECT | ❌ (no grant, no policy) | ✅ `is_dashboard_member()` |
| INSERT | ❌ | ❌ (contact API uses service role) |
| UPDATE | ❌ | ✅ **workflow columns only** (see below) |
| DELETE | ❌ | ❌ (no policy) |

Dashboard clients may directly update **only** genuine workflow inputs via a
**column-level UPDATE grant**: `grant update (status, internal_notes,
assigned_to)`. The original submission columns **and the audit columns**
(`handled_by`, `handled_at`) are excluded, so changing `email`/`full_name`/etc.
**or** forging `handled_by`/`handled_at` is rejected by PostgreSQL *before* RLS
runs (verified: `permission denied for column`).

**Audit stamping (unforgeable).** When an **active** member performs a workflow
update, a `SECURITY DEFINER` `BEFORE UPDATE` trigger (`stamp_enquiry_handler`,
`search_path = ''`) sets `handled_by` = the member's `dashboard_members.id` from
`auth.uid()` and `handled_at = now()`, overriding any client value. A
service-role/backend update (no active member for `auth.uid()`) leaves the audit
fields untouched, so trusted backends can still maintain them. A CHECK constraint
enforces `handled_by`/`handled_at` are **both null or both set**. New workflow
columns added by P03: `internal_notes`, `assigned_to`, `handled_at`, `handled_by`
(→ `dashboard_members`); `status` pre-existed in P02.

**`dashboard_members`:** SELECT own row **only while active** (`user_id =
auth.uid() AND is_active`) or all rows if owner; INSERT/UPDATE/DELETE owner-only
(`is_dashboard_owner()`). An inactive member reads zero membership rows.

## 6. Threat model & privilege-escalation protections

- **No client-trusted authorization.** Role comes from the DB row keyed by
  `auth.uid()`, not from any client-editable value.
- **No self-promotion.** Non-owners match **no** membership write policy, so they
  cannot insert/update/delete memberships or change any role (verified: admin/
  editor self-promote → 0 rows / rejected).
- **Editors cannot delete content.** No DELETE policy applies to editors.
- **Inactive members have no access.** The role helper filters `is_active`, so an
  inactive (even if authenticated) user resolves to NULL role → all dashboard
  policies deny.
- **Definer-function safety.** Fixed empty `search_path`, schema-qualified
  objects, least-privilege EXECUTE, no dynamic SQL, non-recursive.
- **Final-owner protection.** A `BEFORE UPDATE OR DELETE` trigger
  (`protect_final_owner`) blocks deleting, disabling, or downgrading the last
  active owner. It is transaction-safe: it **locks** the other active-owner rows
  in a subquery (`select id … for update`) and then counts them, so two
  concurrent transactions cannot each remove one owner and leave zero. (The lock
  lives in a subquery because `count(*) … FOR UPDATE` is invalid SQL — a bug the
  local RLS harness caught and which is now covered by a specific-message test.)

## 7. Safe bootstrap procedure

`scripts/dashboard-members.config.mjs` holds the three confirmed emails/roles
(no secrets). `scripts/bootstrap-dashboard-members.mjs`:

- **Dry-run/read-only by default** (`npm run db:members:bootstrap`) — prints the
  planned members, opens no connection, writes nothing.
- **Apply** (`npm run db:members:bootstrap:apply`) requires `--apply` **and**
  `SUPABASE_SERVICE_ROLE_KEY`, and is **refused in CI**.
- Uses a **shared Auth resolver** (`scripts/dashboard-auth-resolver.mjs`, used by
  both bootstrap and verifier): paginated **exact normalized-email** match that
  **fails closed** on a missing, ambiguous/duplicate, **unconfirmed**, or
  conflicting account — before any write. Never prints keys/tokens or full user
  objects.
- **Never creates or invites** Auth users. Writes all memberships in **one atomic
  bulk upsert** (a conflict applies none), then **reads back** and verifies every
  `user_id`/`email`/`display_name`/`role`/`is_active` mapping. **Never deletes**
  other members; idempotent.
- **Read-only verifier** (`npm run db:members:verify`) resolves each email to its
  confirmed Auth user and asserts the membership is linked to that **exact
  `user_id`** (a row with the right email/role but wrong `user_id` fails), that
  the role/active match, and that no two rows map to one Auth user. Offline, the
  live checks are recorded as **genuinely skipped**; a partial URL/service-role
  config is a **configuration error**, not a skip.

## 8. Server-side auth utilities & the guard

- `lib/auth/roles.ts` — role type + capability helpers mirroring the DB policies.
- `lib/auth/dashboard.ts` (server-only; guarded against client import; **no
  service-role key**): `getCurrentDashboardMember()` (returns the active member or
  `null`, failing closed) and `requireDashboardRole(...roles)` (redirects safely
  to `/` when unauthenticated/inactive/unauthorized).
- `app/dashboard/` — a **minimal protected placeholder** with its own isolated
  root layout (`robots: noindex`), `dynamic = "force-dynamic"`. It exists only to
  prove the guard: unauthenticated requests 307-redirect to `/`. No middleware was
  added, so public routing, locale behavior, sitemap, robots, and SEO are
  untouched. This is **not** the dashboard UI.

## 9. Required Supabase / Vercel configuration (future)

- Supabase Auth: create/invite the three users out-of-band (this patch never
  creates users). Confirm email settings before bootstrapping.
- Env (server-only secret; never `NEXT_PUBLIC`, never committed):
  `SUPABASE_SERVICE_ROLE_KEY` (bootstrap + future trusted server routes),
  plus the existing `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Node.js 22** everywhere: `package.json` `engines.node >= 22`, `.nvmrc` (`22`),
  GitHub Actions (`node-version-file: .nvmrc`). The **Vercel project must be set to
  Node.js 22** (Project → Settings → Node.js Version) to match the installed
  `@supabase` SDK (`engines: node >= 22`). Next.js stays at **14.2.35** (no major
  upgrade). Do not change the Vercel project from this patch.

## 10. Future Auth user onboarding

1. An owner/admin invites the user in Supabase Auth (Dashboard → Authentication)
   with the exact normalized email; the user confirms and sets a password.
2. Add the user to `scripts/dashboard-members.config.mjs` (email + role).
3. Run `npm run db:members:bootstrap` (dry-run) to preview, then
   `npm run db:members:bootstrap:apply` from a trusted operator shell.
4. `npm run db:members:verify` to confirm.

## 11. Testing & local validation

- **`npm run db:schema:validate`** — dependency-free structural guards (P02 + P03),
  incl. per-action policies, USING+WITH CHECK on updates, no `FOR ALL`, definer/
  `search_path`, final-owner trigger, column-scoped enquiry update grant, owner-
  only membership writes, anon lockout. **CI.**
- **`npm run db:test:rbac`** — dependency-free role-matrix + escalation +
  audit-stamping/grant + self-read-`is_active` + bootstrap-atomicity + resolver +
  config checks (pre-build, no bundle dependency). **CI.**
- **`npm run scan:client-bundle`** — dedicated **post-build** client-bundle secret
  scan; a missing `.next/static` is a **failure**, not a skip. **CI (after build).**
- **`npm run db:test:safety`** — the P02 seed-safety tests remain green. **CI.**
- **`scripts/local-rbac-rls-test.sh`** — LOCAL-ONLY behavioral RLS test.

### Docker/Supabase CLI limitation

Docker and the Supabase local stack are **not available** in this environment, so
`supabase start` was **not** run and **no remote Supabase validation was
performed**. Instead the migrations were applied to a **real, ephemeral local
PostgreSQL 16 cluster** with Supabase-like `auth` schema, `auth.uid()`, and
`anon`/`authenticated`/`service_role` roles. That harness (`local-rbac-rls-test.sh`)
verified, with **47/47 checks passing**: role resolution (incl. inactive→NULL and
non-member→NULL), anon behavior unchanged, non-member/inactive denied, **inactive
member reads zero membership rows**, editor insert/update allowed + delete denied,
admin/owner full CRUD, admin/editor membership writes denied + owner allowed, the
final-owner rule (blocked with the intended message; downgrade allowed once a
second owner exists), enquiry workflow-only updates with original columns
immutable, **direct `handled_by`/`handled_at` spoofing rejected, a valid member
update auto-stamping the real member id + server `now()`, and an inactive member
unable to trigger stamping**, and definer/`search_path`.

## 12. Rollback limitations (forward-only migration)

The P03 migration is **forward-only** and does not edit the P02 migration. Because
nothing is applied remotely by this patch, abandoning it is just closing the PR
(the source branch is untouched). After a future remote apply, rolling back
requires an explicit new down-migration that drops the P03 objects (policies,
grants, helper functions, the `protect_final_owner` trigger, the four
`form_enquiries` workflow columns, and `dashboard_members`) in dependency order —
P03 intentionally ships no destructive/reset scripts.

## 13. Deferred to later patches

Full dashboard CRUD UI; a sign-in page and session middleware; migrating public
site reads to Supabase; the contact-form API + Resend + Turnstile; audit logging;
per-field content workflows; and the first authorized remote link + `db push` +
membership bootstrap against the real Supabase project. **Non-goals of P03:** no
remote DB/Auth/Production changes, no real user creation/invitation, no Next.js
major upgrade, no public design/content/SEO change.
