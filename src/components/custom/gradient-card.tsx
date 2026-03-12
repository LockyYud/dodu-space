import { cn } from "@/lib/utils";

type GradientCardProps = Readonly<{
  className?: string;
  children: React.ReactNode;
}>;

export function GradientCard({ className, children }: GradientCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-md)] p-px",
        "bg-border/70",
        "transition-[background,box-shadow,transform] duration-200",
        "group-hover:bg-[linear-gradient(120deg,var(--color-accent-text),transparent_60%)]",
        className,
      )}
    >
      <div className="rounded-[calc(var(--radius-md)-1px)] bg-card">
        {children}
      </div>
    </div>
  );
}
