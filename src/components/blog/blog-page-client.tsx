"use client";

import { useMemo, useState } from "react";

import { PostRow } from "@/components/blog/post-row";
import { useLanguage } from "@/components/custom/language-provider";
import { LocalizedText } from "@/components/custom/localized-text";
import type { BlogPost } from "@/lib/content/blog";
import { RESEARCH_THREADS } from "@/lib/content/threads";
import { cn } from "@/lib/utils";

const TOP_TOPIC_COUNT = 8;

type BlogPageClientProps = Readonly<{
  posts: BlogPost[];
}>;

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const { language } = useLanguage();
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

  /**
   * Unfiltered, the archive reads as a dated run; filtered, month headings
   * would just fragment a short list, so they are dropped.
   */
  const hasFilter = Boolean(search.trim() || selectedTag || selectedThread);
  const groupedPosts = useMemo(() => {
    if (hasFilter) return null;
    const groups: { key: string; label: string; posts: BlogPost[] }[] = [];
    for (const post of filteredPosts) {
      const date = new Date(post.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const label = date
        .toLocaleDateString("en-US", { month: "long", year: "numeric" })
        .toUpperCase();
      const last = groups.at(-1);
      if (last?.key === key) {
        last.posts.push(post);
      } else {
        groups.push({ key, label, posts: [post] });
      }
    }
    return groups;
  }, [filteredPosts, hasFilter]);

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
          "meta transition-colors",
          isSelected
            ? "text-[var(--color-accent-text)]"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        #{tag}{" "}
        <span className="text-muted-foreground/60 tabular-nums">{count}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col">
      <header className="grid gap-6 pb-16 pt-10 md:grid-cols-12">
        <div className="flex flex-col gap-5 md:col-span-8">
          <p className="eyebrow eyebrow-accent">
            <LocalizedText vi="LƯU TRỮ" en="ARCHIVE" />
          </p>
          <h1 className="text-5xl leading-[1.05] md:text-6xl">
            <LocalizedText vi="Bài viết" en="Writing" />
          </h1>
          <p className="max-w-[36rem] text-xl leading-relaxed text-muted-foreground">
            <LocalizedText
              vi="Bài viết từ thực tế xây dựng hệ thống AI hướng production: RAG, retrieval, agents, streaming và hạ tầng LLM."
              en="Technical posts from building production-oriented AI systems: RAG, retrieval, agents, streaming, and LLM infrastructure."
            />
          </p>
        </div>
      </header>

      {/* Research threads as a list, not a card grid */}
      <section className="grid gap-8 pb-14 md:grid-cols-12">
        <div className="flex flex-col gap-3 md:col-span-3">
          <p className="eyebrow">
            <LocalizedText vi="MẠCH NGHIÊN CỨU" en="RESEARCH THREADS" />
          </p>
          <p className="text-[17px] italic leading-relaxed text-muted-foreground">
            <LocalizedText
              vi="Các chuỗi bài dài vẫn nằm trong archive, chỉ nhóm lại để dễ theo mạch."
              en="Long-running threads stay in the archive, grouped so the path is easier to follow."
            />
          </p>
          {selectedThread ? (
            <button
              type="button"
              onClick={() => setSelectedThread(null)}
              className="meta w-fit text-left text-[var(--color-accent-text)] hover:underline"
            >
              <LocalizedText vi="bỏ lọc mạch" en="clear thread" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-col border-t border-border md:col-span-9">
          {RESEARCH_THREADS.map((thread) => {
            const count = threadCounts.get(thread.id) ?? 0;
            const isSelected = selectedThread === thread.id;

            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => setSelectedThread(isSelected ? null : thread.id)}
                className={cn(
                  "group grid gap-x-6 gap-y-1.5 border-b border-border-soft py-5 text-left last:border-b-0 md:grid-cols-[minmax(0,1fr)_9rem]",
                  isSelected && "text-[var(--color-accent-text)]",
                )}
              >
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span
                    className={cn(
                      "text-[22px] leading-snug transition-colors",
                      !isSelected &&
                        "group-hover:text-[var(--color-accent-text)]",
                    )}
                  >
                    {thread.title}
                  </span>
                  <span className="text-base leading-relaxed text-muted-foreground">
                    <LocalizedText
                      vi={thread.descriptionVi}
                      en={thread.descriptionEn}
                    />
                  </span>
                </span>
                <span className="meta flex flex-wrap items-baseline gap-x-2 text-muted-foreground md:flex-col md:items-end md:gap-y-0.5 md:pt-1.5">
                  <span className="tabular-nums">
                    {count} <LocalizedText vi="bài" en="posts" />
                  </span>
                  <span>
                    {thread.statusVi && thread.statusEn ? (
                      <LocalizedText
                        vi={thread.statusVi}
                        en={thread.statusEn}
                      />
                    ) : (
                      <LocalizedText vi="đang viết" en="in progress" />
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Search + topics, both unboxed */}
      <section className="grid gap-8 pb-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="eyebrow">
            <LocalizedText vi="TÌM & LỌC" en="FIND" />
          </p>
        </div>
        <div className="flex flex-col gap-6 border-t border-border pt-6 md:col-span-9">
          <div className="flex items-baseline gap-3 border-b border-border-soft pb-2">
            <span className="meta text-muted-foreground">/</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                language === "vi" ? "tìm trong bài viết…" : "search posts…"
              }
              className="meta w-full bg-transparent py-1 text-[13px] outline-none placeholder:text-muted-foreground/70"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="meta text-muted-foreground hover:text-foreground"
              >
                clear
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {topTopics.map(([tag, count]) => renderTopicButton(tag, count))}
            {moreTopics.length > 0 ? (
              <details className="group">
                <summary className="meta cursor-pointer list-none text-muted-foreground hover:text-foreground">
                  <LocalizedText vi="thêm" en="more" /> {moreTopics.length}
                </summary>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  {moreTopics.map(([tag, count]) =>
                    renderTopicButton(tag, count),
                  )}
                </div>
              </details>
            ) : null}
            {selectedTag ? (
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="meta text-[var(--color-accent-text)] hover:underline"
              >
                <LocalizedText vi="bỏ lọc" en="clear" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-8">
        {hasFilter ? (
          <p className="meta pb-4 text-muted-foreground">
            <span className="tabular-nums">{filteredPosts.length}</span>{" "}
            <LocalizedText vi="bài viết" en="posts" />
            {selectedTag ? (
              <>
                {" "}
                <LocalizedText vi="trong" en="in" />{" "}
                <span className="text-[var(--color-accent-text)]">
                  #{selectedTag}
                </span>
              </>
            ) : null}
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
        ) : null}

        {filteredPosts.length === 0 ? (
          <div className="flex flex-col gap-3 border-t border-border py-14">
            <p className="text-2xl">
              <LocalizedText
                vi="Không tìm thấy bài viết phù hợp."
                en="No posts match that."
              />
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedTag(null);
                setSelectedThread(null);
              }}
              className="link-action w-fit text-[17px]"
            >
              <LocalizedText vi="Xóa bộ lọc →" en="Reset filters →" />
            </button>
          </div>
        ) : groupedPosts ? (
          <div className="flex flex-col gap-10">
            {groupedPosts.map((group) => (
              <div key={group.key} className="grid gap-4 md:grid-cols-12">
                <p className="eyebrow md:col-span-3 md:pt-6">{group.label}</p>
                <div className="border-t border-border md:col-span-9">
                  {group.posts.map((post) => (
                    <PostRow key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-t border-border">
            {filteredPosts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
