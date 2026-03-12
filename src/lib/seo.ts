import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type PageMeta = {
  title?: string;
  description?: string;
};

export function createMetadata(meta: PageMeta = {}): Metadata {
  const title = meta.title ?? siteConfig.title;
  const description = meta.description ?? siteConfig.description;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      siteName: siteConfig.title,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
