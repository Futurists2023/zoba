import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: `${siteUrl}/cost-of-living/cape-town`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
