import { notFound } from "next/navigation";

import { LocalizedText } from "@/components/custom/localized-text";
import { getProjectBySlug, getProjects } from "@/lib/content/project";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = await getProjectBySlug(slug);

    return (
      <article className="mx-auto max-w-2xl space-y-8">
        <header className="not-prose mb-8 space-y-4 border-b pb-8">
          <p className="tech-mono text-xs font-medium uppercase text-[var(--color-accent-text)]">
            <LocalizedText vi="Case study" en="Case study" />
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {frontmatter.title}
          </h1>
          {frontmatter.description ? (
            <p className="text-base leading-7 text-muted-foreground">
              {frontmatter.description}
            </p>
          ) : null}
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
        <div className="prose max-w-none dark:prose-invert prose-headings:font-sans prose-headings:tracking-tight prose-headings:text-foreground prose-p:leading-7 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-[var(--color-accent-text)]">
          {content}
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
