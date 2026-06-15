# Beta.001 — Status Note

Snapshot of the Al Shehail Food Industries website at the Beta.001 milestone:
the first static-export build prepared for static server deployment.

## Current website state

- Light-mode, premium B2B marketing site for **Al Shehail Food Industries**,
  positioned as a *UAE-Based Bakery Manufacturing & Private Label Partner*
  ("From idea to shelf").
- Built with **Next.js 14 (App Router), TypeScript, Tailwind CSS**.
- Configured for **static export** (`output: "export"`) — the build produces a
  fully static `/out` folder that runs on any standard web server with no
  Node.js runtime.
- Design and content are **complete and stable** for this milestone. Beta.001
  does not change the design or copy — it only prepares the static build.

## Pages included

| Route | Page |
|---|---|
| `/` | Home (hero, partners, products, teasers, CTA) |
| `/about` | About |
| `/products` | Product catalog (grouped by category) |
| `/products/[slug]` | 10 product detail pages (see below) |
| `/private-label` | Private label process |
| `/capabilities` | Capabilities |
| `/quality` | Quality & certifications |
| `/partners` | Partners & market presence |
| `/contact` | Contact (B2B form → WhatsApp) |
| `/sitemap.xml` | Generated sitemap |
| `/robots.txt` | Generated robots file |
| `/404` | Not-found page |

**Product detail pages (10):** Arabic Bread, Bread Wraps, Toast, Burger Buns,
Bread Rolls, Croissant, Mini Croissant, Pate, Maa'moul, Tamriya.

## Assets status

- A centralized asset manifest lives in `lib/assets.ts`. All asset paths are
  currently **`null`** — no real brand, product, factory, certification, or
  retail imagery has been supplied yet.
- The `/public/assets/` folder structure is in place
  (`brand`, `partners`, `products`, `factory`, `certifications`, `retail`,
  `og`) and ready to receive files.
- Image optimization is disabled (`images.unoptimized: true`) as required for
  static export; images will be served as-is once supplied.
- Outstanding assets and exact drop-in paths are tracked in
  `docs/assets-needed.md`.

## Known placeholders

Because no real assets are supplied yet, the following are intentional
placeholders that render gracefully:

- **Brand logo** — text wordmark / monogram in header and footer.
- **Partner logos** — brand monograms (e.g. "HB", "EK").
- **Product photos** — gradient tiles with category icons.
- **Hero visual** — "From idea to shelf" pipeline card (no factory photo yet).
- **Certifications** — shield-icon marks (no certificate scans/logos yet).
- **Retail logos** — retailer-name monograms.
- **Open Graph image** — not yet supplied (1200×630 social share image).

Internal asset hints are hidden from public visitors; append `?assetHints=1`
to any URL to reveal them for review. They always show in local dev.

## Contact / WhatsApp behavior

- **No backend.** The contact form composes a prefilled message and opens
  WhatsApp via a `wa.me` deep link — fully compatible with static hosting.
- WhatsApp / phone number: **+971 54 743 1444** (`wa.me/971547431444`).
- Email: **info@alshehai.ae**.
- Product detail pages include a "Request This Product" WhatsApp CTA that
  prefills the product name.
- No analytics or tracking scripts are loaded (placeholders only — see
  `lib/analytics.ts`).

## Deployment method

- **Static export** to `/out` via `npm run build` (alias: `npm run build:static`).
- Deploy by uploading the **contents of `/out`** to the server web root.
- `trailingSlash: true` makes every route a directory with `index.html`, so it
  serves on virtually any static host without rewrite rules.
- Full instructions: `docs/beta-001-static-deployment.md`.

## Next step after Beta.001

**Designer assets integration.** Once the design team supplies real assets
(logo, product photography, factory imagery, certification scans/logos, retail
logos, and the Open Graph image):

1. Drop each file into the matching `/public/assets/<folder>/` directory using
   the filename in `docs/assets-needed.md`.
2. Update the corresponding `null` path in `lib/assets.ts`.
3. Rebuild — components automatically swap placeholders for the real assets.
