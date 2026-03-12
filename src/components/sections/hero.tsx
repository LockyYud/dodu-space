import Link from "next/link";

import { AnimatedSection } from "@/components/custom/animated-section";
import { TypingSubtitle } from "@/components/custom/typing-subtitle";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { buttonVariants } from "@/lib/button-variants";

export function HeroSection() {
  return (
    <AnimatedSection>
      <div className="flex flex-col gap-8 py-20 mb-12 md:mb-16">
        <div className="flex flex-col gap-3">
          <TypingSubtitle text="$ Applied AI Engineer • RAG Systems • Power-user" />
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            {siteConfig.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            I engineer LLM ecosystems, bridge the gap between complex
            vector/graph databases, and ship scalable backends. Currently
            architecting context memory systems and exploring AI in Web3.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/projects"
            className={buttonVariants({
              variant: "outline",
              className:
                "border-foreground/15 bg-background/60 shadow-sm hover:border-[var(--color-accent-text)] hover:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-accent-text),transparent_80%)]",
            })}
          >
            View projects
          </Link>
          <Link
            href="/blog"
            className={buttonVariants({
              variant: "outline",
              className:
                "border-foreground/15 bg-background/60 hover:border-[var(--color-accent-text)]",
            })}
          >
            Read blog
          </Link>
          <a
            href={`mailto:${socialConfig.email}`}
            className={buttonVariants({
              variant: "ghost",
              className:
                "tech-mono text-xs text-muted-foreground hover:text-foreground",
            })}
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-background/60 px-3 py-2 tech-mono text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-2 animate-ping rounded-full bg-emerald-500/70" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-foreground/80">[status]</span>
          <span>optimizing RAG retrieval pipeline...</span>
        </div>

        <Separator className="mt-4" />
      </div>
    </AnimatedSection>
  );
}
