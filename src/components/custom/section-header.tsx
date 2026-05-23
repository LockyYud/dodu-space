import Link from "next/link";

import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

type SectionHeaderProps = Readonly<{
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: {
    label: React.ReactNode;
    href: string;
  };
  titleAs?: "h1" | "h2";
  className?: string;
}>;

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  titleAs = "h2",
  className,
}: SectionHeaderProps) {
  const Title = titleAs;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        {eyebrow ? (
          <p className="tech-mono text-xs font-medium uppercase text-[var(--color-accent-text)]">
            {eyebrow}
          </p>
        ) : null}
        <Title className="text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </Title>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className={buttonVariants({ variant: "ghost", className: "w-fit" })}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
