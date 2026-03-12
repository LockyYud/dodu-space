import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { compileMdx, contentPaths } from "@/lib/content/mdx";
import { parseBlogFrontmatter } from "@/lib/content/schema";

export type BlogFrontmatter = {
  title: string;
  date: string;
  tags?: string[];
  summary?: string;
  featured?: boolean;
  published?: boolean;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
};

function toSlug(filename: string) {
  return filename.replace(/\.mdx$/, "");
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await fs
    .readdir(contentPaths.blog, { withFileTypes: true })
    .catch(() => []);
  const slugs = entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => toSlug(e.name));

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = path.join(contentPaths.blog, `${slug}.mdx`);
      const raw = await fs.readFile(filePath, "utf8");
      const { data } = matter(raw);
      const fm = parseBlogFrontmatter(slug, data as Record<string, unknown>);

      return {
        slug,
        ...fm,
      } satisfies BlogPost;
    }),
  );

  return posts
    .filter((p) => p.published !== false)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPostBySlug(slug: string) {
  const filePath = path.join(contentPaths.blog, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(raw);

  const frontmatter = parseBlogFrontmatter(
    slug,
    data as Record<string, unknown>,
  );

  return compileMdx({
    frontmatter,
    source: content,
  });
}
