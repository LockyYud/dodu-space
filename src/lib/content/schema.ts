import type { BlogFrontmatter } from "@/lib/content/blog";
import type { ProjectFrontmatter } from "@/lib/content/project";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return undefined;
}

/**
 * YAML parses an unquoted `date: 2026-05-16` into a Date, not a string, so a
 * string-only check silently dated every post to today. Accept both.
 */
function toDateString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return undefined;
}

export function parseBlogFrontmatter(
  slug: string,
  data: Record<string, unknown>,
): BlogFrontmatter {
  const date =
    toDateString(data.date) ??
    toDateString(data.publishedAt) ??
    new Date().toISOString().slice(0, 10);

  return {
    title: typeof data.title === "string" ? data.title : slug,
    date,
    tags: toStringArray(data.tags),
    summary: typeof data.summary === "string" ? data.summary : "",
    featured: typeof data.featured === "boolean" ? data.featured : false,
    published: typeof data.published === "boolean" ? data.published : false,
    thread: typeof data.thread === "string" ? data.thread : undefined,
    threadTitle:
      typeof data.threadTitle === "string" ? data.threadTitle : undefined,
    phase: typeof data.phase === "string" ? data.phase : undefined,
    part: toOptionalNumber(data.part),
  };
}

export function parseProjectFrontmatter(
  slug: string,
  data: Record<string, unknown>,
): ProjectFrontmatter {
  return {
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: toDateString(data.date) ?? "",
    tags: toStringArray(data.tags),
    featured: typeof data.featured === "boolean" ? data.featured : false,
    github: typeof data.github === "string" ? data.github : undefined,
    demo: typeof data.demo === "string" ? data.demo : undefined,
    thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : undefined,
  };
}
