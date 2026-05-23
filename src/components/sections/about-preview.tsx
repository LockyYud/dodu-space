import { BrainCircuit, Gauge, Workflow } from "lucide-react";

import { AnimatedSection } from "@/components/custom/animated-section";
import { LocalizedText } from "@/components/custom/localized-text";
import { SectionHeader } from "@/components/custom/section-header";

const capabilities = [
  {
    title: { vi: "Thiết kế RAG", en: "RAG design" },
    description: {
      vi: "Từ chunking, retrieval, rerank đến đánh giá chất lượng câu trả lời.",
      en: "From chunking, retrieval, and reranking to answer quality evaluation.",
    },
    icon: BrainCircuit,
  },
  {
    title: { vi: "Backend AI", en: "AI backend" },
    description: {
      vi: "API, streaming, queue và data model để đưa LLM vào workflow thật.",
      en: "APIs, streaming, queues, and data models that bring LLMs into real workflows.",
    },
    icon: Workflow,
  },
  {
    title: { vi: "Đo lường hệ thống", en: "System measurement" },
    description: {
      vi: "Quan sát latency, trace, precision/recall và regression trong pipeline.",
      en: "Tracking latency, traces, precision/recall, and pipeline regressions.",
    },
    icon: Gauge,
  },
] as const;

export function AboutPreviewSection() {
  return (
    <AnimatedSection>
      <div className="space-y-6">
        <SectionHeader
          eyebrow="focus"
          title={<LocalizedText vi="Tôi xây gì" en="What I build" />}
          description={
            <LocalizedText
              vi="Các mảng chính tôi tập trung khi biến LLM từ demo thành hệ thống có thể vận hành."
              en="The main areas I focus on when turning LLM demos into operable systems."
            />
          }
          action={{
            label: <LocalizedText vi="Về tôi" en="About" />,
            href: "/about",
          }}
        />

        <div className="grid gap-3 md:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title.vi}
                className="rounded-lg border bg-card/70 p-4 shadow-sm"
              >
                <span className="flex size-9 items-center justify-center rounded-md bg-[var(--color-accent-text)]/10 text-[var(--color-accent-text)]">
                  <Icon className="size-4" />
                </span>
                <h3 className="mt-4 text-base font-semibold">
                  <LocalizedText vi={item.title.vi} en={item.title.en} />
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  <LocalizedText
                    vi={item.description.vi}
                    en={item.description.en}
                  />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
