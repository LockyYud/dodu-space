import Link from "next/link";

import { AnimatedSection } from "@/components/custom/animated-section";
import { buttonVariants } from "@/lib/button-variants";

export function AboutPreviewSection() {
  return (
    <AnimatedSection>
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">About</h2>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          I’m an AI Engineer focused on making Large Language Models reliable in
          production—especially around information retrieval and the “context
          problem” for agents.
        </p>
        <div>
          <Link
            href="/about"
            className={buttonVariants({ variant: "outline" })}
          >
            More about me
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
