import { AnimatedSection } from "@/components/custom/animated-section";
import { LocalizedText } from "@/components/custom/localized-text";
import { SectionHeader } from "@/components/custom/section-header";
import { ProjectCard } from "@/components/project/project-card";
import { getProjects } from "@/lib/content/project";

export async function FeaturedProjectsSection() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <AnimatedSection>
      <SectionHeader
        eyebrow="case studies"
        title={<LocalizedText vi="Dự án nổi bật" en="Featured projects" />}
        description={
          <LocalizedText
            vi="Một số hệ thống và thử nghiệm thể hiện cách tôi tiếp cận dữ liệu, retrieval và vận hành sản phẩm AI."
            en="Selected systems and experiments showing how I approach data, retrieval, and AI product operations."
          />
        }
        action={{
          label: <LocalizedText vi="Xem tất cả" en="View all" />,
          href: "/projects",
        }}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </AnimatedSection>
  );
}
