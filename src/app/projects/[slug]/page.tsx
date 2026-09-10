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
    const stack = (frontmatter.tags ?? []).join(" · ");
    const hasSource = !isPlaceholderUrl(frontmatter.github);

    return (
      <article className="max-w-[42rem]">
        <header className="not-prose flex flex-col gap-5 pb-10">
          <Link
            href="/projects"
            className="meta w-fit text-muted-foreground transition-colors hover:text-[var(--color-accent-text)]"
          >
            ← <LocalizedText vi="Tất cả dự án" en="All work" />
          </Link>
          <p className="eyebrow eyebrow-accent">
            <LocalizedText vi="CASE STUDY" en="CASE STUDY" />
          </p>
          <h1 className="text-[2.25rem] leading-[1.1] md:text-5xl">
            {frontmatter.title}
          </h1>
          {frontmatter.description ? (
            <p className="text-xl leading-relaxed text-muted-foreground">
              {frontmatter.description}
            </p>
          ) : null}
          <p className="meta flex flex-wrap items-baseline gap-x-3 text-muted-foreground">
            {stack ? <span>{stack}</span> : null}
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
          </p>
        </header>

        <div className="prose-post border-t border-border pt-10">{content}</div>
      </article>
    );
  } catch {
    notFound();
  }
}
