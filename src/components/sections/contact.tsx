import { AnimatedSection } from "@/components/custom/animated-section";
import { socialConfig } from "@/config/social";

export function ContactSection() {
  return (
    <AnimatedSection>
      <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
        Want to collaborate, chat about engineering, or just say hi? Email is
        the fastest.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <a
          className="underline underline-offset-4 hover:text-[var(--color-accent-text)]"
          href={`mailto:${socialConfig.email}`}
        >
          {socialConfig.email}
        </a>
        <a
          className="underline underline-offset-4 hover:text-[var(--color-accent-text)]"
          href={socialConfig.github}
        >
          GitHub
        </a>
        <a
          className="underline underline-offset-4 hover:text-[var(--color-accent-text)]"
          href={socialConfig.linkedin}
        >
          LinkedIn
        </a>
      </div>
    </AnimatedSection>
  );
}
