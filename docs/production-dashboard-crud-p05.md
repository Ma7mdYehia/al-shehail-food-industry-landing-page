# Production Patch 05 — Dashboard content-management

Turns the authenticated P04 dashboard shell into a functional management surface
on top of the **existing** P02 schema and P03 RBAC/RLS foundation. The public
website is unchanged and still reads from the TypeScript modules under `lib/`;
dashboard database edits do **not** affect public pages (Supabase-backed public
reads remain a later patch).

- **Branch:** `prod/dashboard-crud-p05`
- **Base / PR target:** `ui/homepage-glassmorphism-higgsfield-assets`
- **Required merged P04 commit:** `98177b8` (present on the base branch)
- **No remote change:** no Supabase/Auth/Storage/Vercel/DNS/production settings were touched; no deploy was performed.

## Delivered in this increment

| Route | Access | Status |
|---|---|---|
| `/dashboard` (Overview) | any active member | **Live** — real DB counts, recent enquiries, recently updated content, quick actions, config/empty/unavailable states |
| `/dashboard/enquiries` | any active member | **Live** — search/status/assignee/date filters, bounded pagination, detail view, status/notes/assignment workflow, read-only audit |
| `/dashboard/team` | **owner only** | **Live** — member list, role + active-state editing via the P05 RPC, current-member highlight, accessible confirmation, non-interactive invite note |
| `/dashboard/products` | any active member (delete: owner/admin) | **Live** — searchable/filterable list, create/edit, activate/deactivate, localized EN/AR fields, category relationship + category creation, product detail (positioning/disclaimer), options add/reorder/remove, media selection, `updated_at` optimistic concurrency, accessible delete confirmation, unsaved-change warning |
| `/dashboard/media` | any active member (delete: owner/admin) | **Live** — searchable/type/status-filtered list, create/edit metadata, localized alt text, path/type/status/width/height, safe image preview (https/same-origin only), reference indication, `updated_at` optimistic concurrency, delete refused for seed-backed/referenced assets. No binary upload (metadata only). |
| `/dashboard/services` | any active member (delete: owner/admin) | **Live** — services list, create/edit localized meta + hero fields, active/sort, per-section inline editor (type, localized title/eyebrow/description, active, sort) + add/remove sections. Structured `cta_json`/`items_json` preserved. |
| `/dashboard/partners` | any active member (delete: owner/admin) | **Live** — partners list + editor (name/slug/logo/active/sort); projects list + editor (localized title/summary, active/sort); project-product mappings (catalog product select or null, localized name, status, sort). `project_detail_json` + rich mapping fields (category/description/notes/nutrition/image) preserved — NEEDS_VERIFICATION content never rewritten. |
| `/dashboard/settings` | any active member | **Live** — edits the `shared_content` recipe disclaimer (EN/AR) with optimistic concurrency; the three structured localized point-lists are preserved untouched. |

> **All eight P05 areas are now delivered** on this branch (Overview, Products,
> Media, Services, Partners, Enquiries, Team, Shared content), on the shared
> server-action security spine and the forward-only migration.

## Schema / migration changes

One **forward-only** migration, `supabase/migrations/20260721120000_dashboard_crud_p05.sql`.
It does **not** edit P02/P03/P04. It adds only three narrowly scoped
`SECURITY DEFINER` functions (fixed empty `search_path`, schema-qualified,
identity from `auth.uid()`, `EXECUTE` to `authenticated` only, never `anon`, no
service-role dependency):

1. **`dashboard_set_member_state(member_id, role, is_active)`** — the single
   owner-only, race-safe entry point for team role/state changes. Locks the
   caller and target rows, requires an active owner, **blocks an owner from
   demoting/deactivating their own membership**, and **protects the final active
   owner** (locks the other active-owner rows and refuses the change if none
   remain). Belt-and-braces with the P03 `protect_final_owner` trigger, which
   still guards direct updates.
2. **`dashboard_active_member_count()`** — returns only an integer to an active
   member, so the overview tile is accurate for admins/editors without exposing
   the member list their RLS otherwise hides.
3. **`dashboard_assignable_members()`** — returns only `(id, display_name)` for
   active members, so any member can populate the enquiry assignee picker
   without widening the `dashboard_members` read surface.

No table, column, policy, or grant from earlier patches is modified. All content
CRUD, enquiry reads/updates, and member reads use the **existing** P03 RLS
policies and column grants.

## Role capabilities (unchanged from P03; enforced by the DB)

- **owner** — all content CRUD (incl. hard delete), enquiry workflow, **team management**.
- **admin** — all content CRUD (incl. hard delete), enquiry workflow. No team access.
- **editor** — content **insert/update** (no hard delete), enquiry workflow. No team access.
- **inactive / non-member / anon** — no dashboard data at all.

