import Link from "next/link";

import { socialConfig } from "@/config/social";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} • Built with Next.js.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link
            className="text-muted-foreground hover:text-[var(--color-accent-text)]"
            href={socialConfig.github}
          >
            GitHub
          </Link>
          <Link
            className="text-muted-foreground hover:text-[var(--color-accent-text)]"
            href={socialConfig.linkedin}
          >
            LinkedIn
          </Link>
          <Link
            className="text-muted-foreground hover:text-[var(--color-accent-text)]"
            href={`mailto:${socialConfig.email}`}
          >
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
}
