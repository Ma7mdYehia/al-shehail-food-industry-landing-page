import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

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
    ...products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
