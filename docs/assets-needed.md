# Assets Needed — Al Shehail Food Industries Landing Page

This checklist tracks the real assets required to replace the current
placeholders on the landing page. The site is fully functional and premium
without them; supplying these simply swaps placeholders for verified brand,
product, and proof assets.

Once an asset file is dropped into the correct `/public/assets/` folder, update
the matching path in `lib/assets.ts` (e.g. change `null` to the path string).
The component will automatically use the real asset on next build.

## Recommended formats (general)

- **Logos:** SVG preferred; transparent PNG acceptable.
- **Photos:** WebP preferred; JPG acceptable.
- **Certificates:** PDF or high-resolution scan.

## Recommended orientations

- **Hero / factory images:** wide landscape (e.g. 16:9).
- **Product photos:** square (1:1) or 4:3.
- **Factory / production images:** landscape.
- **Certificates:** PDF or high-resolution scan (portrait, as issued).

---

## 1. Brand assets

| Asset | Destination | Suggested filename | `lib/assets.ts` key |
|---|---|---|---|
| Official logo (horizontal) | `/public/assets/brand/` | `al-shehail-logo.svg` | `brand.logoHorizontal` |
| Logo mark / favicon (square) | `/public/assets/brand/` | `al-shehail-mark.svg` | `brand.logoMark` |

- **Official logo** — transparent PNG or SVG, horizontal version preferred (used in header and footer).
- **Logo mark** — square SVG or PNG for favicon and icon contexts.
- [ ] `brand.logoHorizontal` — `al-shehail-logo.svg`
- [ ] `brand.logoMark` — `al-shehail-mark.svg`

---

## 2. Partner logos

Used in the "Manufacturing Partner For" section. SVG preferred, transparent
PNG acceptable.

| Asset | Destination | Suggested filename | `lib/assets.ts` key |
|---|---|---|---|
| HÄLSA Bake | `/public/assets/partners/` | `halsa-bake.svg` | `partners.halsaBake` |
| EKTIFA | `/public/assets/partners/` | `ektifa.svg` | `partners.ektifa` |
| Al Taj | `/public/assets/partners/` | `al-taj.svg` | `partners.alTaj` |
| Al Tahan | `/public/assets/partners/` | `al-tahan.svg` | `partners.alTahan` |

- [ ] `partners.halsaBake` — `halsa-bake.svg`
- [ ] `partners.ektifa` — `ektifa.svg`
- [ ] `partners.alTaj` — `al-taj.svg`
- [ ] `partners.alTahan` — `al-tahan.svg`

---

## 3. Product photos

Used in the "What We Manufacture" cards and product detail pages.
Square (1:1) or 4:3, WebP preferred.

| Asset | Destination | Suggested filename | `lib/assets.ts` key |
|---|---|---|---|
| Arabic Bread | `/public/assets/products/` | `arabic-bread.webp` | `products.arabicBread` |
| Bread Wraps | `/public/assets/products/` | `bread-wraps.webp` | `products.breadWraps` |
| Toast | `/public/assets/products/` | `toast.webp` | `products.toast` |
| Burger Buns | `/public/assets/products/` | `burger-buns.webp` | `products.burgerBuns` |
| Bread Rolls | `/public/assets/products/` | `bread-rolls.webp` | `products.breadRolls` |
| Croissant | `/public/assets/products/` | `croissant.webp` | `products.croissant` |
| Mini Croissant | `/public/assets/products/` | `mini-croissant.webp` | `products.miniCroissant` |
| Pâte / Puff Pastry | `/public/assets/products/` | `pate.webp` | `products.pate` |
| Maa'moul | `/public/assets/products/` | `maamoul.webp` | `products.maamoul` |
| Tamriya | `/public/assets/products/` | `tamriya.webp` | `products.tamriya` |

- [ ] `products.arabicBread` — `arabic-bread.webp`
- [ ] `products.breadWraps` — `bread-wraps.webp`
- [ ] `products.toast` — `toast.webp`
- [ ] `products.burgerBuns` — `burger-buns.webp`
- [ ] `products.breadRolls` — `bread-rolls.webp`
- [ ] `products.croissant` — `croissant.webp`
- [ ] `products.miniCroissant` — `mini-croissant.webp`
- [ ] `products.pate` — `pate.webp`
- [ ] `products.maamoul` — `maamoul.webp`
- [ ] `products.tamriya` — `tamriya.webp`

---

## 4. Factory / production images

Used in the hero visual and about/capabilities sections. Wide landscape,
WebP/JPG, high resolution.

