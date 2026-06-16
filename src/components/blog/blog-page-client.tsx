"use client";

import { BookOpen, Layers3, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { LocalizedText } from "@/components/custom/localized-text";
import { SectionHeader } from "@/components/custom/section-header";
import type { BlogPost } from "@/lib/content/blog";
import { cn } from "@/lib/utils";
import { BlogCard } from "./blog-card";

const TOP_TOPIC_COUNT = 8;

type ResearchThread = {
  id: string;
  title: string;
  descriptionVi: string;
  descriptionEn: string;
  statusVi?: string;
  statusEn?: string;
  matches: (post: BlogPost) => boolean;
};

const RESEARCH_THREADS: ResearchThread[] = [
  {
    id: "llm-from-scratch",
    title: "LLM From Scratch",
    descriptionVi:
      "Transformer, GPT-2 style LM, LLaMA-style block và serving từ góc nhìn implement.",
    descriptionEn:
      "Transformer, GPT-2 style LMs, LLaMA-style blocks, and serving from an implementation lens.",
    statusVi: "Roadmap đã có",
    statusEn: "Roadmap drafted",
    matches: (post) =>
      post.thread === "llm-from-scratch" ||
      post.tags?.some((tag) =>
        ["LLM From Scratch", "Transformer", "GPT"].includes(tag),
      ) === true,
  },
  {
    id: "rag-systems",
    title: "RAG Systems",
    descriptionVi:
      "Retrieval, reranking, GraphRAG, evaluation và các quyết định production.",
    descriptionEn:
      "Retrieval, reranking, GraphRAG, evaluation, and production trade-offs.",
    matches: (post) =>
      post.thread === "rag-systems" ||
      post.tags?.some((tag) =>
        [
          "RAG",
          "GraphRAG",
          "Retrieval",
          "Evaluation",
          "Reranking",
          "Qdrant",
          "Neo4j",
        ].includes(tag),
      ) === true,
  },
  {
    id: "paper-notes",
    title: "Paper Notes",
    descriptionVi:
      "Ghi chú đọc paper tập trung vào thesis, trade-off và hướng triển khai.",
    descriptionEn:
      "Paper reading notes focused on thesis, trade-offs, and implementation paths.",
    matches: (post) =>
      post.thread === "paper-notes" ||
      /\b(20\d{2})\b/.test(post.slug) ||
      post.tags?.some((tag) =>
        ["DPR", "RAPTOR", "Adaptive RAG", "Corrective RAG"].includes(tag),
      ) === true,
  },
  {
    id: "engineering",
    title: "Engineering Notes",
    descriptionVi:
      "Tooling, framework, streaming và các ghi chú xây hệ thống hằng ngày.",
    descriptionEn:
      "Tooling, frameworks, streaming, and day-to-day system building notes.",
    matches: (post) =>
      post.thread === "engineering" ||
      post.tags?.some((tag) =>
        [
          "FastAPI",
          "Next.js",
          "Streaming",
          "Neovim",
          "Linux",
          "Tooling",
        ].includes(tag),
      ) === true,
  },
];

type BlogPageClientProps = Readonly<{
  posts: BlogPost[];
}>;

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

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
      const matchesThread =
        !selectedThread ||
        RESEARCH_THREADS.find(
          (thread) => thread.id === selectedThread,
        )?.matches(post) === true;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.summary ?? "").toLowerCase().includes(q) ||
        (post.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesThread && matchesSearch;
    });
  }, [posts, selectedTag, selectedThread, search]);

  const threadCounts = useMemo(() => {
    return new Map(
      RESEARCH_THREADS.map((thread) => [
        thread.id,
        posts.filter((post) => thread.matches(post)).length,
      ]),
    );
  }, [posts]);

  const hasFilter = search.trim() || selectedTag || selectedThread;
  const topTopics = tagCounts.slice(0, TOP_TOPIC_COUNT);
  const moreTopics = tagCounts.slice(TOP_TOPIC_COUNT);
  const selectedThreadTitle = RESEARCH_THREADS.find(
    (thread) => thread.id === selectedThread,
  )?.title;

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

      {/* Research threads */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-accent-text)]">
              <LocalizedText vi="Research threads" en="Research threads" />
            </p>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              <LocalizedText
                vi="Các chuỗi bài dài vẫn nằm trong blog archive, chỉ được nhóm lại để dễ theo dõi mạch nghiên cứu."
                en="Long-running writing threads stay inside the blog archive, grouped so the research path is easier to follow."
              />
            </p>
          </div>
          {selectedThread ? (
            <button
              type="button"
              onClick={() => setSelectedThread(null)}
              className="hidden items-center gap-1 text-xs text-muted-foreground hover:text-foreground sm:flex"
            >
              <X className="size-3" />
              <LocalizedText vi="Xem tất cả" en="All posts" />
            </button>
          ) : null}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {RESEARCH_THREADS.map((thread) => {
            const count = threadCounts.get(thread.id) ?? 0;
            const isSelected = selectedThread === thread.id;

            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => setSelectedThread(isSelected ? null : thread.id)}
                className={cn(
                  "group flex min-h-32 flex-col justify-between rounded-lg border bg-card/60 p-4 text-left transition-colors hover:border-[var(--color-accent-text)]/50",
                  isSelected
                    ? "border-[var(--color-accent-text)] bg-[var(--color-accent-text)]/10"
                    : "",
                )}
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="space-y-2">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <BookOpen className="size-4 text-[var(--color-accent-text)]" />
                      {thread.title}
                    </span>
                    <span className="block text-sm leading-6 text-muted-foreground">
                      <LocalizedText
                        vi={thread.descriptionVi}
                        en={thread.descriptionEn}
                      />
                    </span>
                  </span>
                  <span className="rounded-md border bg-background/70 px-2 py-1 text-xs text-muted-foreground">
                    {count} <LocalizedText vi="bài" en="posts" />
                  </span>
                </span>
                <span className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Layers3 className="size-3.5" />
                    {thread.statusVi && thread.statusEn ? (
                      <LocalizedText
                        vi={thread.statusVi}
                        en={thread.statusEn}
                      />
                    ) : (
                      <LocalizedText vi="Đang viết" en="In progress" />
                    )}
                  </span>
                  <span className="text-[var(--color-accent-text)] opacity-0 transition-opacity group-hover:opacity-100">
                    <LocalizedText vi="Lọc thread" en="Filter thread" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

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
              {selectedThreadTitle ? (
                <>
                  {" "}
                  <LocalizedText vi="thuộc" en="from" />{" "}
                  <span className="text-[var(--color-accent-text)]">
                    {selectedThreadTitle}
                  </span>
                </>
              ) : null}
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
              setSelectedThread(null);
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
