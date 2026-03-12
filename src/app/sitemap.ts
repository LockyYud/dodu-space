import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const pages = ["", "/about", "/projects", "/blog", "/craft", "/resume"].map(
    (path) => ({
      url: new URL(path || "/", base).toString(),
      lastModified: new Date(),
    }),
  );

  return pages;
}