| Asset | Destination | Suggested filename | `lib/assets.ts` key |
|---|---|---|---|
| Factory exterior / facility | `/public/assets/factory/` | `exterior.webp` | `factory.exterior` |
| Bakery production line | `/public/assets/factory/` | `production-line.webp` | `factory.productionLine` |
| Packaging / private-label line | `/public/assets/factory/` | `packaging-line.webp` | `factory.packagingLine` |
| Quality control / lab | `/public/assets/factory/` | `quality-control.webp` | `factory.qualityControl` |
| Warehousing / dispatch | `/public/assets/factory/` | `warehousing.webp` | `factory.warehousing` |

- [ ] `factory.exterior` — `exterior.webp` (primary hero image)
- [ ] `factory.productionLine` — `production-line.webp`
- [ ] `factory.packagingLine` — `packaging-line.webp`
- [ ] `factory.qualityControl` — `quality-control.webp`
- [ ] `factory.warehousing` — `warehousing.webp`

---

## 5. Certification documents / logos

Used in the "Certifications & Quality" section. Official certificate scan
(PDF or high-res image) plus the certifying body logo (SVG/PNG) where allowed.

| Asset | Destination | Suggested filename | `lib/assets.ts` key |
|---|---|---|---|
| ISO Certified | `/public/assets/certifications/` | `iso.svg` | `certifications.iso` |
| HACCP Certified | `/public/assets/certifications/` | `haccp.svg` | `certifications.haccp` |
| Organic Certified | `/public/assets/certifications/` | `organic.svg` | `certifications.organic` |
| Carrefour Approved | `/public/assets/certifications/` | `carrefour-approved.svg` | `certifications.carrefourApproved` |

- [ ] `certifications.iso` — `iso.svg` (or `.webp` scan)
- [ ] `certifications.haccp` — `haccp.svg` (or `.webp` scan)
- [ ] `certifications.organic` — `organic.svg` (or `.webp` scan)
- [ ] `certifications.carrefourApproved` — `carrefour-approved.svg` (or `.webp`)

> Confirm usage rights for any third-party certification marks before publishing.

---

## 6. Retail presence logos

Used in the "Market Presence" logo wall. SVG preferred, transparent PNG
acceptable. Confirm usage rights for each retailer mark before publishing.

| Asset | Destination | Suggested filename | `lib/assets.ts` key |
|---|---|---|---|
| Carrefour | `/public/assets/retail/` | `carrefour.svg` | `retail.carrefour` |
| Union Coop | `/public/assets/retail/` | `union-coop.svg` | `retail.unionCoop` |
| Abu Dhabi Coop | `/public/assets/retail/` | `abu-dhabi-coop.svg` | `retail.abuDhabiCoop` |
| Sharjah Coop | `/public/assets/retail/` | `sharjah-coop.svg` | `retail.sharjahCoop` |
| Al Maya Group | `/public/assets/retail/` | `al-maya-group.svg` | `retail.alMayaGroup` |
| Lulu Hypermarket | `/public/assets/retail/` | `lulu-hypermarket.svg` | `retail.luluHypermarket` |
| Nesto Hypermarket | `/public/assets/retail/` | `nesto-hypermarket.svg` | `retail.nestoHypermarket` |
| Grandiose Supermarket | `/public/assets/retail/` | `grandiose.svg` | `retail.grandiose` |
| Spinneys | `/public/assets/retail/` | `spinneys.svg` | `retail.spinneys` |
| Waitrose UAE | `/public/assets/retail/` | `waitrose-uae.svg` | `retail.waitroseUae` |

- [ ] `retail.carrefour` — `carrefour.svg`
- [ ] `retail.unionCoop` — `union-coop.svg`
- [ ] `retail.abuDhabiCoop` — `abu-dhabi-coop.svg`
- [ ] `retail.sharjahCoop` — `sharjah-coop.svg`
- [ ] `retail.alMayaGroup` — `al-maya-group.svg`
- [ ] `retail.luluHypermarket` — `lulu-hypermarket.svg`
- [ ] `retail.nestoHypermarket` — `nesto-hypermarket.svg`
- [ ] `retail.grandiose` — `grandiose.svg`
- [ ] `retail.spinneys` — `spinneys.svg`
- [ ] `retail.waitroseUae` — `waitrose-uae.svg`

---

## 7. Open Graph / social image

| Asset | Destination | Suggested filename | `lib/assets.ts` key |
|---|---|---|---|
| Social share image (1200×630) | `/public/assets/og/` | `al-shehail-og.jpg` | `og.default` |

- [ ] `og.default` — `al-shehail-og.jpg` (1200×630 px, JPG or WebP)

Once supplied, also update `app/layout.tsx` `openGraph.images` to reference this path.

---

## 8. Optional future assets

- [ ] Founder / leadership portrait(s) and short bio.
- [ ] Team / staff photography.
- [ ] Customer / partner testimonials (quote, name, brand, optional headshot).
- [ ] Case studies (product developed → shelf outcome).
- [ ] Short facility or process video (B-roll) for the hero or about section.
- [ ] Verified company facts/figures (only if confirmed) — capacity, certifications dates, etc.
