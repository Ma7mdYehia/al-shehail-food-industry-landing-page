import type { MetadataRoute } from "next";
import { products } from "@/lib/products/catalog";

const baseUrl = "https://www.alshehai.ae";

// English canonical paths with their priority. /capabilities and /quality
// redirect into /private-label, so they are not listed. Each path is emitted
// for both locales (English at the path, Arabic under /ar).
const paths: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/products", priority: 0.8 },
  { path: "/private-label", priority: 0.8 },
  { path: "/partners", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/services/distribution", priority: 0.7 },
  { path: "/services/brand-design", priority: 0.7 },
  { path: "/services/digital-marketing", priority: 0.7 },
  ...products.map((p) => ({ path: `/products/${p.slug}`, priority: 0.7 })),
];

function arPath(path: string): string {
  return path === "/" ? "/ar" : `/ar${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return paths.flatMap(({ path, priority }) => [
    {
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    },
    {
      url: `${baseUrl}${arPath(path)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    },
  ]);
}
