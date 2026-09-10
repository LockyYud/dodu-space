import Link from "next/link";

import { LocalizedText } from "@/components/custom/localized-text";
import { ProjectRow } from "@/components/project/project-row";
import { getProjects } from "@/lib/content/project";

export async function FeaturedProjectsSection() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="grid gap-8 pb-20 md:grid-cols-12 md:pb-24">
      <div className="flex flex-col gap-3 md:col-span-3">
        <p className="eyebrow">
          <LocalizedText vi="DỰ ÁN CHỌN LỌC" en="SELECTED WORK" />
        </p>
        <Link href="/projects" className="link-action text-[17px]">
          <LocalizedText vi="Tất cả dự án →" en="All work →" />
        </Link>
      </div>

      <div className="grid gap-10 border-t border-border pt-7 md:col-span-9 md:grid-cols-3 md:gap-12">
        {featured.map((project, index) => (
          <ProjectRow
            key={project.slug}
            project={project}
            index={index}
            layout="column"
          />
        ))}
      </div>
    </section>
  );
}
