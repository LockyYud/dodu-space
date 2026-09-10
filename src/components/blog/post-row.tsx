import Link from "next/link";

import { LocalizedText } from "@/components/custom/localized-text";
import type { BlogPost } from "@/lib/content/blog";
import { formatBlogTitle } from "@/lib/content/blog-format";
import { cn } from "@/lib/utils";

/**
 * One line in an index: date, title, right-hand meta. Replaces the old card
 * grid — a table of contents reads faster than a wall of boxes, and long
 * Vietnamese titles get the full column width.
 */
export function PostRow({
  post,
  className,
}: Readonly<{ post: BlogPost; className?: string }>) {
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const year = date.getFullYear();
  const title = formatBlogTitle(post.title);
  const minutes = post.readingMinutes ?? 1;
  /**
   * The thread name is the same on nearly every row (almost everything is RAG
   * Systems), so the right column carries the most specific tag instead —
   * "Corrective RAG", "Roadmap", "BM25" tell a scanner something new.
   */
  const kind =
    (post.tags ?? []).find((tag) => tag !== "RAG") ?? (post.tags ?? [])[0];

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "group grid gap-x-6 gap-y-2 border-t border-border-soft py-5 md:grid-cols-[7rem_minmax(0,1fr)_9rem]",
        className,
      )}
    >
      <span className="meta text-muted-foreground md:pt-1.5">
        {formattedDate}
        <span className="md:hidden"> {year}</span>
      </span>

      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[22px] leading-snug [overflow-wrap:anywhere] transition-colors group-hover:text-[var(--color-accent-text)] md:text-2xl">
          {title.title}
        </span>
        {post.summary ? (
          <span className="text-base leading-relaxed text-muted-foreground">
            {post.summary}
          </span>
        ) : null}
        {title.subtitle ? (
          <span className="meta text-muted-foreground/80">
            {title.subtitle}
          </span>
        ) : null}
      </span>

      {/* Stacked, not inline: "RAG Systems · 4 min" wrapped mid-separator in
          the narrow column and left a dangling dot. */}
      <span className="meta flex flex-wrap items-baseline gap-x-2 text-muted-foreground md:flex-col md:items-end md:gap-y-0.5 md:pt-1.5">
        {kind ? <span>{kind}</span> : null}
        <span>
          {minutes} <LocalizedText vi="phút" en="min" />
        </span>
      </span>
    </Link>
  );
}