## Server-action architecture & data security

- `lib/dashboard/action-state.ts` — pure, client-safe result types/helpers (`ActionState`, `IDLE`, `fail`/`invalid`/`success`).
- `lib/dashboard/actions-core.ts` — **server-only** `authorizeAction(minRoles?)`: re-resolves the caller with `getUser()` + the active `dashboard_members` row on **every** request (never `getSession()`), enforces the role, and returns a request-scoped RLS-bound client. Fails closed with generic messages.
- `lib/dashboard/validation.ts` — pure validation mirroring the DB checks: localized `{en, ar}` objects (English required; Arabic optional, matching `is_localized`), bounded text/array/pagination sizes, slug rules, `oneOf` enum guards, and **unknown-field rejection**.
- Server actions (`team-actions.ts`, `enquiry-actions.ts`) run server-side, re-authorize, validate/normalize input, reject unknown fields, use RLS-protected queries or the definer RPC, return **generic** errors (no Supabase/SQL/token/cookie detail), and `revalidatePath` only `/dashboard*`. The browser-submitted role is validated against the enum and never trusted.

### Enquiry workflow

- List: server-side search (sanitized to a safe token set — cannot break the PostgREST filter grammar), status filter, assignee filter, ISO-validated date range, and **bounded pagination** (`.range`, clamped page size ≤ 100).
- Detail: full submission shown to authorized members; **`handled_by` / `handled_at` are read-only** audit info.
- Update: only `status`, `internal_notes`, `assigned_to` are written (P03 column grant). `handled_by`/`handled_at` are **never** sent from the browser — the P03 `stamp_enquiry_handler` trigger stamps them from `auth.uid()`. No enquiry deletion in P05. Enquiry content is never logged.

### Team-management safeguards

- Owner-only page (`requireDashboardRole("owner")`) **and** RLS **and** the definer RPC — three independent layers.
- Editors/admins receive **no** team data and cannot call the mutation (RPC raises `not authorized`).
- An owner **cannot** demote/deactivate themselves; the **final active owner** cannot be demoted/deactivated (atomic, row-locked).
- Changes are confirmed through an accessible native `<dialog>` (focus containment, Escape, focus return).
- A clear, non-interactive note explains that inviting a brand-new Auth user requires the later authorized remote activation phase — there is **no** fake invite button.

## Design & accessibility

Extends the approved P04 glassmorphism system (dashboard-only CSS). Responsive
desktop tables that scroll inside their own container (no page horizontal
overflow at 375px), mobile card layout for team rows, labelled fields with inline
errors, `aria-live` status feedback, keyboard-operable native `<dialog>`
confirmation, visible focus states, and `prefers-reduced-motion` respected. The
P04 desktop sidebar and mobile drawer behavior are unchanged.

## Tests

- **`db:test:crud`** (`scripts/test-dashboard-crud-p05.mjs`) — real PostgreSQL 16 (CI `postgres:16` service container), anon/authenticated roles only: role-scoped content CRUD (editors cannot delete), inactive/anon rejection, owner-only team RPC, editor rejection, **self-deactivation** + **final-owner** protection, enquiry audit **cannot be forged** + is **server-stamped**, FK-protected destructive deletes, `updated_at` bump, and RPC safety (definer + fixed search_path + no anon).
- **`test:dashboard-crud`** (`scripts/test-dashboard-crud-actions.mjs`) — real validation logic + static server-action security guards (re-authorization, unforgeable audit, generic errors, no service-role key, injection-safe queries, bounded pagination).
- **`test:confirm-dialog-a11y`** (`scripts/test-confirm-dialog-a11y.mjs`) — real Chromium: confirmation-dialog focus containment, Escape, focus return.
- P04 regressions kept green: `test:drawer-a11y` (mobile nav), `test:auth-shell`, `test:auth-flow`, `test:callback-cookie-helper`, `test:callback-cookies`, `db:test:auth-nonce`, `scan:client-bundle`.

All P05 CI steps are explicit GitHub Actions steps in `.github/workflows/ci.yml`.

## Remote-testing limitations

No live Supabase credentials are available here, so the React pages were not
exercised against a live Supabase Auth/Postgres. The **database** security model
is proven end-to-end against a real PostgreSQL 16 instance; the **application**
layer is covered by real validation-logic execution + static security guards +
a real-browser dialog test. Full page-level Playwright flows that need an
authenticated session (product editor keyboard flow, mobile CRUD layout, live
enquiry status round-trip, owner vs editor page access) require a local
auth/Supabase fixture harness and are part of the next increment; no production
bypass, hidden test route, or insecure auth shortcut was added.

## Final correctness pass — round 2 (applied)

