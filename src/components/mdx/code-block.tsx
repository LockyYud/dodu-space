"use client";

import { isValidElement, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CodeBlockProps = React.ComponentProps<"pre">;

export function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    // Attempt to extract raw code text from <code> children.
    const codeEl = Array.isArray(children) ? children[0] : children;
    const raw = isValidElement<{ children?: React.ReactNode }>(codeEl)
      ? codeEl.props.children
      : undefined;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw)) return raw.join("");
    return "";
  }, [children]);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    globalThis.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="group relative my-6">
      <Button
        type="button"
        variant="outline"
        size="xs"
        className={cn(
          "absolute right-2 top-2 z-10 tech-mono text-[10px] opacity-100 transition-opacity md:opacity-0",
          "border-foreground/15 bg-background/80 hover:border-[var(--color-accent-text)] group-hover:opacity-100 focus-visible:opacity-100",
        )}
        onClick={copy}
      >
        {copied ? "Đã copy" : "Copy"}
      </Button>

      <pre
        className={cn(
          "overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm",
          "ring-1 ring-foreground/5",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
