import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogToc } from "@/components/blog/blog-toc";
import { PostRow } from "@/components/blog/post-row";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { LocalizedText } from "@/components/custom/localized-text";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content/blog";
import { formatBlogTitle } from "@/lib/content/blog-format";
import { findThreadForPost } from "@/lib/content/threads";

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
    const currentPost = currentIndex >= 0 ? posts[currentIndex] : null;
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
    const thread = currentPost ? findThreadForPost(currentPost) : null;
    const formattedDate = new Date(frontmatter.date).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    );
    const metaParts = [
      title.subtitle,
      formattedDate,
      `${frontmatter.readingMinutes ?? 1} min`,
      ...(frontmatter.tags ?? []).slice(0, 3),
    ].filter(Boolean);

    return (
      <>
        <ReadingProgress />
        <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,42rem)_13rem] lg:gap-16">
          <article className="min-w-0">
            <header className="not-prose flex flex-col gap-5 pb-10">
              <Link
                href="/blogs"
                className="meta w-fit text-muted-foreground transition-colors hover:text-[var(--color-accent-text)]"
              >
                ← <LocalizedText vi="Tất cả bài viết" en="All posts" />
              </Link>
              <p className="eyebrow eyebrow-accent">
                {thread ? (
                  thread.title
                ) : (
                  <LocalizedText vi="Bài viết" en="Writing" />
                )}
              </p>
              <h1 className="text-[2.25rem] leading-[1.1] md:text-5xl">
                {title.title}
              </h1>
              <p className="meta flex flex-wrap items-baseline gap-x-2 text-muted-foreground">
                {metaParts.map((part, index) => (
                  <span key={part} className="flex items-baseline gap-x-2">
                    {index > 0 ? <span aria-hidden="true">·</span> : null}
                    <span>{part}</span>
                  </span>
                ))}
              </p>
            </header>

            <div className="prose-post border-t border-border pt-10">
              {content}
            </div>

            <nav className="mt-16 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
              {newerPost ? (
                <Link href={`/blogs/${newerPost.slug}`} className="group">
                  <span className="eyebrow block">
                    <LocalizedText vi="← BÀI MỚI HƠN" en="← NEWER POST" />
                  </span>
                  <span className="mt-1.5 block text-lg leading-snug transition-colors group-hover:text-[var(--color-accent-text)]">
                    {formatBlogTitle(newerPost.title).title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {olderPost ? (
                <Link
                  href={`/blogs/${olderPost.slug}`}
                  className="group sm:text-right"
                >
                  <span className="eyebrow block">
                    <LocalizedText vi="BÀI CŨ HƠN →" en="OLDER POST →" />
                  </span>
                  <span className="mt-1.5 block text-lg leading-snug transition-colors group-hover:text-[var(--color-accent-text)]">
                    {formatBlogTitle(olderPost.title).title}
                  </span>
                </Link>
              ) : null}
            </nav>

            {relatedPosts.length > 0 ? (
              <section className="mt-16">
                <p className="eyebrow pb-4">
                  <LocalizedText vi="BÀI LIÊN QUAN" en="RELATED" />
                </p>
                <div className="border-t border-border">
                  {relatedPosts.map((post) => (
                    <PostRow key={post.slug} post={post} />
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