- **Media create never submits `status`.** The status `<select>` renders only in edit mode; create mode shows a non-editable "new media starts pending" note. `buildMediaCreate` forces `status:'pending'` and rejects a forged status field — proven by an executable test using the exact create-form payload.
- **Unknown-field rejection now covers every mutation, including deletes and team state.** `buildDeleteInput(idKey)` and `buildMemberState` reject any unexpected field (framework `$ACTION_*` ignored) and are wired into `deleteProduct/​ProductOption/​Media/​ServiceSection/​Project/​ProjectProduct` and `setMemberState`. Executable tests prove unexpected fields rejected + valid accepted.
- **Save behavior is executed, not just regex-checked.** The product-detail and enquiry save branching lives in pure, injectable executors (`lib/dashboard/executors.ts`); the actions supply Supabase-backed deps and tests supply canned results. `test:dashboard-crud` executes: product-detail update error / zero-row (stale) / insert error / insert empty / successful update / successful insert; and enquiry assignee-RPC error / inactive-not-in-set / update error / zero-row (stale) / successful update / unassigned-skips-RPC. Static guards remain only as supplementary wiring checks.

## Correctness & data-safety pass (applied)

- **New content is created inactive; new media is pending.** Every create builder sets `is_active:false` (categories, products, services, sections, partners, projects) / `status:'pending'` (media) explicitly — never relying on a DB default — and a forged status field on media create is rejected. Activation is a later explicit edit. (Proven by executing the builders.)
- **Reliable delete rule.** Hard deletion is allowed **only** when the record id is a valid dashboard-created UUID (`isDashboardCreatedId`); seeded deterministic ids (e.g. `prod_arabic_bread`, `detail_toast`, `opt_…`) are edit/deactivate-only. This replaces the old prefix regex and is applied consistently to products, media, product options, service sections, partner projects and project-product mappings. Delete controls are hidden for seed-backed children; editors never see a working hard-delete. FK reference protection is retained. (The PG test shows the DB itself permits deleting a seeded option, so the app-side UUID guard is the real protection.)
- **Product-option editing.** `updateProductOptionAction` edits type + EN/AR label + sort with `updated_at` optimistic concurrency, enum/localized validation, field-level errors and stale-save feedback; seeded options are editable but not removable.
- **No partial product saves / false success.** The product core and its 1:1 detail are now **independent** saves (`updateProductAction` / `updateProductDetailAction`); each checks every `{ data, error }` and only reports success when its own operation actually affected a row. The detail save never touches the localized array columns.
- **Enquiry hardening.** The assignee is validated server-side against the active-member set (`dashboard_assignable_members` RPC) — not the browser's options; null stays unassigned; malformed/inactive/nonexistent ids are rejected. The update carries `expectedUpdatedAt` optimistic concurrency, returns the affected id, and treats zero rows as a generic failure (never "updated"). `handled_by`/`handled_at` remain DB-stamped and absent from browser input.
- **Unknown submitted fields are rejected** by an allowlist in every mutation's builder (framework `$ACTION…` bookkeeping ignored), proven by executing real action parsing.
- No P02/P03/P04 or P05 **migration** change was required for this pass — all fixes are application-level.

## Products CRUD — destructive-action & concurrency rules

- **Optimistic concurrency:** edits carry the loaded `updated_at`; the update runs `… .eq("id", id).eq("updated_at", expected)`. Because the P02 trigger bumps `updated_at` on every write, a concurrent edit makes the guard match 0 rows and the save is rejected with "refresh and try again" (proven at the DB level).
- **Deactivate vs delete:** the default is deactivation. Physical deletion is **owner/admin only**, **refused for seed-backed ids** (`prod_`/`cat_`/… prefixes), and refused by the database for any FK-referenced row (surfaced as a generic "referenced elsewhere" message). Deletion requires an accessible confirmation dialog.
- **Localized list preservation:** the product-detail `overview` / `use-case` / `recipe` localized arrays are **preserved untouched** on save (only positioning + disclaimer are edited here), so existing Arabic list content is never silently discarded.
- **Options:** any active member can add/reorder options; hard-removing an option is owner/admin (matching the P03 content-delete rule).

## Remaining for the next increment / P06

- Structured-list editing for the shared-content point arrays and service/section `items_json` / project `detail_json` (currently preserved read-only to avoid data loss).
- Full page-level Playwright flows against a local authenticated Supabase fixture harness (product editor keyboard flow, mobile CRUD layout, live enquiry round-trip, owner-vs-editor page access). This patch covers the confirmation-dialog and mobile-nav accessibility in real Chromium and the whole DB/RBAC model against real PostgreSQL 16.
- Supabase-backed **public** reads (ISR) — explicitly out of scope for P05.
