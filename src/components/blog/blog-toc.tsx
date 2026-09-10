"use client";

import { useEffect, useState } from "react";

import { LocalizedText } from "@/components/custom/localized-text";
import type { TocItem } from "@/lib/content/blog-format";
import { cn } from "@/lib/utils";

type BlogTocProps = Readonly<{
  items: TocItem[];
}>;

export function BlogToc({ items }: BlogTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const visibleHeadings = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleHeadings.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibleHeadings.delete(entry.target.id);
          }
        }

        const nearestHeading = Array.from(visibleHeadings.entries()).sort(
          (a, b) => a[1] - b[1],
        )[0];

        if (nearestHeading) {
          setActiveId(nearestHeading[0]);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0, 1],
      },
    );

    for (const item of items) {
      const heading = document.getElementById(item.id);
      if (heading) observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <div>
      <p className="eyebrow pb-3">
        <LocalizedText vi="MỤC LỤC" en="CONTENTS" />
      </p>
      <nav className="relative border-l border-border-soft">
        {items.map((item) => {
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "meta relative block py-1.5 pr-2 transition-colors",
                item.level === 3 ? "pl-6" : "pl-4",
                isActive
                  ? "text-[var(--color-accent-text)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute -left-px top-0 h-full w-px transition-colors",
                  isActive ? "bg-[var(--color-accent-text)]" : "bg-transparent",
                )}
              />
              {item.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
