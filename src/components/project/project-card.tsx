import { Github } from "lucide-react";
import Link from "next/link";

import { GradientCard } from "@/components/custom/gradient-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/content/project";

export function ProjectCard({ project }: Readonly<{ project: Project }>) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="transition-all duration-200 hover:-translate-y-0.5">
        <GradientCard className="hover:shadow-[0_12px_30px_-18px_color-mix(in_oklab,var(--color-accent-text),transparent_70%)]">
          <Card className="h-full border-0 bg-transparent">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base group-hover:text-[var(--color-accent-text)]">
                  {project.title}
                </CardTitle>
                <span className="flex items-center gap-2">
                  {project.github ? (
                    <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                      <Github className="size-4" aria-hidden />
                    </span>
                  ) : null}
                  {project.demo ? (
                    <span className="inline-flex items-center gap-1 rounded-md border bg-background/60 px-2 py-0.5 tech-mono text-[10px] text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-emerald-500" />{" "}
                      Live
                    </span>
                  ) : null}
                </span>
              </div>
              {project.description ? (
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {(project.tags ?? []).slice(0, 6).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="tech-mono bg-muted/50 text-[10px] text-muted-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </GradientCard>
      </div>
    </Link>
  );
}
