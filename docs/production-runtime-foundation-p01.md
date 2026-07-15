# Production Patch 01 — Vercel Runtime Foundation

Converts the approved project from a static-export-only app into a safe
Vercel-hosted Next.js **runtime** foundation, and lays the (inert) groundwork
for future Supabase, Auth, Storage, dynamic content, an admin dashboard, a
contact-form API, Resend email, and Turnstile — **without implementing any of
those features and without any visible website change.**

## 1. Branches

- **Approved source branch (source of truth):** `ui/homepage-glassmorphism-higgsfield-assets`
- **This implementation branch:** `prod/runtime-foundation-p01` (PR base = the source branch)

## 2. Production facts

- **Final domain:** https://alshehai.ae
- **Official email:** info@alshehai.ae
- **Contact-form notification recipients:**
  - marketing@halsabake.com
  - osama@halsabake.com

## 3. Confirmed future dashboard users (roles TBD — not assigned in Patch 01)

| User | Email | Role |
|---|---|---|
| M.Yehia | marketing@halsabake.com | TBD |
| O.Abdullah | osama@halsabake.com | TBD |
| A.Zaid | gm@elshohail.com | TBD |

Roles/permissions are intentionally **not** assigned in this patch.

## 4. Required environment variables

All names live in `.env.example`. **Real values are never committed** — set
server secrets in the Vercel project settings; use `.env.local` (git-ignored)
for local development.

| Variable | Scope | Purpose | Needed in Patch 01? |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Canonical site origin (defaults to `https://alshehai.ae`) | optional |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL | later |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase anon key | later |
| `SUPABASE_SERVICE_ROLE_KEY` | **server-only secret** | Full-access key; never exposed to client | later |
| `RESEND_API_KEY` | **server-only secret** | Email delivery | later |
| `CONTACT_FROM_EMAIL` | server | Contact "from" (default: `Al Shehail Website <info@alshehai.ae>`) | later |
| `CONTACT_TO_EMAILS` | server | Comma-separated recipients | later |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public | Turnstile widget site key | later |
| `TURNSTILE_SECRET_KEY` | **server-only secret** | Turnstile verification | later |
| `ADMIN_ALLOWED_EMAILS` | server | Future dashboard access allowlist | later |

**No runtime variable is required for the Patch 01 build to pass** — validation
is lazy (each accessor throws a clear error only when its service is actually
used). Typed accessors:
- `lib/env/public.ts` — public (`NEXT_PUBLIC_*`) values, browser-safe.
- `lib/env/server.ts` — server-only secrets, guarded so importing it into
  client code throws immediately.

## 5. Local development commands

```bash
npm ci               # clean install from package-lock.json
npm run dev          # local dev server
npm run seed:validate
npm run lint
npm run typecheck    # NEW: tsc --noEmit
npm run build        # Vercel-style runtime build (no /out export)
npm run start        # serve the production build locally
```

## 6. CI commands

`.github/workflows/ci.yml` runs on `pull_request`, pushes to `main`, and
pushes to `prod/**`. Node 20 LTS with npm cache. Steps:

1. `npm ci`
2. `npm run seed:validate`
3. `npm run lint`
4. `npm run typecheck`
5. `npm run build`

CI does **not** deploy and does **not** require production secrets. Vercel
remains solely responsible for Preview and Production deployments.

## 7. Vercel Preview verification steps

The repo is already connected to the existing Vercel project — **do not create
a new project, reconnect, change the domain, or promote to Production.** The PR
into the source branch generates a normal Preview automatically. On the Preview
URL, verify:

1. `GET /api/health` → HTTP 200, body `{"status":"ok","service":"al-shehail-food-industries-website"}`
   (this proves the Vercel runtime is serving, not a static export).
2. `/` and `/ar` render; RTL correct on Arabic.
3. Products catalog + every generated product page work.
4. Partner/client and contact pages work; existing WhatsApp form behavior intact.
5. Images and videos load (next/image now optimized by the Vercel runtime).
6. No route from the recorded baseline is missing.

## 8. What is intentionally NOT implemented in Patch 01

Supabase DB connection, migrations, seed import, dynamic product/partner/service
queries, admin dashboard, admin login, dashboard roles/permissions, contact-form
email sending, Resend integration, enquiry storage, Turnstile UI, rate limiting,
CSP, WhatsApp changes, and any content/design/SEO/layout change. The Supabase
client modules and env modules are **foundation only** — nothing calls them, and
the site still reads from the TypeScript content modules under `lib/`.

## 9. Rollback instructions

This patch is a self-contained branch; nothing is merged or deployed to
Production by it.

- **Abandon the patch:** close the PR without merging. The source branch
  `ui/homepage-glassmorphism-higgsfield-assets` is untouched and remains the
  source of truth. Delete `prod/runtime-foundation-p01` if desired.
- **Revert after a merge:** `git revert` the squash/merge commit on the source
  branch, then redeploy. The only functional changes to undo are
  `next.config.mjs` (re-add `output: "export"` + `images.unoptimized: true`),
  `package.json` (restore `build:static`, pin `next`/`eslint-config-next` back
  to `14.2.5`), and removal of the added foundation files
  (`app/api/health/`, `lib/env/`, `lib/supabase/`, `.github/workflows/ci.yml`).
- **Vercel:** since Patch 01 never promotes to Production, the live
  `alshehai.ae` deployment is unaffected regardless.

## 10. Secrets warning

**All secrets must be configured in Vercel (Project → Settings → Environment
Variables) and never committed to git.** `SUPABASE_SERVICE_ROLE_KEY`,
`RESEND_API_KEY`, and `TURNSTILE_SECRET_KEY` are server-only and must never be
placed behind a `NEXT_PUBLIC_` name or referenced from a Client Component.
`.env`, `.env*.local` are git-ignored; only `.env.example` (names + safe
examples) is committed.

## 11. Security note — remaining Next.js advisories

`next` was upgraded `14.2.5 → 14.2.35` (latest 14.2.x patch), which cleared the
critical advisory present at baseline. Several **newer** Next.js advisories are
only remediated in Next 15/16 (a major upgrade explicitly out of scope for this
patch), so `npm audit --omit=dev` still reports them against 14.2.35. This is
**reported, not forced** — see the PR description's audit section. A Next
15/16 major upgrade should be scheduled as its own patch.

## 12. Related legacy docs

The original static-export deployment guides (`docs/beta-001-static-deployment.md`,
`docs/Beta.001.md`) are marked **LEGACY / SUPERSEDED** and point here. Some
planning docs (`docs/database-*.md`, `docs/static-seed-export-phase-1b.md`)
mention `output: "export"` as context from when the site was static-export; those
references predate this patch and are left as historical planning context.
