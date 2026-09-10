import type { SourceNoteItem } from "@/lib/content/blog-format";

/**
 * Renders the small subset of Markdown these citation values actually use:
 * `code` spans and **bold**. Reaching for an MDX compile here would be far more
 * machinery than three lines of metadata deserve.
 */
function renderValue(value: string) {
  return value.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
    const key = `${index}-${part}`;

    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <span key={key} className="text-[var(--color-accent-text)]">
          {part.slice(1, -1)}
        </span>
      );
    }

    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      return (
        <span key={key} className="text-foreground">
          {part.slice(2, -2)}
        </span>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

export function SourceNote({ items }: Readonly<{ items: SourceNoteItem[] }>) {
  if (items.length === 0) return null;

  return (
    <dl className="meta flex flex-col gap-1.5 border-y border-border-soft py-4 leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <div key={item.label} className="flex flex-wrap gap-x-1.5">
          <dt className="font-medium text-foreground">{item.label}:</dt>
          <dd className="m-0 min-w-0 flex-1">{renderValue(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
