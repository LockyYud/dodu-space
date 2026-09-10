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
    title: { vi: "Đọc vấn đề", en: "Understand the problem" },
    description: {
      vi: "Bắt đầu từ hành vi người dùng, nguồn dữ liệu và tiêu chí đúng/sai của câu trả lời.",
      en: "Start from user behavior, data sources, and the correctness criteria for answers.",
    },
  },
  {
    title: { vi: "Thiết kế retrieval", en: "Design retrieval" },
    description: {
      vi: "Tối ưu indexing, chunking, search, rerank và context assembly trước khi tăng model size.",
      en: "Optimize indexing, chunking, search, reranking, and context assembly before scaling model size.",
    },
  },
  {
    title: { vi: "Đưa vào production", en: "Move to production" },
    description: {
      vi: "API, monitoring, feedback loop và regression checks để hệ thống không chỉ chạy trong demo.",
      en: "APIs, monitoring, feedback loops, and regression checks so the system works beyond demos.",
    },
  },
] as const;

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <header className="grid gap-6 pb-16 pt-10 md:grid-cols-12">
        <div className="flex flex-col gap-6 md:col-span-9">
          <p className="eyebrow eyebrow-accent">
            <LocalizedText vi="VỀ TÔI" en="ABOUT" />
          </p>
          <h1 className="max-w-[34ch] text-[2.5rem] leading-[1.08] md:text-[3.5rem]">
            <LocalizedText
              vi="Tôi xây hệ thống AI ứng dụng với trọng tâm là retrieval, backend và độ tin cậy."
              en="I build applied AI systems focused on retrieval, backend engineering, and reliability."
            />
          </h1>
          <p className="max-w-[38rem] text-xl leading-relaxed text-muted-foreground">
            <LocalizedText
              vi="Công việc của tôi nằm ở giao điểm giữa information retrieval, backend engineering và LLM product. Tôi thích biến những prototype AI thành pipeline có thể đo lường, debug và vận hành lâu dài."
              en="My work sits at the intersection of information retrieval, backend engineering, and LLM products. I like turning AI prototypes into pipelines that can be measured, debugged, and operated over time."
            />
          </p>
        </div>
      </header>

      <section className="grid gap-8 pb-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="eyebrow">
            <LocalizedText vi="MẢNG TẬP TRUNG" en="FOCUS AREAS" />
          </p>
        </div>
        <div className="grid gap-8 border-t border-border pt-7 md:col-span-9 md:grid-cols-3">
          {focusAreas.map((area) => (
            <div key={area.title.vi} className="flex flex-col gap-2">
              <h2 className="text-[22px] leading-snug">
                <LocalizedText vi={area.title.vi} en={area.title.en} />
              </h2>
              <p className="meta leading-relaxed text-muted-foreground">
                {area.items.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 pb-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="eyebrow">
            <LocalizedText vi="CÁCH TÔI LÀM VIỆC" en="HOW I WORK" />
          </p>
        </div>
        <div className="flex flex-col border-t border-border md:col-span-9">
          {workflow.map((step, index) => (
            <div
              key={step.title.vi}
              className="grid gap-x-6 gap-y-2 border-b border-border-soft py-6 last:border-b-0 md:grid-cols-[4rem_minmax(0,1fr)]"
            >
              <p className="eyebrow eyebrow-accent md:pt-2">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[22px] leading-snug">
                  <LocalizedText vi={step.title.vi} en={step.title.en} />
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  <LocalizedText
                    vi={step.description.vi}
                    en={step.description.en}
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 pb-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="eyebrow">
            <LocalizedText vi="HƯỚNG HIỆN TẠI" en="CURRENT DIRECTION" />
          </p>
        </div>
        <div className="border-t border-border pt-7 md:col-span-9">
          <p className="max-w-[38rem] text-xl leading-relaxed">
            <LocalizedText
              vi="Tôi đang tập trung vào RAG evaluation, long-context retrieval, graph/vector search và workflow giúp engineer kiểm soát chất lượng hệ thống LLM qua từng lần thay đổi."
              en="I am currently focused on RAG evaluation, long-context retrieval, graph/vector search, and workflows that help engineers control LLM system quality across changes."
            />
          </p>
        </div>
      </section>
    </div>
  );
}
