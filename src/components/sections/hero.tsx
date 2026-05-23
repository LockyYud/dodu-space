import {
  ArrowRight,
  Database,
  GitBranch,
  ServerCog,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { AnimatedSection } from "@/components/custom/animated-section";
import { LocalizedText } from "@/components/custom/localized-text";
import { TypingSubtitle } from "@/components/custom/typing-subtitle";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { buttonVariants } from "@/lib/button-variants";
import { isPlaceholderEmail } from "@/lib/links";

const focusAreas = [
  {
    label: "RAG",
    value: {
      vi: "retrieval + evaluation",
      en: "retrieval + evaluation",
    },
  },
  {
    label: "Backend",
    value: {
      vi: "FastAPI + data systems",
      en: "FastAPI + data systems",
    },
  },
  { label: "LLM Eval", value: { vi: "quality gates", en: "quality gates" } },
  {
    label: "Vector/Graph",
    value: { vi: "Qdrant + Neo4j", en: "Qdrant + Neo4j" },
  },
] as const;

const pipelineSteps = [
  { icon: Database, label: "Index", detail: "chunk + embed" },
  { icon: GitBranch, label: "Retrieve", detail: "hybrid + rerank" },
  { icon: ServerCog, label: "Serve", detail: "API + observability" },
] as const;

export function HeroSection() {
  const hasEmail = !isPlaceholderEmail(socialConfig.email);

  return (
    <AnimatedSection>
      <div className="mb-14 grid min-w-0 gap-8 py-14 md:mb-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
        <div className="flex min-w-0 flex-col gap-7">
          <div className="flex min-w-0 flex-col gap-4">
            <TypingSubtitle text="AI Engineer • RAG Systems • Backend" />
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {siteConfig.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              <LocalizedText
                vi="Tôi thiết kế hệ thống AI ứng dụng: pipeline RAG, backend phục vụ LLM, đánh giá chất lượng retrieval và hạ tầng dữ liệu vector/graph để sản phẩm chạy ổn định hơn."
                en="I design applied AI systems: RAG pipelines, LLM backend services, retrieval evaluation, and vector/graph data infrastructure for more reliable products."
              />
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/projects"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-foreground/15 bg-background/70 shadow-sm hover:border-[var(--color-accent-text)] hover:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-accent-text),transparent_80%)]",
              })}
            >
              <LocalizedText vi="Xem dự án" en="View projects" />
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/blog"
              className={buttonVariants({
                variant: "outline",
                className:
                  "border-foreground/15 bg-background/70 hover:border-[var(--color-accent-text)]",
              })}
            >
              <LocalizedText vi="Đọc bài viết" en="Read notes" />
            </Link>
            {hasEmail ? (
              <a
                href={`mailto:${socialConfig.email}`}
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "tech-mono text-xs text-muted-foreground hover:text-foreground",
                })}
              >
                <LocalizedText vi="Liên hệ" en="Contact" />
              </a>
            ) : (
              <span className="tech-mono text-xs text-muted-foreground">
                <LocalizedText
                  vi="Liên hệ: đang cập nhật"
                  en="Contact: updating"
                />
              </span>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {focusAreas.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border bg-background/65 px-3 py-2"
              >
                <p className="tech-mono text-[11px] text-[var(--color-accent-text)]">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <LocalizedText vi={item.value.vi} en={item.value.en} />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card/75 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-3 border-b pb-3">
            <div>
              <p className="tech-mono text-xs text-muted-foreground">
                <LocalizedText vi="current focus" en="current focus" />
              </p>
              <h2 className="mt-1 text-base font-semibold">
                RAG reliability loop
              </h2>
            </div>
            <Sparkles className="size-4 text-[var(--color-accent-text)]" />
          </div>

          <div className="mt-4 grid gap-3">
            {pipelineSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="flex items-center gap-3 rounded-md border bg-background/65 p-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent-text)]/10 text-[var(--color-accent-text)]">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="tech-mono text-xs text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-md bg-muted/50 px-3 py-2 tech-mono text-xs text-muted-foreground">
            <span className="text-foreground">status:</span>{" "}
            <LocalizedText
              vi="cải thiện retrieval, eval và observability cho hệ thống LLM."
              en="improving retrieval, evaluation, and observability for LLM systems."
            />
          </div>
        </div>

        <Separator className="md:col-span-2" />
      </div>
    </AnimatedSection>
  );
}
