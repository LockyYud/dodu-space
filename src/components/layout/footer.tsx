"use client";

import Link from "next/link";

import { LocalizedText } from "@/components/custom/localized-text";
import { socialConfig } from "@/config/social";
import { isPlaceholderEmail, isPlaceholderUrl } from "@/lib/links";

export function Footer() {
  const socialLinks = [
    { label: "github", href: socialConfig.github },
    { label: "linkedin", href: socialConfig.linkedin },
  ].filter((link) => !isPlaceholderUrl(link.href));
  const hasEmail = !isPlaceholderEmail(socialConfig.email);

  return (
    <footer className="mt-8">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-border py-6">
          <p className="meta text-muted-foreground">
            © {new Date().getFullYear()} Đỗ Minh Duy
          </p>
          <div className="flex flex-wrap items-baseline gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                className="meta text-muted-foreground transition-colors hover:text-[var(--color-accent-text)]"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className="meta text-muted-foreground transition-colors hover:text-[var(--color-accent-text)]"
              href="/rss.xml"
            >
              rss
            </Link>
            {hasEmail ? (
              <Link
                className="meta text-muted-foreground transition-colors hover:text-[var(--color-accent-text)]"
                href={`mailto:${socialConfig.email}`}
              >
                email
              </Link>
            ) : (
              <span className="meta text-muted-foreground">
                <LocalizedText
                  vi="email — đang cập nhật"
                  en="email — updating"
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
