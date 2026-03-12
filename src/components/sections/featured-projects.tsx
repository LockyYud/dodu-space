import Link from "next/link";

import { AnimatedSection } from "@/components/custom/animated-section";
import { ProjectCard } from "@/components/project/project-card";
import { buttonVariants } from "@/lib/button-variants";
import { getProjects } from "@/lib/content/project";

export async function FeaturedProjectsSection() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <AnimatedSection>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Featured projects
        </h2>
        <Link href="/projects" className={buttonVariants({ variant: "ghost" })}>
          View all
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </AnimatedSection>
  );
}
