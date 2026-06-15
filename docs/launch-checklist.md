# Launch Checklist — Al Shehail Food Industries

Pre-launch checklist for the public preview and production launch. Pair this
with `docs/assets-needed.md` for the outstanding asset list.

> Tip: asset-placeholder hints are hidden from public visitors by default.
> To review them internally, append `?assetHints=1` to any URL
> (e.g. `https://www.alshehai.ae/?assetHints=1`). They always show in local dev.

## Content review
- [ ] Company positioning and copy reviewed and approved
- [ ] Product names, categories, and descriptions verified
- [ ] Private label / recipe wording kept non-overclaiming (safe language intact)
- [ ] No unverified figures (capacity, factory size, outlet counts, team size)
- [ ] Spelling/grammar pass on all pages

## Contact details
- [ ] Phone correct: +971 54 743 1444
- [ ] WhatsApp correct: +971 54 743 1444 (wa.me/971547431444)
- [ ] Email correct: info@alshehai.ae
- [ ] Address correct: New Industrial Area, Umm Al Quwain, UAE

## Forms and WhatsApp
- [ ] Contact form opens WhatsApp with all fields prefilled
- [ ] Form success/next-step message displays correctly
- [ ] WhatsApp CTAs on product pages include the product name
- [ ] All "Request Consultation" / "Start a Project" CTAs reach /contact
- [ ] Test on real mobile device (WhatsApp deep link opens the app)

## SEO metadata
- [ ] Each page has a unique, non-duplicated title (absolute titles in use)
- [ ] Descriptions are clear and not keyword-stuffed
- [ ] Canonical URLs resolve to https://www.alshehai.ae
- [ ] sitemap.xml and robots.txt reachable and correct
- [ ] Organization + Product JSON-LD present
- [ ] Add a social share / Open Graph image (1200×630)

## Images and logos
- [ ] Official Al Shehail logo added (header + footer) — see assets-needed.md
- [ ] Real product photos replace icon placeholders
- [ ] Hero factory/production imagery added
- [ ] Partner logos replace monogram placeholders
- [ ] Retail logos replace monogram placeholders
- [ ] All images optimized (WebP/JPG) with alt text

## Certificates and approvals
- [ ] ISO certificate scan/logo added
- [ ] HACCP certificate scan/logo added
- [ ] Organic certificate scan/logo added
- [ ] Carrefour approval proof/logo added
- [ ] Usage rights confirmed for all third-party marks

## Vercel deployment
- [ ] Project connected to the Git repository
- [ ] Production build passes (`npm run build`)
- [ ] Environment variables configured (analytics IDs when ready)
- [ ] Preview deployment reviewed and approved

## Domain connection
- [ ] alshehai.ae / www.alshehai.ae pointed to the deployment
- [ ] HTTPS / SSL active
- [ ] www vs non-www redirect behavior confirmed
- [ ] metadataBase / canonical domain matches the live domain

## Analytics / tracking
- [ ] Decide which tools to enable (GA4, Meta Pixel, LinkedIn Insight)
- [ ] Set IDs via environment variables (see lib/analytics.ts)
- [ ] Enable the script block in app/layout.tsx
- [ ] Confirm consent/cookie requirements for target markets
- [ ] Verify events fire in each platform

## Final mobile review
- [ ] Navigation and mobile menu work on small screens
- [ ] Hero, teasers, and cards stack cleanly
- [ ] Product filter works on mobile
- [ ] Forms are usable on mobile keyboards
- [ ] Tap targets and spacing comfortable
- [ ] No layout overflow or horizontal scroll
