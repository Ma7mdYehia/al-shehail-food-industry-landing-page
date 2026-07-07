# Legacy hero slides (archived)

This document preserves a manufacturing-only hero slide variant that was
retained in `lib/content.ts` as reference material but was never rendered by
any page. It has been removed from the runtime codebase — the live homepage
hero is driven entirely by `homepageHeroSlides` in `lib/homepageEcosystem.ts`,
rendered via `components/hero/HeroSlider.tsx`.

## Why this existed

Early in the project, the hero was planned as a single-track "manufacturing
journey" slider. It was superseded by the broader "service ecosystem" hero
(product + services + private label, not just manufacturing stages), so this
block was kept around only for historical reference and was never imported
anywhere in the app.

## Archived content (English only, as it existed in code)

**Trust points** (shown on select slides):
- ISO / HACCP Systems
- Private Label Ready
- Retail Supply Support

**Slide 1 of 1** (only the first slide of the originally-planned set was ever
fleshed out; the rest were never written):

- Eyebrow: UAE-Based Bakery Manufacturing & Private Label Partner
- Title: Private Label Bakery Manufacturing in the UAE
- Description: From product concept to retail-ready bakery — developed,
  manufactured, packed, and scaled for modern food brands.
- CTA: Start a Project → `/contact`
- Trust points: ISO / HACCP Systems, Private Label Ready, Retail Supply Support
- Image: `/images/hero-journey/product-idea.webp`
- Image alt: Shaping a new bakery product idea and concept

## Current equivalent

The live hero (`lib/homepageEcosystem.ts` → `homepageHeroSlides`) covers the
same "from idea to shelf" narrative across a fuller multi-stage slider and is
the single source of truth for hero content going forward.
