import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-25");
  const pages: [string, number][] = [
    ["", 1],
    ["/produse", 0.9],
    ["/evenimente", 0.9],
    ["/degustari", 0.6],
    ["/povestea", 0.6],
    ["/galerie", 0.5],
    ["/contact", 0.8],
  ];
  return [
    ...pages.map(([p, priority]) => ({ url: `${site.url}${p}`, lastModified, changeFrequency: "weekly" as const, priority })),
    ...products.map((p) => ({
      url: `${site.url}/produse/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.8 : 0.6,
      images: p.photo ? [`${site.url}${p.photo}`] : undefined,
    })),
  ];
}
