import { AnimatedSection } from "@/components/custom/animated-section";
import { LocalizedText } from "@/components/custom/localized-text";
import { socialConfig } from "@/config/social";
import { isPlaceholderEmail, isPlaceholderUrl } from "@/lib/links";

export function ContactSection() {
  const hasEmail = !isPlaceholderEmail(socialConfig.email);
  const links = [
    { label: "GitHub", href: socialConfig.github },
    { label: "LinkedIn", href: socialConfig.linkedin },
  ].filter((link) => !isPlaceholderUrl(link.href));

  return (
    <AnimatedSection>
      <div className="rounded-lg border bg-card/75 p-5 shadow-sm">
        <p className="tech-mono text-xs font-medium uppercase text-[var(--color-accent-text)]">
          contact
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          <LocalizedText
            vi="Trao đổi về AI systems hoặc RAG?"
            en="Want to discuss AI systems or RAG?"
          />
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          <LocalizedText
            vi="Tôi ưu tiên các cuộc trò chuyện cụ thể về retrieval, backend cho LLM, đánh giá hệ thống và sản phẩm AI cần đi vào production."
            en="I prefer concrete conversations about retrieval, LLM backends, system evaluation, and AI products moving toward production."
          />
        </p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {hasEmail ? (
            <a
              className="rounded-md border bg-background/60 px-3 py-2 hover:text-[var(--color-accent-text)]"
              href={`mailto:${socialConfig.email}`}
            >
              {socialConfig.email}
            </a>
          ) : (
            <span className="rounded-md border bg-background/60 px-3 py-2 text-muted-foreground">
              <LocalizedText vi="Email đang cập nhật" en="Email updating" />
            </span>
          )}
          {links.map((link) => (
            <a
              key={link.label}
              className="rounded-md border bg-background/60 px-3 py-2 hover:text-[var(--color-accent-text)]"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
