import { BrainCircuit, Database, TerminalSquare, Workflow } from "lucide-react";

import { LocalizedText } from "@/components/custom/localized-text";

const focusAreas = [
  {
    title: { vi: "RAG & Retrieval", en: "RAG & Retrieval" },
    items: ["Hybrid search", "Reranking", "Context ordering", "Evaluation"],
  },
  {
    title: { vi: "Backend AI", en: "AI Backend" },
    items: ["FastAPI", "Streaming UX", "Queues", "Observability"],
  },
  {
    title: { vi: "Data Systems", en: "Data Systems" },
    items: ["Qdrant", "Neo4j", "PostgreSQL", "Vector/graph modeling"],
  },
] as const;

const workflow = [
  {
    icon: BrainCircuit,
    title: { vi: "Đọc vấn đề", en: "Understand the problem" },
    description: {
      vi: "Bắt đầu từ hành vi người dùng, nguồn dữ liệu và tiêu chí đúng/sai của câu trả lời.",
      en: "Start from user behavior, data sources, and the correctness criteria for answers.",
    },
  },
  {
    icon: Database,
    title: { vi: "Thiết kế retrieval", en: "Design retrieval" },
    description: {
      vi: "Tối ưu indexing, chunking, search, rerank và context assembly trước khi tăng model size.",
      en: "Optimize indexing, chunking, search, reranking, and context assembly before scaling model size.",
    },
  },
  {
    icon: Workflow,
    title: { vi: "Đưa vào production", en: "Move to production" },
    description: {
      vi: "API, monitoring, feedback loop và regression checks để hệ thống không chỉ chạy trong demo.",
      en: "APIs, monitoring, feedback loops, and regression checks so the system works beyond demos.",
    },
  },
] as const;

export default function AboutPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <header className="space-y-4">
        <p className="tech-mono text-xs font-medium uppercase text-[var(--color-accent-text)]">
          <LocalizedText vi="về tôi" en="about" />
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          <LocalizedText
            vi="Tôi xây hệ thống AI ứng dụng với trọng tâm là retrieval, backend và độ tin cậy."
            en="I build applied AI systems focused on retrieval, backend engineering, and reliability."
          />
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          <LocalizedText
            vi="Công việc của tôi nằm ở giao điểm giữa information retrieval, backend engineering và LLM product. Tôi thích biến những prototype AI thành pipeline có thể đo lường, debug và vận hành lâu dài."
            en="My work sits at the intersection of information retrieval, backend engineering, and LLM products. I like turning AI prototypes into pipelines that can be measured, debugged, and operated over time."
          />
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        {focusAreas.map((area) => (
          <div key={area.title.vi} className="rounded-lg border bg-card/70 p-4">
            <h2 className="text-base font-semibold">
              <LocalizedText vi={area.title.vi} en={area.title.en} />
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {area.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border bg-background/60 px-2 py-1 tech-mono text-[10px] text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TerminalSquare className="size-4 text-[var(--color-accent-text)]" />
          <h2 className="text-xl font-semibold tracking-tight">
            <LocalizedText vi="Cách tôi làm việc" en="How I work" />
          </h2>
        </div>
        <div className="grid gap-3">
          {workflow.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title.vi}
                className="flex gap-4 rounded-lg border bg-card/70 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent-text)]/10 text-[var(--color-accent-text)]">
                  <Icon className="size-4" />
                </span>
                <div>
                  <h3 className="font-semibold">
                    <LocalizedText vi={step.title.vi} en={step.title.en} />
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    <LocalizedText
                      vi={step.description.vi}
                      en={step.description.en}
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border bg-card/70 p-5">
        <h2 className="text-xl font-semibold tracking-tight">
          <LocalizedText vi="Hướng hiện tại" en="Current direction" />
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          <LocalizedText
            vi="Tôi đang tập trung vào RAG evaluation, long-context retrieval, graph/vector search và workflow giúp engineer kiểm soát chất lượng hệ thống LLM qua từng lần thay đổi."
            en="I am currently focused on RAG evaluation, long-context retrieval, graph/vector search, and workflows that help engineers control LLM system quality across changes."
          />
        </p>
      </section>
    </div>
  );
}
