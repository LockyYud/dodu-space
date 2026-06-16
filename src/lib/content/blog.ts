import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { extractToc } from "@/lib/content/blog-format";
import { compileMdx, contentPaths } from "@/lib/content/mdx";
import { parseBlogFrontmatter } from "@/lib/content/schema";

export type BlogFrontmatter = {
  title: string;
  date: string;
  tags?: string[];
  summary?: string;
  featured?: boolean;
  published?: boolean;
  thread?: string;
  threadTitle?: string;
  phase?: string;
  part?: number;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  readingMinutes: number;
};

function toSlug(filename: string) {
  return path.basename(filename).replace(/\.mdx$/, "");
}

async function listBlogFilePaths(dir: string): Promise<string[]> {
  const entries = await fs
    .readdir(dir, { withFileTypes: true })
    .catch(() => []);
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return listBlogFilePaths(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        return [entryPath];
      }

      return [];
    }),
  );

  return files.flat();
}

async function getBlogFilePathBySlug(slug: string) {
  const filePaths = await listBlogFilePaths(contentPaths.blog);
  return filePaths.find((filePath) => toSlug(filePath) === slug);
}

function estimateReadingMinutes(source: string) {
  const text = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[{}[\]#>*_~|()-]/g, " ")
    .trim();

  const words = text.split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 200));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const filePaths = await listBlogFilePaths(contentPaths.blog);

  const posts = await Promise.all(
    filePaths.map(async (filePath) => {
      const slug = toSlug(filePath);
      const raw = await fs.readFile(filePath, "utf8");
      const { content, data } = matter(raw);
      const fm = parseBlogFrontmatter(slug, data as Record<string, unknown>);

      return {
        slug,
        ...fm,
        published: fm.published === true && content.trim().length > 0,
        readingMinutes: estimateReadingMinutes(content),
      } satisfies BlogPost;
    }),
  );

  return posts
    .filter((p) => p.published === true)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPostBySlug(slug: string) {
  const filePath = await getBlogFilePathBySlug(slug);
  if (!filePath) {
    throw new Error("Blog post not found.");
  }

  const raw = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(raw);

  const frontmatter = parseBlogFrontmatter(
    slug,
    data as Record<string, unknown>,
  );

  if (frontmatter.published !== true || content.trim().length === 0) {
    throw new Error("Blog post is not published.");
  }

  return compileMdx({
    frontmatter: {
      ...frontmatter,
      readingMinutes: estimateReadingMinutes(content),
      toc: extractToc(content),
    },
    source: content,
  });
}
