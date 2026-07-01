import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.rennproducts.com",
      lastModified: new Date("2026-06-29"),
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}
