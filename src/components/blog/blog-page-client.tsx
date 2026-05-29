"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { LocalizedText } from "@/components/custom/localized-text";
import { SectionHeader } from "@/components/custom/section-header";
import type { BlogPost } from "@/lib/content/blog";
import { cn } from "@/lib/utils";
import { BlogCard } from "./blog-card";

const TOP_TOPIC_COUNT = 8;

type BlogPageClientProps = Readonly<{
  posts: BlogPost[];
}>;

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    // Sort by count desc, then alphabetically
    return Array.from(counts.entries()).sort((a, b) =>
      b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0]),
    );
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag =
        !selectedTag || (post.tags ?? []).includes(selectedTag);
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.summary ?? "").toLowerCase().includes(q) ||
        (post.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });
  }, [posts, selectedTag, search]);

  const hasFilter = search.trim() || selectedTag;
  const topTopics = tagCounts.slice(0, TOP_TOPIC_COUNT);
  const moreTopics = tagCounts.slice(TOP_TOPIC_COUNT);

  const renderTopicButton = (tag: string, count: number) => {
    const isSelected = selectedTag === tag;

    return (
      <button
        key={tag}
        type="button"
        onClick={() => setSelectedTag(isSelected ? null : tag)}
        className={cn(
          "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors",
          isSelected
            ? "border-[var(--color-accent-text)] bg-[var(--color-accent-text)]/10 text-[var(--color-accent-text)]"
            : "bg-background/60 text-muted-foreground hover:border-[var(--color-accent-text)]/50 hover:text-foreground",
        )}
      >
        <span>#{tag}</span>
        <span
          className={cn(
            "rounded-full px-1 text-[10px]",
            isSelected ? "bg-[var(--color-accent-text)]/20" : "bg-muted/80",
          )}
        >
          {count}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <SectionHeader
        eyebrow="blog"
        title={<LocalizedText vi="Bài viết" en="Blogs" />}
        titleAs="h1"
        description={
          <LocalizedText
            vi="Bài viết từ thực tế xây dựng hệ thống AI hướng production: RAG, retrieval, agents, streaming và hạ tầng LLM."
            en="Technical posts from building production-oriented AI systems: RAG, retrieval, agents, streaming, and LLM infrastructure."
          />
        }
      />

      {/* Search + Filter */}
      <div className="flex flex-col gap-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background/70 py-2 pl-9 pr-4 text-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-[var(--color-accent-text)] focus:ring-1 focus:ring-[var(--color-accent-text)]/30"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Tag filter */}
        <div className="rounded-lg border bg-card/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-accent-text)]">
              <LocalizedText vi="Chủ đề" en="Topics" />
            </p>
            {selectedTag && (
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
                <LocalizedText vi="Bỏ lọc" en="Clear" />
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {topTopics.map(([tag, count]) => renderTopicButton(tag, count))}
            {moreTopics.length > 0 ? (
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-md border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-[var(--color-accent-text)]/50 hover:text-foreground">
                  <LocalizedText vi="Thêm chủ đề" en="More topics" />
                  <span className="rounded-full bg-muted/80 px-1 text-[10px]">
                    {moreTopics.length}
                  </span>
                </summary>
                <div className="absolute right-0 z-20 mt-2 grid w-64 grid-cols-1 gap-2 rounded-lg border bg-popover p-3 shadow-lg">
                  {moreTopics.map(([tag, count]) =>
                    renderTopicButton(tag, count),
                  )}
                </div>
              </details>
            ) : null}
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredPosts.length > 0 ? (
        <section className="space-y-4">
          {hasFilter && (
            <p className="text-sm text-muted-foreground">
              {filteredPosts.length}{" "}
              <LocalizedText
                vi={filteredPosts.length === 1 ? "bài viết" : "bài viết"}
                en={filteredPosts.length === 1 ? "blog" : "blogs"}
              />
              {selectedTag && (
                <>
                  {" "}
                  <LocalizedText vi="trong" en="in" />{" "}
                  <span className="text-[var(--color-accent-text)]">
                    #{selectedTag}
                  </span>
                </>
              )}
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border bg-card/50 py-16 text-center">
          <p className="text-sm font-medium">
            <LocalizedText
              vi="Không tìm thấy bài viết phù hợp"
              en="No blogs found"
            />
          </p>
          <p className="text-xs text-muted-foreground">
            <LocalizedText
              vi="Thử từ khóa khác hoặc bỏ bộ lọc tag"
              en="Try a different search or clear the tag filter"
            />
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedTag(null);
            }}
            className="mt-1 text-xs text-[var(--color-accent-text)] hover:underline"
          >
            <LocalizedText vi="Xóa bộ lọc" en="Reset filters" />
          </button>
        </div>
      )}
    </div>
  );
}
