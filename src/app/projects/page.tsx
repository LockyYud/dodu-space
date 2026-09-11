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
          title={<LocalizedText vi="Dự án" en="Projects" />}
          titleAs="h1"
          description={
            <LocalizedText
              vi="Các sản phẩm cá nhân và thử nghiệm xoay quanh RAG, backend, automation và AI systems."
              en="Personal projects and experiments around RAG, backend, automation, and AI systems."
            />
          }
        />
      </div>

      <div className="border-t border-border">
        {projects.length === 0 ? (
          <p className="py-10 text-muted-foreground">
            <LocalizedText
              vi="Chưa có dự án nào được công bố ở đây."
              en="No projects published here yet."
            />
          </p>
        ) : (
          projects.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
