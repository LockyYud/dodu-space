import Link from "next/link";

import { LocalizedText } from "@/components/custom/localized-text";
import type { Project } from "@/lib/content/project";
import { isPlaceholderUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

const NUMERALS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
] as const;

export function projectNumeral(index: number) {
  return NUMERALS[index] ?? String(index + 1);
}

/**
 * A project as a numbered entry rather than a card: numeral, name, prose,
 * stack as mono metadata. `layout="column"` is the three-up homepage variant,
 * `"row"` the full-width index on /projects.
 */
export function ProjectRow({
  project,
  index,
  layout = "row",
  className,
}: Readonly<{
  project: Project;
  index: number;
  layout?: "row" | "column";
  className?: string;
}>) {
  const hasSource = !isPlaceholderUrl(project.github);
  const hasDemo = !isPlaceholderUrl(project.demo);
  const stack = (project.tags ?? []).join(" · ");

  if (layout === "column") {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className={cn("group flex flex-col gap-2.5", className)}
      >
        <span className="eyebrow eyebrow-accent">{projectNumeral(index)}</span>
        <span className="text-[22px] leading-snug transition-colors group-hover:text-[var(--color-accent-text)]">
          {project.title}
        </span>
        {project.description ? (
          <span className="text-base leading-relaxed text-muted-foreground">
            {project.description}
          </span>
        ) : null}
        {stack ? (
          <span className="meta text-muted-foreground/80">{stack}</span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group grid gap-x-6 gap-y-2 border-t border-border-soft py-6 md:grid-cols-[4rem_minmax(0,1fr)_11rem]",
        className,
      )}
    >
      <span className="eyebrow eyebrow-accent md:pt-2">
        {projectNumeral(index)}
      </span>

      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="text-2xl leading-snug transition-colors group-hover:text-[var(--color-accent-text)]">
          {project.title}
        </span>
        {project.description ? (
          <span className="text-base leading-relaxed text-muted-foreground">
            {project.description}
          </span>
        ) : null}
        {stack ? (
          <span className="meta text-muted-foreground/80">{stack}</span>
        ) : null}
      </span>

      <span className="meta flex flex-wrap items-baseline gap-x-3 text-muted-foreground md:justify-end md:pt-2 md:text-right">
        <span className="text-[var(--color-accent-text)]">
          <LocalizedText vi="case study →" en="case study →" />
        </span>
        {hasSource ? <span>source</span> : null}
        {hasDemo ? <span>demo</span> : null}
      </span>
    </Link>
  );
}
