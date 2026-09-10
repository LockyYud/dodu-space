import Link from "next/link";
import { notFound } from "next/navigation";

import { LocalizedText } from "@/components/custom/localized-text";
import { getProjectBySlug, getProjects } from "@/lib/content/project";
import { isPlaceholderUrl } from "@/lib/links";

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
    const tags = frontmatter.tags ?? [];
    const hasSource = !isPlaceholderUrl(frontmatter.github);
    const hasDemo = !isPlaceholderUrl(frontmatter.demo);
    const year = frontmatter.date
      ? new Date(frontmatter.date).getFullYear()
      : null;

    return (
      <>
        {/* Same masthead-and-rail shape as a blog post, so the two long-form
            page types read as one family. */}
        <header className="flex flex-col gap-5 border-b border-border pb-10">
          <Link
            href="/projects"
            className="meta w-fit text-muted-foreground transition-colors hover:text-[var(--color-accent-text)]"
          >
            ← <LocalizedText vi="Tất cả dự án" en="All work" />
          </Link>
          <p className="eyebrow eyebrow-accent">CASE STUDY</p>
          <h1 className="max-w-[26ch] text-[2.5rem] leading-[1.08] md:text-[3.5rem]">
            {frontmatter.title}
          </h1>
          {frontmatter.description ? (
            <p className="max-w-[38rem] text-xl leading-relaxed text-muted-foreground">
              {frontmatter.description}
            </p>
          ) : null}
        </header>

        <div className="grid gap-10 pt-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
          <aside className="flex flex-col gap-8 lg:sticky lg:top-10 lg:max-h-[calc(100svh-5rem)] lg:self-start">
            <div className="flex flex-col gap-2.5">
              <p className="eyebrow">
                <LocalizedText vi="THÔNG TIN" en="DETAILS" />
              </p>
              <dl className="meta flex flex-col gap-1.5 border-y border-border-soft py-4 leading-relaxed text-muted-foreground">
                {year ? (
                  <div className="flex flex-wrap gap-x-1.5">
                    <dt className="font-medium text-foreground">
                      <LocalizedText vi="Năm:" en="Year:" />
                    </dt>
                    <dd className="m-0">{year}</dd>
                  </div>
                ) : null}
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-x-1.5">
                    <dt className="font-medium text-foreground">Stack:</dt>
                    <dd className="m-0 min-w-0 flex-1">{tags.join(", ")}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            {hasSource || hasDemo ? (
              <div className="meta flex flex-col gap-2">
                {hasSource && frontmatter.github ? (
                  <a
                    href={frontmatter.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent-text)] hover:underline"
                  >
                    source →
                  </a>
                ) : null}
                {hasDemo && frontmatter.demo ? (
                  <a
                    href={frontmatter.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent-text)] hover:underline"
                  >
                    demo →
                  </a>
                ) : null}
              </div>
            ) : null}
          </aside>

          <article className="prose-post min-w-0 lg:max-w-[42rem]">
            {content}
          </article>
        </div>
      </>
    );
  } catch {
    notFound();
  }
}
