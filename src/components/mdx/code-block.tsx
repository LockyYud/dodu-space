"use client";

import { isValidElement, useMemo, useState } from "react";

import { LocalizedText } from "@/components/custom/localized-text";
import { cn } from "@/lib/utils";

type CodeBlockProps = React.ComponentProps<"pre">;

/**
 * Code keeps a dark ground in both themes. On the cream page it reads as
 * evidence set into the prose rather than another panel, and one shiki theme
 * means the highlighting never has to be tuned twice.
 */
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
    <div className="group relative my-7">
      <button
        type="button"
        className="meta absolute right-3 top-2.5 z-10 text-[oklch(0.68_0.01_80)] opacity-100 transition-opacity hover:text-[oklch(0.9_0.015_80)] md:opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        onClick={copy}
      >
        {copied ? (
          <LocalizedText vi="đã copy" en="copied" />
        ) : (
          <LocalizedText vi="copy" en="copy" />
        )}
      </button>

      <pre
        className={cn(
          "overflow-x-auto bg-[oklch(0.14_0.008_60)] px-5 py-4 text-[0.8125rem] leading-relaxed",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
