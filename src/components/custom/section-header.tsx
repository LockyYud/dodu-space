import Link from "next/link";

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
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-4">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Title
          className={cn(
            titleAs === "h1"
              ? "text-5xl leading-[1.05] md:text-6xl"
              : "text-3xl md:text-4xl",
          )}
        >
          {title}
        </Title>
        {description ? (
          <p className="max-w-[36rem] text-xl leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link href={action.href} className="link-action w-fit text-[17px]">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
