import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { compileMdx, contentPaths } from "@/lib/content/mdx";
import { parseProjectFrontmatter } from "@/lib/content/schema";

export type ProjectFrontmatter = {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  featured?: boolean;
  github?: string;
  demo?: string;
  thumbnail?: string;
};

export type Project = ProjectFrontmatter & {
  slug: string;
};

function toSlug(filename: string) {
  return filename.replace(/\.mdx$/, "");
}

export async function getProjects(): Promise<Project[]> {
  const entries = await fs
    .readdir(contentPaths.projects, { withFileTypes: true })
    .catch(() => []);
  const slugs = entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => toSlug(e.name));

  const projects = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = path.join(contentPaths.projects, `${slug}.mdx`);
      const raw = await fs.readFile(filePath, "utf8");
      const { data } = matter(raw);
      const fm = parseProjectFrontmatter(slug, data as Record<string, unknown>);

      return {
        slug,
        ...fm,
      } satisfies Project;
    }),
  );

  return projects.sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));
}

export async function getProjectBySlug(slug: string) {
  const filePath = path.join(contentPaths.projects, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(raw);

  const frontmatter = parseProjectFrontmatter(
    slug,
    data as Record<string, unknown>,
  );

  return compileMdx({
    frontmatter,
    source: content,
  });
}
