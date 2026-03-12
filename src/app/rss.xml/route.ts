import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getBlogPosts } from "@/lib/content/blog";

export async function GET(_req: NextRequest) {
  const posts = await getBlogPosts();

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/blog/${post.slug}`;
      return `<item>
<title>${escapeXml(post.title)}</title>
<link>${url}</link>
<guid>${url}</guid>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
<description>${escapeXml(post.summary ?? "")}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escapeXml(siteConfig.title)} - Blog</title>
<link>${siteConfig.url}</link>
<description>${escapeXml(siteConfig.description)}</description>
${items}
</channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
