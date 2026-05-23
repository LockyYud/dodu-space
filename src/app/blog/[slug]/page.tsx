import { notFound } from "next/navigation";

import { LocalizedText } from "@/components/custom/localized-text";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content/blog";

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
    const formattedDate = new Date(frontmatter.date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );

    return (
      <article className="mx-auto max-w-2xl space-y-8">
        <header className="not-prose mb-8 space-y-4 border-b pb-8">
          <p className="tech-mono text-xs font-medium uppercase text-[var(--color-accent-text)]">
            <LocalizedText vi="Bài viết" en="Note" />
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {frontmatter.title}
          </h1>
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
              {(frontmatter.tags ?? []).map((tag) => (
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
        <div className="prose max-w-none dark:prose-invert prose-headings:font-sans prose-headings:tracking-tight prose-headings:text-foreground prose-p:leading-7 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-[var(--color-accent-text)] prose-code:font-mono prose-pre:border prose-pre:border-foreground/10 prose-pre:bg-muted/40">
          {content}
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
