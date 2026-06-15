// Tracking / analytics configuration — PLACEHOLDERS ONLY.
//
// No tracking scripts are loaded yet and no real IDs are present. When the
// business is ready to enable analytics:
//   1. Set the relevant ID below (preferably via an environment variable, e.g.
//      NEXT_PUBLIC_GA_MEASUREMENT_ID) instead of hardcoding it.
//   2. Add the corresponding <Script> tags in app/layout.tsx (see the commented
//      placeholder block there) and gate them on the ID being present.
//   3. Confirm a cookie/consent approach if required for the target markets.
//
// Until then these remain empty and nothing is injected into the page.

export const analyticsConfig = {
  // Google Analytics 4 — e.g. "G-XXXXXXXXXX"
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",

  // Meta (Facebook) Pixel — e.g. "1234567890"
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",

  // LinkedIn Insight Tag — Partner ID, e.g. "1234567"
  linkedInPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "",
} as const;

export const analyticsEnabled =
  analyticsConfig.googleAnalyticsId !== "" ||
  analyticsConfig.metaPixelId !== "" ||
  analyticsConfig.linkedInPartnerId !== "";
