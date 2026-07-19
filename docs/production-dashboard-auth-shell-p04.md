# Production Patch 04 — Dashboard Auth Experience & App Shell

Builds the production dashboard **authentication experience** and the **protected
application shell** on top of the P03 Auth/RBAC foundation: sign-in, password
recovery/update, PKCE/auth callback, dashboard-scoped session-refresh middleware,
protected routes with server-side authorization, forbidden/inactive handling,
sign-out, a responsive glassmorphism shell, and a **read-only** overview.

**Out of scope (deferred):** content CRUD for products/media/services/partners,
enquiry management, and team management are secure "Coming next" placeholders.
No remote Supabase/Auth/Production changes, no public signup, no public-website
change.

## 1. Branches

- **Source branch (PR base):** `ui/homepage-glassmorphism-higgsfield-assets`
- **Required prior merge:** P03 commit `69bb40bc0711e1de91e91f9573d6d506e41f7606` (confirmed in history)
- **This branch:** `prod/dashboard-auth-shell-p04`

## 2. Route map

All routes live under `/dashboard` with an isolated root layout (`noindex`),
separate from the public `(en)/`/`ar/` route groups.

| Route | Group | Access | Notes |
|---|---|---|---|
| `/dashboard/login` | (auth) | public | email/password sign-in; no signup |
| `/dashboard/forgot-password` | (auth) | public | recovery request; identical response always |
| `/dashboard/update-password` | (auth) | authenticated (recovery/invite) session | server-validated password update |
| `/dashboard/auth/callback` | route handler | public | PKCE code exchange (server-side) |
| `/dashboard/forbidden` | (auth) | authenticated non-member | generic no-access page |
| `/dashboard` | (protected) | active member | **read-only overview (complete)** |
| `/dashboard/products` | (protected) | active member | placeholder |
| `/dashboard/services` | (protected) | active member | placeholder |
| `/dashboard/partners` | (protected) | active member | placeholder |
| `/dashboard/media` | (protected) | active member | placeholder |
| `/dashboard/enquiries` | (protected) | active member | placeholder |
| `/dashboard/team` | (protected) | **owner only** (server-enforced) | placeholder |
| `/dashboard/settings` | (protected) | active member | placeholder |

## 3. Authentication flows

- **Sign-in** — `signInAction` calls `signInWithPassword`. Invalid credentials →
  generic "Invalid email or password." (never reveals whether the email exists).
  Success → redirect to a **validated** return path (defaults to `/dashboard`).
- **Forgot password** — `requestPasswordResetAction` always shows the same "if an
  account exists…" response regardless of existence. The recovery link's
  `redirectTo` is built from the **canonical site URL** →
  `<site>/dashboard/auth/callback?type=recovery`.
- **Auth callback** — `GET /dashboard/auth/callback` exchanges the PKCE `code`
  **server-side** (`exchangeCodeForSession`), validates the `next` path, and
  redirects. `recovery`/`invite` types land on `/dashboard/update-password`.
  Tokens are never placed in URLs, logs, page content, or client storage;
  invalid/expired links produce a generic `?error=auth` redirect to login.
- **Update password** — requires an authenticated (recovery/invite) session
  (enforced by the page and middleware). Server-side validation: **min 12 chars**
  + confirmation match; passwords are never logged. Success → `/dashboard`.
- **Sign-out** — `signOutAction` invalidates the Supabase session and returns to
  `/dashboard/login`.

No `signUp()` is called anywhere and there is no signup route — dashboard users
are invited/created later through an authorized operator process (P03 bootstrap).

## 4. Middleware / session behavior

`middleware.ts`, `matcher: ["/dashboard", "/dashboard/:path*"]` — **dashboard-only**.
Public locale routes, APIs, `_next` assets, images, sitemap, and robots are never
matched.

- Refreshes the Supabase auth cookies via `@supabase/ssr`.
- Validates identity with **`getUser()`** (verified against Supabase Auth), never
  the unverified `getSession()`.
- Early-redirects unauthenticated users on **protected** paths to
  `/dashboard/login` with a validated `returnTo`. Auth pages (login,
  forgot-password, forbidden, auth/callback) are exempt; `update-password` is
  **not** exempt (it needs a session).
- **Not** the final authorization boundary — the protected server layout still
  enforces membership and role, and RLS remains the database boundary.
- Fails closed but gracefully when Supabase env is missing (passes through; the
  server layout redirects protected pages to login).
- Adds dashboard-scoped security headers (`X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`,
  `X-Robots-Tag: noindex, nofollow`) — scoped to `/dashboard`, so the public
  website is unaffected.

## 5. Server-side authorization boundaries

- `lib/auth/dashboard.ts` — `getDashboardAuthState()` returns
  `unauthenticated | forbidden | ok` (fail-closed), so the shell can send
  unauthenticated users to login and inactive/non-members to `/dashboard/forbidden`
  **without revealing** whether an email is a configured member.
  `requireDashboardMember()` guards the protected layout; `requireDashboardRole(...)`
  adds role checks (Team = owner-only). `DASHBOARD_SIGN_IN_PATH` is now
  `/dashboard/login`.
