import { notFound } from "next/navigation";

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
      <article className="max-w-none space-y-8">
        <header className="not-prose mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {frontmatter.title}
          </h1>
          {frontmatter.description ? (
            <p className="text-sm text-muted-foreground">
              {frontmatter.description}
            </p>
          ) : null}
        </header>
        <div className="mdx">{content}</div>
      </article>
    );
  } catch {
    notFound();
  }
}
