import type { MetadataRoute } from "next";

const baseUrl = "https://www.alshehai.ae";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Product detail routes (/products/[slug]) will be added in Sprint 2.
  ];
}
