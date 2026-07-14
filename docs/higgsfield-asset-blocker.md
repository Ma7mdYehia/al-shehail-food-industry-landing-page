# Higgsfield asset generation — environment blocker

This branch was tasked with generating new website imagery through the
connected Higgsfield MCP (Soul / Soul Cinema), saving the files into the
repo, and wiring them into the redesigned UI. **The generation half works;
the download half is blocked by this environment's egress policy, so no
generated asset could be saved into the repository.** This document records
the exact limitation so the work can be finished once egress is opened.

## What works

- Higgsfield MCP connected and authenticated (balance: 647.66 credits, "max" plan).
- Both required models are available and are the free/low-cost tiers:
  - **Soul** → model id `soul_2` ("Higgsfield Soul 2.0"), ~0.12 credits per 2k image.
  - **Soul Cinema** → model id `soul_cinematic` ("Soul Cinema"), ~0.12 credits per 2k image.
- A controlled test image was generated successfully (Soul Cinema, 4:3, 2k,
  job `9624f861-07c6-48df-99ca-2b8a52d7d5e4`) to establish the visual
  language. It completed and returned a CDN URL.

## What is blocked

The generated image is only retrievable from Higgsfield's CDN, and **every
Higgsfield host is denied by this session's outbound egress policy** (HTTP
403 CONNECT denials, confirmed against the proxy status endpoint):

| Host | Result |
|---|---|
| `d8j0ntlcm91z4.cloudfront.net` (per-user generated-image bucket) | 403 policy denial |
| `cdn.higgsfield.ai` (Higgsfield CDN) | 403 policy denial |
| `higgsfield.ai` (apex) | 403 policy denial |

The MCP server itself exposes only UI-widget HTML resources
(`ui://higgsfield/*`) — it does **not** expose the generated image bytes as a
readable MCP resource — so there is no in-band path to the file either.

The proxy policy explicitly instructs not to retry or route around 403
denials, and the task explicitly forbids (a) putting temporary Higgsfield
URLs in production code, (b) using a different image service as a fallback,
and (c) silently switching approaches. With the CDN blocked and no
MCP-native byte export, there is no compliant way to land the assets on disk
in this environment.

(Note: the Higgsfield MCP server later disconnected entirely during the
session, removing generation capability as well.)

## To finish the image work later

1. Allowlist the Higgsfield egress hosts for this environment's network
   policy — at minimum `*.cloudfront.net` for the returned bucket (or the
   specific `d8j0ntlcm91z4.cloudfront.net`) plus `cdn.higgsfield.ai`. Package
   registries and `raw.githubusercontent.com` are already allowed; these
   media hosts are not.
2. Re-run generation with Soul / Soul Cinema per the visual language below,
   download each result into `public/assets/generated/<section>/`, optimize
   to WebP, register in `lib/assets.ts`, and wire into the components (hero
   media, about visual, service icons, final-CTA background, market
   background).

## Established visual language (for when generation resumes)

Shared prompt spine (one coordinated campaign):

> Premium UAE food-manufacturing brand. Modern clean bakery environment. Warm
> natural daylight blended with clean controlled industrial lighting.
> Champagne-gold highlights, cream and warm-neutral / ivory palette. Realistic
> food and materials (flour, dough, baked crust, packaging). Elegant high-end
> B2B commercial photography, refined editorial composition, shallow depth of
> field, realistic proportions. Generous soft negative space for overlays.

Shared negative constraints (append to every prompt):

> no text, no letters, no words, no logos, no brand names, no signage, no
> readable labels, no watermarks, no gibberish text, no surreal food, no
> deformed hands, no extra fingers, no neon, no blue tint, no cyberpunk, no
> dark moody tone, no cartoon, no low quality, no oversaturation.

Model allocation: Soul Cinema for hero slides / final-CTA / wide editorial
scenes; Soul for service icons and clean supporting visuals. Do **not**
generate product photos (all 17 already have real photography), partner
logos, or certification marks.

## What was delivered instead on this branch

Because the redesign itself does not depend on the new imagery, the warm
Glassmorphism UI revamp was implemented against the **existing real assets**
(17 product photos, 3 partner logos, 10 retail logos, brand logo, background
videos, 7 process images) and the current premium fallback panels. The site
remains fully bilingual (en + /ar), RTL-correct, and static-export-clean, and
is ready to have generated imagery dropped into the registered slots once
egress is opened.
