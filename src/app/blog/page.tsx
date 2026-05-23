import { BlogCard } from "@/components/blog/blog-card";
import { LocalizedText } from "@/components/custom/localized-text";
import { SectionHeader } from "@/components/custom/section-header";
import { getBlogPosts } from "@/lib/content/blog";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featured = posts.slice(0, 3);
  const rest = posts.slice(3);
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).slice(
    0,
    10,
  );

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader
        eyebrow="engineer lab"
        title={<LocalizedText vi="Bài viết" en="Notes" />}
        titleAs="h1"
        description={
          <LocalizedText
            vi="Research notes, system write-ups và các ghi chú triển khai về RAG, retrieval, agents và backend cho LLM."
            en="Research notes, system write-ups, and implementation notes on RAG, retrieval, agents, and LLM backends."
          />
        }
      />

      <div className="rounded-lg border bg-card/70 p-4">
        <p className="tech-mono text-xs font-medium uppercase text-[var(--color-accent-text)]">
          <LocalizedText vi="Chủ đề nổi bật" en="Featured topics" />
        </p>
        <div className="mt-3 flex flex-wrap gap-2 tech-mono text-[11px] text-muted-foreground">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border bg-background/60 px-2 py-1"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          <LocalizedText vi="Bài mới" en="Latest" />
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          <LocalizedText vi="Thư viện ghi chú" en="Notes library" />
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
