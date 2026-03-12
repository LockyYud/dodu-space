import type { BlogFrontmatter } from "@/lib/content/blog";
import type { ProjectFrontmatter } from "@/lib/content/project";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

export function parseBlogFrontmatter(
  slug: string,
  data: Record<string, unknown>,
): BlogFrontmatter {
  let date = new Date().toISOString().slice(0, 10);
  if (typeof data.publishedAt === "string") {
    date = data.publishedAt;
  }
  if (typeof data.date === "string") {
    date = data.date;
  }

  return {
    title: typeof data.title === "string" ? data.title : slug,
    date,
    tags: toStringArray(data.tags),
    summary: typeof data.summary === "string" ? data.summary : "",
    featured: typeof data.featured === "boolean" ? data.featured : false,
    published: typeof data.published === "boolean" ? data.published : true,
  };
}

export function parseProjectFrontmatter(
  slug: string,
  data: Record<string, unknown>,
): ProjectFrontmatter {
  return {
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "",
    tags: toStringArray(data.tags),
    featured: typeof data.featured === "boolean" ? data.featured : false,
    github: typeof data.github === "string" ? data.github : undefined,
    demo: typeof data.demo === "string" ? data.demo : undefined,
    thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : undefined,
  };
}
