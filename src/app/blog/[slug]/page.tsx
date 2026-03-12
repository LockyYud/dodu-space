import { notFound } from "next/navigation";

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
        <header className="not-prose mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {frontmatter.title}
          </h1>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </header>
        <div className="prose prose-invert max-w-none prose-headings:font-sans prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-[var(--color-accent-text)] prose-code:font-mono prose-pre:border prose-pre:border-foreground/10 prose-pre:bg-black/60">
          {content}
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
