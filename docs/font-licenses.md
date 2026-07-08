# Font licenses

Self-hosted font files used by this project, their source, license, and
where each is used. All font files are committed under `app/fonts/`; full
license text is also duplicated in `public/fonts/arabic/LICENSES/` (kept
inside `public/` so the raw license text ships alongside the asset for
anyone auditing the deployed site, not just the repo).

## English / Latin fonts

Unchanged by this task — loaded via `next/font/google` in `app/(en)/layout.tsx`
(`next/font/google` handles self-hosting for these automatically at build
time, same as before):

- **Inter** — body/sans (`--font-inter`). SIL Open Font License.
- **Playfair Display** — headings/serif (`--font-playfair`). SIL Open Font License.

## Arabic fonts (self-hosted, this task)

Both fonts below were downloaded directly from Google Fonts' own open-source
font repository (`github.com/google/fonts`, the canonical, official
upstream source Google Fonts itself is built from) and are committed as
static files in this repo — **no runtime request is made to
fonts.googleapis.com or fonts.gstatic.com for either of these fonts.**
`next/font/local` is used instead of `next/font/google` so the files are
loaded exactly like any other local asset.

### Kufam — Arabic heading / display / badges / feature points

- **Source**: https://github.com/google/fonts/tree/main/ofl/kufam
  (upstream project: https://github.com/originaltype/kufam)
- **License**: SIL Open Font License, Version 1.1
- **Copyright**: 2019 The Kufam Project Authors
- **File**: `app/fonts/arabic/Kufam-VariableFont_wght.ttf` (variable font,
  weight axis 400–900; this project only exposes the 400–700 range via
  `next/font/local`'s `weight: "400 700"` to avoid the font's heavier
  800/900 cuts, which read as too black/aggressive for this site)
- **License text**: `public/fonts/arabic/LICENSES/OFL-Kufam.txt`
- **Used for**: `--font-playfair` on Arabic pages (`app/ar/layout.tsx`) —
  i.e. everywhere `.heading-serif` / `font-serif` is used: hero headings,
  `PageHero`, `SectionHeading`, and other display-scale headings.
- **Why Kufam**: a modern, Kufi-inspired display face with Arabic support
  confirmed in Google Fonts' own metadata (`subsets: arabic`,
  `primary_script: Arab`) — a cleaner, calmer alternative to a heavier Kufi
  display face for a premium B2B site.

### IBM Plex Sans Arabic — Arabic body / paragraphs / nav / forms / cards

- **Source**: https://github.com/google/fonts/tree/main/ofl/ibmplexsansarabic
  (upstream project: IBM's Plex type family)
- **License**: SIL Open Font License, Version 1.1
- **Copyright**: 2017–2019 IBM Corp., Reserved Font Name "Plex"
- **Files** (static weights, `app/fonts/arabic/`):
  - `IBMPlexSansArabic-Regular.ttf` (400)
  - `IBMPlexSansArabic-Medium.ttf` (500)
  - `IBMPlexSansArabic-SemiBold.ttf` (600)
  - `IBMPlexSansArabic-Bold.ttf` (700)
- **License text**: `public/fonts/arabic/LICENSES/OFL-IBMPlexSansArabic.txt`
- **Used for**: `--font-inter` on Arabic pages (`app/ar/layout.tsx`) —
  i.e. everywhere `font-sans` / body text is used: paragraphs, navigation,
  form labels/inputs, product/service cards, footer.
- **Why IBM Plex Sans Arabic**: clean, professional, highly readable Arabic
  body type with a well-supported weight range that avoids ever needing an
  800/900 cut for body copy.

## Why these two, not Noto Kufi Arabic / next/font/google

The Arabic layout previously used `next/font/google` with `Noto Kufi Arabic`
(weights up to 800) for headings and `IBM Plex Sans Arabic` (via Google
Fonts) for body text. This felt oversized/heavy in the hero and large
section headlines. This task:

- Replaced the heading face with **Kufam**, restricted to 400–700, for a
  visually calmer display feel.
- Kept **IBM Plex Sans Arabic** (same family as before) for body text, but
  switched it from `next/font/google` to a self-hosted `next/font/local`
  setup so no Arabic font is fetched via Google's font-serving
  infrastructure, at build time or runtime.
- Paired both reductions with locale-aware (`rtl:`) font-size and
  line-height adjustments on the largest headings (hero, `PageHero`,
  `SectionHeading`) — see the relevant component files — since Kufam's
  proportions read larger than the same pixel size in Latin type even before
  any size reduction.

## Verifying no Google Fonts requests remain for Arabic

- `app/ar/layout.tsx` imports only `next/font/local` (no `next/font/google`).
- `npm run build` output (`out/ar/**/*.html`) contains zero references to
  `fonts.googleapis.com` or `fonts.gstatic.com`.
- Font files are served from the site's own `_next/static/media/` output,
  the same way any other self-hosted static asset is.
