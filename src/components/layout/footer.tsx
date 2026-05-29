"use client";

import Link from "next/link";

import { useLanguage } from "@/components/custom/language-provider";
import { LocalizedText } from "@/components/custom/localized-text";
import { navigationConfig } from "@/config/navigation";
import { socialConfig } from "@/config/social";
import { isPlaceholderEmail, isPlaceholderUrl } from "@/lib/links";

export function Footer() {
  const { language } = useLanguage();
  const socialLinks = [
    { label: "GitHub", href: socialConfig.github },
    { label: "LinkedIn", href: socialConfig.linkedin },
  ].filter((link) => !isPlaceholderUrl(link.href));
  const hasEmail = !isPlaceholderEmail(socialConfig.email);

  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1fr_auto_auto]">
        <div>
          <p className="font-semibold">Đỗ Minh Duy</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            <LocalizedText
              vi="Personal portfolio về AI systems, RAG, backend và bài viết kỹ thuật."
              en="Personal portfolio for AI systems, RAG, backend engineering, and technical posts."
            />
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <LocalizedText vi="Site" en="Site" />
          </p>
          {navigationConfig.map((item) => (
            <Link
              key={item.href}
              className="text-muted-foreground hover:text-[var(--color-accent-text)]"
              href={item.href}
            >
              {language === "vi" ? item.title : item.titleEn}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <LocalizedText vi="Liên hệ" en="Contact" />
          </p>
          {hasEmail ? (
            <Link
              className="text-muted-foreground hover:text-[var(--color-accent-text)]"
              href={`mailto:${socialConfig.email}`}
            >
              Email
            </Link>
          ) : (
            <span className="text-muted-foreground">
              <LocalizedText vi="Email đang cập nhật" en="Email updating" />
            </span>
          )}
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              className="text-muted-foreground hover:text-[var(--color-accent-text)]"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
