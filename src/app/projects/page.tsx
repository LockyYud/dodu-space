import { LocalizedText } from "@/components/custom/localized-text";
import { SectionHeader } from "@/components/custom/section-header";
import { ProjectRow } from "@/components/project/project-row";
import { getProjects } from "@/lib/content/project";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col">
      <div className="pb-14 pt-10">
        <SectionHeader
          eyebrow="PORTFOLIO"
          title={<LocalizedText vi="Dự án" en="Work" />}
          titleAs="h1"
          description={
            <LocalizedText
              vi="Các hệ thống, thử nghiệm và side project xoay quanh RAG, backend, automation và AI systems."
              en="Selected work, experiments, and side projects around RAG, backend, automation, and AI systems."
            />
          }
        />
      </div>

      <div className="border-t border-border">
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
