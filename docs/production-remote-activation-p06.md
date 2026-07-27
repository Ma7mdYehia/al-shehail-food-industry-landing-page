# Production Patch 06 — Remote Supabase Activation Runbook

**Status of this document:** operator runbook + safety contract for activating the
existing Supabase database, Auth, and dashboard against the confirmed real
production project. It is committed so a **trusted operator** can execute the
remote steps from a machine that holds the production credentials.

> **Why the remote steps are not executed by the coding agent.** The environment
> in which this branch was prepared has **no operator credentials and no remote
> access**: every one of `SUPABASE_ACCESS_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`,
> `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_REF`, `NEXT_PUBLIC_SUPABASE_URL`,
> `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DASHBOARD_AUTH_FLOW_SECRET`, and the Vercel
> tokens is unset, and the Supabase/Vercel CLIs are not authenticated. Per the
> P06 mandatory STOP conditions ("STOP before writing if required credentials
> are missing or only partially configured"), **no remote write was attempted
> and no remote identifier or result has been fabricated.** Every remote step
> below is marked **OPERATOR ACTION** and must be run from the trusted operator
> environment. Secrets are **never** pasted into chat, the PR, or this file.

---

## 0. Non-secret identifiers (fill in during preflight — never paste secrets)

Resolve and record ONLY these non-secret identifiers from the trusted operator
environment. Do **not** record keys, passwords, tokens, confirmation links,
cookies, or full Auth user objects.

| Identifier | Expected / to confirm |
| --- | --- |
| Production domain | `https://alshehai.ae` (must match `NEXT_PUBLIC_SITE_URL` and `lib/env/public.ts` fallback) |
| Supabase project ref | _(resolve from `supabase projects list` — record ref only)_ |
| Supabase hostname | _(host of `NEXT_PUBLIC_SUPABASE_URL`, e.g. `<ref>.supabase.co` — host only)_ |
| Vercel project name | _(record project name only)_ |
| Git branch | `prod/remote-supabase-activation-p06` |
| Git commit deployed | _(exact reviewed commit SHA)_ |

**STOP and do not write** if the project ref or domain is ambiguous, if the
project appears to belong to another application, or if unexpected
tables/migrations/data are present.

---

## 1. Mandatory read-only preflight (before any remote write)

Run all of these first. They perform **no** writes.

1. `git fetch origin prod/remote-supabase-activation-p06 && git checkout prod/remote-supabase-activation-p06`
2. Confirm HEAD descends from the required baseline:
   `git merge-base --is-ancestor 9cb88c4bd5bdaada39af4695fac7e88eb1190739 HEAD && echo OK`
3. Full local suite on **Node 22** (see §8). All green before touching remote.
4. Confirm Supabase CLI auth via the trusted operator env (`supabase projects list`) — **record only** the project ref/host.
5. Confirm the production domain is `https://alshehai.ae`.
6. Inspect remote migration history: `supabase migration list --linked` — record the applied list.
7. Compare remote schema vs every migration under `supabase/migrations/` (see §2). `supabase db diff --linked` should report **no** unexpected drift.
8. Inspect remote row counts (read-only `SELECT count(*)`), Auth config (Site URL, redirect allowlist, email templates), and whether the three operator emails already exist — **never** print full Auth user objects or tokens.
9. Inspect Vercel env var **names/scopes** only (`vercel env ls`) — never print values.

**STOP** if: project ref/domain ambiguous; unexpected tables/migrations/data;
project belongs to another app; an existing Auth email resolves ambiguously; a
safe baseline report cannot be produced for a non-empty DB; or required
credentials are missing/partial.

---

## 2. Migrations (apply in exact repo order, forward-only)

Repository migrations, in order (do **not** edit, squash, reorder, or rewrite —
P02–P05 are merged and immutable):

1. `20260715120000_phase_1_database_foundation.sql`
2. `20260716120000_dashboard_auth_rbac.sql`
3. `20260719120000_dashboard_auth_flow_nonces.sql`
4. `20260721120000_dashboard_crud_p05.sql`

**OPERATOR ACTION**

- Capture the remote migration list **before**: `supabase migration list --linked`.
- Dry-run the diff where supported: `supabase db diff --linked`.
- Apply **only the missing** migrations, in order: `supabase db push --linked`.
- Capture the migration list **after**; confirm only the expected new entries appear.
- Verify tables, triggers, grants, RLS policies, and RPC signatures exist; confirm `anon`/`authenticated` grants match the migrations; confirm **no** service-role dependency in the dashboard runtime.

**Never** reset, drop, or recreate the remote database. **Never** run destructive
rollback SQL. If remote history conflicts with the repo, **STOP without forcing**.

---

## 3. Seed (preserve-existing only)

**OPERATOR ACTION**, in order:

1. `npm run seed:export` — confirm it produces **no** diff (seed on disk matches the exporter).
2. `npm run seed:validate` — static validation passes.
3. `npm run db:seed:dry-run` — read-only plan; review missing vs existing rows.
4. `npm run db:seed:apply` — **preserve-existing mode only**. This upserts with
   `ON CONFLICT DO NOTHING` (see `resolveUpsertOptions` in `scripts/phase-1-shared.mjs`):
   it inserts genuinely missing rows and **never overwrites** an existing
   (possibly dashboard-edited) row and **never deletes** rows.
5. `npm run db:verify` — confirm every deterministic seed id exists; extra
   (dashboard-created) rows are reported separately and are expected; confirm FKs
   resolve and localized EN/AR fields are present.

**Do NOT** use `npm run db:seed:overwrite`. **Never** delete remote rows. Preserve
any `NEEDS_VERIFICATION` content exactly as seeded.

---

## 4. Auth configuration

**OPERATOR ACTION** — configure in the Supabase dashboard **before** inviting users:

- **Site URL:** `https://alshehai.ae`
- **Redirect URL allowlist (exactly these — no broad wildcards):**
  - `https://alshehai.ae/dashboard/auth/callback`
  - `https://alshehai.ae/dashboard/update-password`
- Do **not** connect production Auth to arbitrary Vercel Preview domains.
- **Invite email template link:**
  `{{ .SiteURL }}/dashboard/auth/callback?token_hash={{ .TokenHash }}&type=invite`
- **Recovery email:** either the PKCE `{{ .ConfirmationURL }}`, or
  `{{ .SiteURL }}/dashboard/auth/callback?token_hash={{ .TokenHash }}&type=recovery`.
- The callback route (`app/dashboard/auth/callback/route.ts`) verifies both the
  `code` (PKCE recovery) and `token_hash` (`invite`/`recovery`) paths
  server-side and never places tokens in the outgoing redirect.
- Record whether the project uses **default Supabase email delivery** or **custom
  SMTP**. If SMTP is not configured, do **not** claim production email reliability.

Never expose `token_hash`. Never reveal confirmation/invitation links.

---

## 5. Operator users (three confirmed)

Source of truth: `scripts/dashboard-members.config.mjs` (emails + roles only, no secrets).

| Email | Display | Role |
| --- | --- | --- |
| `marketing@halsabake.com` | M.Yehia | owner |
| `gm@elshohail.com` | A.Zaid | admin |
| `osama@halsabake.com` | O.Abdullah | editor |

No public signup. Never generate or store passwords. Prefer secure Auth
invitations; invitees set their own password via the callback flow.

**OPERATOR ACTION** (after §4 is configured):

1. Dry run: `npm run db:auth:invite` (read-only; sends nothing).
2. Apply: `npm run db:auth:invite:apply` — requires `NEXT_PUBLIC_SUPABASE_URL` +
   `SUPABASE_SERVICE_ROLE_KEY`, refused in CI. It:
   - lists existing Auth users and **only invites emails that do not exist**
     (idempotent; never duplicates, never re-invites);
   - pins the invite redirect to `https://alshehai.ae/dashboard/auth/callback`;
   - **never** prints the invitation link/token; **never** creates a password;
   - reports each operator as `invited (pending)`, `already exists
     (confirmed/pending)`, `ambiguous`, or `FAILED`, and exits non-zero on any
     failure/ambiguity.
3. **PAUSE for inbox acceptance.** Any `invited (pending)` account must accept
   the invitation from its inbox and set a password before it is confirmed. Do
   **not** claim completion while any operator is pending. Report per-user status
   as invited / pending / confirmed / existing.

Fail closed on any ambiguous email (multiple Auth users for one address) — resolve
manually before continuing.

---

## 6. Membership bootstrap (only after all three are confirmed)

**OPERATOR ACTION** — once every operator resolves to **exactly one confirmed**
Auth user:

1. `npm run db:members:bootstrap` — dry run (read-only).
2. `npm run db:members:bootstrap:apply` — atomic bulk upsert on `user_id`
   (all-or-nothing), then read-back verify. Requires service role, refused in CI,
   never prints keys, never removes other members.
3. `npm run db:members:verify` — confirm:
   - M.Yehia → **owner**, active
   - A.Zaid → **admin**, active
   - O.Abdullah → **editor**, active
   - at least one active owner; no duplicate user→member mappings.

The service-role key is used **only** by these operator scripts. It is **not** a
website runtime dependency (see §7).

---

## 7. Vercel production environment

**OPERATOR ACTION** — set as **Production** env vars (Node.js **22**):

| Name | Value source | Scope |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://alshehai.ae` | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | project URL | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key (public) | Production |
| `DASHBOARD_AUTH_FLOW_SECRET` | `openssl rand -base64 48` (≥48 random bytes) | Production |

**Do NOT** configure as website runtime env vars: `SUPABASE_SERVICE_ROLE_KEY`,
the database password, or the Supabase access token — these are operator-only.
Never print or commit `DASHBOARD_AUTH_FLOW_SECRET`. Do **not** copy production
config into Preview by default. Deploy **only** the exact reviewed commit, and
only after every gate passes.

---

## 8. Required verification suite (Node 22)

Local/CI (no remote credentials needed):

```
npm ci
npm run seed:export        # must produce no diff
npm run seed:validate
npm run db:schema:validate
npm run db:test:safety
npm run db:test:rbac
npm run db:test:auth-nonce
npm run db:test:crud
npm run test:dashboard-crud
npm run test:confirm-dialog-a11y
npm run test:drawer-a11y
npm run test:scan-bundle
npm run test:auth-shell
npm run test:auth-flow
npm run test:callback-cookie-helper
npm run test:callback-cookies
npm run lint
npm run typecheck
npm run build
npm run scan:client-bundle
```

Remote (OPERATOR ACTION, after activation): `npm run db:verify`,
`npm run db:members:verify`. Wait for GitHub Actions + Vercel to go green.

---

## 9. Live verification (OPERATOR ACTION, after deploy)

- `/api/health` returns 200; public routes unchanged.
- Unauthenticated `/dashboard` redirects to login; valid login works; invalid
  login stays generic.
- Owner can access **Team**; admin/editor cannot. Anon/inactive get no data.
- Recovery: email → callback → update password works.
- Invite: callback → set password works.
- Callback errors delete the Supabase session + flow cookies; sign-out works.
- RLS blocks forbidden operations (use **DB-level** tests for destructive and
  role-negative cases — do **not** deactivate or change the roles of the three
  real accounts to test).
- No service-role key in the runtime or client bundle; no tokens/PII in logs.

---

## 10. Rollback / containment (non-destructive)

- Remove or roll back the production env config (`DASHBOARD_AUTH_FLOW_SECRET`,
  Supabase vars) and redeploy the last-good commit.
- If needed, deactivate memberships via `db:members` tooling (never delete rows).
- **Preserve** the database and migration history. **Never** drop tables or run
  destructive/reverse migrations.
- If any credential is suspected exposed, **rotate** it (Supabase keys, DB
  password, `DASHBOARD_AUTH_FLOW_SECRET`) and redeploy.

---

## 11. Current activation state (from the preparation environment)

| Step | State |
| --- | --- |
| Read-only preflight (git baseline, domain, repo facts) | Done — HEAD `9cb88c4`, descends from required baseline; domain `https://alshehai.ae` confirmed from repo |
| Local verification suite (§8) | Run before commit (see PR/CI) |
| Committed artifacts (this doc, invite script, npm scripts, `.env.example`) | Done |
| Remote migrations apply (§2) | **BLOCKED — no operator credentials in this environment** |
| Seed apply / verify (§3) | **BLOCKED — no operator credentials** |
| Auth configuration (§4) | **BLOCKED — no operator credentials** |
| User invitations (§5) | **BLOCKED — no operator credentials** |
| Membership bootstrap (§6) | **BLOCKED — no operator credentials** |
| Vercel env + deploy (§7) | **BLOCKED — no operator credentials** |
| Live verification (§9) | **BLOCKED — pending deploy** |

No secret was printed or committed. The public website is unchanged. The P06 PR
is opened against `ui/homepage-glassmorphism-higgsfield-assets` and kept
open/unmerged for review.
