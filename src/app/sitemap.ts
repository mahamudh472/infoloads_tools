import { MetadataRoute } from "next";
import { TOOLS } from "@/data/tools";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.infoloads.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // 1. Core pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // 2. All Individual Tool Pages
  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.categorySlug || "developer-tools"}/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: tool.popular ? 0.85 : 0.75,
  }));

  return [...staticPages, ...toolPages];
}
