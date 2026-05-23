import { LocalizedText } from "@/components/custom/localized-text";
import { SectionHeader } from "@/components/custom/section-header";
import { ProjectCard } from "@/components/project/project-card";
import { getProjects } from "@/lib/content/project";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const tags = Array.from(new Set(projects.flatMap((p) => p.tags ?? []))).slice(
    0,
    8,
  );

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        eyebrow="portfolio"
        title={<LocalizedText vi="Dự án" en="Projects" />}
        titleAs="h1"
        description={
          <LocalizedText
            vi="Selected work, experiments và side projects xoay quanh RAG, backend, automation và AI systems."
            en="Selected work, experiments, and side projects around RAG, backend, automation, and AI systems."
          />
        }
      />

      <div className="flex flex-wrap gap-2 tech-mono text-[11px] text-muted-foreground">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border bg-background/60 px-2 py-1"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
