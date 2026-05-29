import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog/blog-card";
import { BlogToc } from "@/components/blog/blog-toc";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { LocalizedText } from "@/components/custom/localized-text";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content/blog";
import { formatBlogTitle } from "@/lib/content/blog-format";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

type BlogPostPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = await getBlogPostBySlug(slug);
    const posts = await getBlogPosts();
    const currentIndex = posts.findIndex((post) => post.slug === slug);
    const newerPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const olderPost =
      currentIndex >= 0 && currentIndex < posts.length - 1
        ? posts[currentIndex + 1]
        : null;
    const relatedPosts = posts
      .filter((post) => post.slug !== slug)
      .map((post) => ({
        post,
        score: (post.tags ?? []).filter((tag) =>
          (frontmatter.tags ?? []).includes(tag),
        ).length,
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ post }) => post);
    const title = formatBlogTitle(frontmatter.title);
    const formattedDate = new Date(frontmatter.date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );

    return (
      <>
        <ReadingProgress />
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,46rem)_14rem]">
          <article className="min-w-0 space-y-10 rounded-lg bg-background/90 px-1 py-1 backdrop-blur-sm md:px-3">
            <header className="not-prose space-y-4 border-b pb-8">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-[var(--color-accent-text)]"
              >
                <ArrowLeft className="size-3" />
                <LocalizedText vi="Tất cả bài viết" en="All posts" />
              </Link>
              <p className="tech-mono text-xs font-medium uppercase text-[var(--color-accent-text)]">
                <LocalizedText vi="Bài viết" en="Blog" />
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {title.title}
                </h1>
                {title.subtitle ? (
                  <p className="tech-mono text-sm text-muted-foreground">
                    {title.subtitle}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 tech-mono text-xs text-muted-foreground">
                <span>{formattedDate}</span>
                <span>•</span>
                <span>
                  {frontmatter.readingMinutes ?? 1}{" "}
                  <LocalizedText vi="phút đọc" en="min read" />
                </span>
              </div>
              {(frontmatter.tags ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(frontmatter.tags ?? []).slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border bg-background/60 px-2 py-1 tech-mono text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <div className="prose max-w-none dark:prose-invert prose-headings:font-sans prose-headings:tracking-tight prose-headings:text-foreground prose-h2:mt-14 prose-h2:mb-5 prose-h2:border-t prose-h2:border-border/70 prose-h2:pt-8 prose-h3:mt-10 prose-h3:mb-4 prose-p:my-5 prose-p:leading-7 prose-p:text-muted-foreground prose-li:my-1.5 prose-li:text-muted-foreground prose-ul:my-5 prose-ol:my-5 prose-blockquote:my-7 prose-blockquote:border-[var(--color-accent-text)]/40 prose-strong:text-foreground prose-a:text-[var(--color-accent-text)] prose-code:font-mono prose-pre:border prose-pre:border-foreground/10 prose-pre:bg-muted/40">
              {content}
            </div>

            <nav className="grid gap-3 border-t pt-8 sm:grid-cols-2">
              {newerPost ? (
                <Link
                  href={`/blogs/${newerPost.slug}`}
                  className="group rounded-lg border bg-card/60 p-4 text-sm transition-colors hover:border-[var(--color-accent-text)]/40"
                >
                  <span className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft className="size-3" />
                    <LocalizedText vi="Bài mới hơn" en="Newer post" />
                  </span>
                  <span className="font-medium group-hover:text-[var(--color-accent-text)]">
                    {formatBlogTitle(newerPost.title).title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {olderPost ? (
                <Link
                  href={`/blogs/${olderPost.slug}`}
                  className="group rounded-lg border bg-card/60 p-4 text-right text-sm transition-colors hover:border-[var(--color-accent-text)]/40"
                >
                  <span className="mb-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <LocalizedText vi="Bài cũ hơn" en="Older post" />
                    <ArrowRight className="size-3" />
                  </span>
                  <span className="font-medium group-hover:text-[var(--color-accent-text)]">
                    {formatBlogTitle(olderPost.title).title}
                  </span>
                </Link>
              ) : null}
            </nav>

            {relatedPosts.length > 0 ? (
              <section className="space-y-4 border-t pt-8">
                <h2 className="text-lg font-semibold">
                  <LocalizedText vi="Bài liên quan" en="Related posts" />
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="hidden lg:block">
            {(frontmatter.toc ?? []).length > 0 ? (
              <BlogToc items={frontmatter.toc} />
            ) : null}
          </aside>
        </div>
      </>
    );
  } catch {
    notFound();
  }
}
