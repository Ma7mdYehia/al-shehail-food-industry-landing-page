# Beta.001 — Static Deployment Guide

This guide explains how to build the Al Shehail Food Industries site as a fully
static website and deploy it to any standard static web server (Apache, Nginx,
shared hosting, S3, etc.). No Node.js runtime is required on the server — the
output is plain HTML, CSS, JS, and assets.

## Prerequisites (local machine)

- **Node.js** 18.17 or later (LTS recommended)
- **npm** (bundled with Node.js)
- **git**

## 1. Pull the project locally

```bash
git clone https://github.com/Ma7mdYehia/al-shehail-food-industry-landing-page.git
cd al-shehail-food-industry-landing-page
```

If you already have the repository, get the latest `main`:

```bash
git checkout main
git pull origin main
```

## 2. Install dependencies

```bash
npm install
```

## 3. Build the static site

```bash
npm run build
```

> `npm run build:static` runs the same build — it is provided as an explicit,
> self-documenting alias for the static export step. With `output: "export"`
> set in `next.config.mjs`, `next build` generates the static site automatically.

## 4. Where the output folder is

The build writes the complete static site to:

```
/out
```

It contains `index.html`, one folder per page (each with its own `index.html`),
the `_next/` asset bundles, `/assets/`, `sitemap.xml`, `robots.txt`, and a
`404.html`.

Example structure:

```
out/
  index.html            ← home page
  about/index.html
  capabilities/index.html
  contact/index.html
  partners/index.html
  private-label/index.html
  quality/index.html
  products/index.html
  products/arabic-bread/index.html
  products/croissant/index.html
  ... (all 10 product detail pages)
  assets/               ← brand/product/etc. asset folders
  _next/                ← compiled JS/CSS bundles
  sitemap.xml
  robots.txt
  404.html
```

## 5. What to upload to the final server

Upload **the contents of `/out`**, not the `out` folder itself.

- ✅ Correct: copy everything *inside* `out/` into the server's web root
  (e.g. `public_html/`, `/var/www/html/`) so that `index.html` sits at the
  web root.
- ❌ Incorrect: uploading the `out` folder so the site lives at
  `https://example.com/out/` — this breaks all root-relative paths.

> **Important:** Upload the contents of `/out`, not the folder itself, unless
> the server is specifically configured to serve from an `out/` subdirectory.

Because the build uses `trailingSlash: true`, each route is a real directory
with an `index.html`, so links like `/about/` resolve on virtually any static
host without extra rewrite rules.

## 6. Test locally after build

Serve the `out/` folder with any static file server and open it in a browser:

```bash
# Option A — npx serve (no install needed)
npx serve out

# Option B — Python's built-in server
cd out && python3 -m http.server 8080
```

Then visit the printed URL (e.g. http://localhost:3000 or
http://localhost:8080) and check:

- Home page loads
- All nav links work (About, Products, Private Label, Capabilities, Quality,
  Partners, Contact)
- Product detail pages load (e.g. `/products/croissant/`)
- Contact form opens WhatsApp with a prefilled message
- `/sitemap.xml` and `/robots.txt` are reachable

## 7. Create the Beta.001 git tag

After the deployment build is confirmed, tag the release:

```bash
git tag -a beta-001 -m "Beta.001 — static export deployment"
git push origin beta-001
```

To list and verify tags:

```bash
git tag
git show beta-001
```
