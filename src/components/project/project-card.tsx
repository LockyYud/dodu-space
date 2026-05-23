import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

import { GradientCard } from "@/components/custom/gradient-card";
import { LocalizedText } from "@/components/custom/localized-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/content/project";
import { isPlaceholderUrl } from "@/lib/links";

export function ProjectCard({ project }: Readonly<{ project: Project }>) {
  const hasDemo = !isPlaceholderUrl(project.demo);
  const hasSource = !isPlaceholderUrl(project.github);

  return (
    <Link href={`/projects/${project.slug}`} className="group block min-w-0">
      <div className="transition-all duration-200 hover:-translate-y-0.5">
        <GradientCard className="hover:shadow-[0_12px_30px_-18px_color-mix(in_oklab,var(--color-accent-text),transparent_70%)]">
          <Card className="h-full border-0 bg-transparent">
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base [overflow-wrap:anywhere] group-hover:text-[var(--color-accent-text)]">
                  {project.title}
                </CardTitle>
                <span className="flex shrink-0 items-center gap-2">
                  {hasSource ? (
                    <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">
                      <Github className="size-4" aria-hidden />
                    </span>
                  ) : null}
                </span>
              </div>
              {project.description ? (
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {project.description}
                </p>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {(project.tags ?? []).slice(0, 5).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="tech-mono bg-muted/50 text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 tech-mono text-[10px] text-muted-foreground">
                <span className="rounded-md border bg-background/60 px-2 py-1">
                  <LocalizedText vi="Case study" en="Case study" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border bg-background/60 px-2 py-1">
                  {hasDemo ? (
                    <>
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Demo
                      <ExternalLink className="size-3" />
                    </>
                  ) : (
                    <LocalizedText vi="Demo đang cập nhật" en="Demo updating" />
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </GradientCard>
      </div>
    </Link>
  );
}
