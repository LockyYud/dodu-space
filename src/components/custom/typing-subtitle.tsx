"use client";

import { useEffect, useMemo, useState } from "react";

type TypingSubtitleProps = Readonly<{
  text: string;
  speedMs?: number;
}>;

export function TypingSubtitle({ text, speedMs = 22 }: TypingSubtitleProps) {
  const characters = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(characters.length);

  useEffect(() => {
    setCount(0);
    const id = globalThis.setInterval(() => {
      setCount((c) => {
        if (c >= characters.length) {
          globalThis.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speedMs);
    return () => globalThis.clearInterval(id);
  }, [characters.length, speedMs]);

  return (
    <span className="flex max-w-full min-w-0 flex-wrap items-center gap-1.5 tech-mono text-xs text-muted-foreground">
      <span className="select-none text-[var(--color-accent-text)]">$</span>
      <span className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
        {characters.slice(0, count).join("")}
      </span>
      <span
        className="inline-block h-4 w-px animate-pulse bg-muted-foreground/70"
        aria-hidden
      />
    </span>
  );
}
