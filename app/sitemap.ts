import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-04");
  const routes = [
    ["", 1],
    ["/about", 0.8],
    ["/products", 0.9],
    ["/process", 0.7],
    ["/contact", 0.8]
  ] as const;

  return routes.map(([route, priority]) => ({
    url: `https://www.rennproducts.com${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority
  }));
}
