// The two uploaded videos used across the existing final CTA panels.
// Each uses the generated CTA still as a loading/fallback poster.
const poster = "/assets/generated/final-cta-background.webp";

export const ctaMedia = {
  ideaToShelf: {
    video: "/assets/videos/from-idea-to-shelf-bg.mp4",
    poster,
  },
  quality: {
    video: "/assets/videos/quality-certifications-bg.mp4",
    poster,
  },
} as const;
