import { BlogCard } from "@/components/blog/blog-card";
import { AnimatedSection } from "@/components/custom/animated-section";
import { LocalizedText } from "@/components/custom/localized-text";
import { SectionHeader } from "@/components/custom/section-header";
import { getBlogPosts } from "@/lib/content/blog";

export async function BlogPreviewSection() {
  const posts = await getBlogPosts();
  const latest = posts.slice(0, 3);

  return (
    <AnimatedSection>
      <SectionHeader
        eyebrow="blog"
        title={<LocalizedText vi="Bài viết mới" en="Latest blogs" />}
        description={
          <LocalizedText
            vi="Bài viết nghiên cứu, chi tiết triển khai và các bài học khi xây hệ thống RAG/LLM."
            en="Research posts, implementation details, and lessons from building RAG/LLM systems."
          />
        }
        action={{
          label: <LocalizedText vi="Xem tất cả" en="View all" />,
          href: "/blogs",
        }}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {latest.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        {["RAG", "Retrieval", "Evaluation", "Agents", "Backend"].map((tag) => (
          <span
            key={tag}
            className="rounded-md border bg-background/60 px-2 py-1"
          >
            #{tag}
          </span>
        ))}
      </div>
    </AnimatedSection>
  );
}