- The **protected layout** (`(protected)/layout.tsx`) enforces membership on every
  protected route; the **Team page** enforces `owner` server-side. Authorization
  never relies on client-side checks. All queries use the **request user's**
  Supabase client (anon key + cookies) — **no service-role key** in dashboard
  runtime or client bundles. RLS is the enforcement boundary.

## 6. Redirect validation (`lib/auth/redirect.ts`)

`safeDashboardReturnPath()` accepts only internal paths that, after a single
decode, begin with `/dashboard`. It rejects absolute URLs (`https://evil…`),
protocol-relative (`//evil`, `/\evil`), encoded external targets
(`%2F%2Fevil`, `https%3A%2F%2F…`), backslashes, control/whitespace characters,
non-dashboard paths, and auth-route loops (login/callback/update-password/
forbidden). Query strings and fragments are dropped. Anything invalid → `/dashboard`.

## 7. Password recovery/update flow

Forgot-password → recovery email (via canonical site URL) → `/dashboard/auth/callback`
(server-side code exchange) → `/dashboard/update-password` (requires the recovery
session) → server-validated update (≥12 chars + confirm) → `/dashboard`. The
update-password route is unavailable without an authenticated session.

## 8. Role-aware navigation (`lib/auth/dashboard-nav.ts`)

| Section | owner | admin | editor |
|---|:--:|:--:|:--:|
| Overview / Products / Services / Partners / Media / Enquiries / Settings | ✅ | ✅ | ✅ |
| Team | ✅ | hidden | hidden |

Only **Overview** is `implemented` in P04; the rest render a "Coming next" badge.
Navigation visibility is convenience only — the Team route is enforced
server-side regardless.

## 9. Dashboard shell & overview

- **Shell** (`components/dashboard/DashboardShell.tsx`, client only for the mobile
  toggle + active-route state): warm glassmorphism, cream background, deep-green
  accents, subtle gold; responsive desktop/tablet/mobile with a collapsible,
  keyboard-accessible mobile nav; visible focus states; reduced-motion aware.
  Header shows the member display name, a role badge, a sign-out control, and the
  mobile nav toggle. Sidebar shows role-aware nav with current-route state.
- **Overview** (`(protected)/page.tsx`, read-only): count cards for products,
  services, partners, media assets, and new enquiries; the member's name/role;
  a database connection state; an enquiries-at-a-glance (aggregate counts only —
  **no enquiry contents**); and quick links. Uses the authenticated client under
  P03 RLS, **no writes, no service role**. Each card is isolated so one failed
  query can't crash the page; missing/unavailable data degrades gracefully.

## 10. Missing-env behavior (fail closed, build stays green)

Env validation is lazy (P01). Without `NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY`:
- the login page still renders; submission fails safely with a generic
  "Dashboard authentication is not configured yet." message (no stack trace, no
  secrets);
- protected routes redirect to login;
- **`npm run build` stays green** (all dashboard routes are `ƒ` dynamic and are
  never invoked at build). Verified locally with no Supabase env set.

## 11. Required later configuration (documented, NOT applied)

Set in **Supabase Auth → URL Configuration** for later authorized setup:

- **Site URL:** `https://alshehai.ae`
- **Redirect URLs (allow-list):**
  - `https://alshehai.ae/dashboard/auth/callback`
  - `https://alshehai.ae/dashboard/update-password`
  - Vercel Preview patterns (add per the deployment's preview domain), e.g.
    `https://<project>-*.vercel.app/dashboard/auth/callback` — add each preview
    origin your team uses; document/rotate carefully. **Not configured remotely
    by this patch.**

**Vercel environment variables** (runtime; not required for build): `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, and the server-only
`SUPABASE_SERVICE_ROLE_KEY` (used only by the P03 operator bootstrap, never in
runtime dashboard code). **Vercel project must run Node.js 22** (P03).

## 12. Testing & limitations

- `npm run test:auth-shell` — dependency-free; executes the **real** pure TS logic
  (via the project's `typescript` compiler) for return-path validation, password
  policy, and role-aware nav; plus static guards (no `signUp()`/signup route, no
  service-role in dashboard runtime, dashboard-only middleware matcher using
  `getUser`, server-side membership/owner enforcement, generic errors, no tokens
  in callback redirects). **CI.**
- Playwright smoke: `/dashboard/login` renders at 375/768/1440 with no console/
  hydration errors and zero horizontal overflow and `noindex`; unauthenticated
  `/dashboard`, `/dashboard/products`, `/dashboard/team` redirect to login; public
  `/`, `/ar/`, `/products/` stay 200; dashboard security headers present, absent on
  public.
- Existing P02 seed-safety, P03 RBAC, and scanner tests remain green; post-build
  client-bundle scan finds no server secret.

**Remote-testing limitation:** no live Supabase credentials are available here, so
real login/invite/recovery against Supabase Auth was **not** exercised. Only the
pure redirect/session helpers, missing-config fail-closed behavior, and redirect
wiring were tested. Real email/password sign-in, the recovery email, invite
onboarding, and the PKCE exchange remain **untested until an authorized remote
setup** configures Supabase Auth URLs and env.

## 13. Deferred to Patch 05

Content-management CRUD (products, media, services, partners), enquiry management
(with the P03 workflow columns and audit stamping), and team management (owner-only
member/role administration) UIs; wiring the public website reads to Supabase
(with ISR) remains a separate later track, as do the contact-form API + Resend +
Turnstile.
