import { FileClock, Layers, Wrench } from "lucide-react";

import { LocalizedText } from "@/components/custom/localized-text";

const skills = [
  {
    title: "AI/RAG",
    items: ["Retrieval", "Reranking", "RAGAS", "Long context", "Agents"],
  },
  {
    title: "Backend",
    items: ["Python", "FastAPI", "Streaming", "APIs", "Observability"],
  },
  {
    title: "Data",
    items: ["Qdrant", "Neo4j", "PostgreSQL", "Embeddings", "Pipelines"],
  },
] as const;

const selectedWork = [
  {
    vi: "FPIC Biodiversity Chatbot: knowledge base và RAG pipeline cho dữ liệu môi trường.",
    en: "FPIC Biodiversity Chatbot: knowledge base and RAG pipeline for environmental data.",
  },
  {
    vi: "Document AI Pipeline: OCR, extraction và chuyển đổi tài liệu thành dữ liệu có cấu trúc.",
    en: "Document AI Pipeline: OCR, extraction, and conversion of documents into structured data.",
  },
  {
    vi: "Web3 QA Automation: sinh test case từ specification và hỗ trợ workflow kiểm thử.",
    en: "Web3 QA Automation: generating test cases from specifications and supporting QA workflows.",
  },
] as const;

export default function ResumePage() {
  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <header className="space-y-4">
        <p className="tech-mono text-xs font-medium uppercase text-[var(--color-accent-text)]">
          cv
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          <LocalizedText vi="Snapshot năng lực" en="Capability snapshot" />
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          <LocalizedText
            vi="Trang này tóm tắt các mảng kỹ thuật chính. Bản PDF đầy đủ đang được cập nhật để khớp với portfolio và case study mới nhất."
            en="This page summarizes my core technical areas. The full PDF is being updated to match the latest portfolio and case studies."
          />
        </p>
        <button
          type="button"
          disabled
          className="inline-flex w-fit cursor-not-allowed items-center gap-2 rounded-lg border bg-muted/60 px-3 py-2 text-sm text-muted-foreground"
        >
          <FileClock className="size-4" />
          <LocalizedText vi="CV PDF sẽ cập nhật" en="CV PDF updating" />
        </button>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        {skills.map((group) => (
          <div key={group.title} className="rounded-lg border bg-card/70 p-4">
            <div className="flex items-center gap-2">
              <Wrench className="size-4 text-[var(--color-accent-text)]" />
              <h2 className="font-semibold">{group.title}</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
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
          <Layers className="size-4 text-[var(--color-accent-text)]" />
          <h2 className="text-xl font-semibold tracking-tight">
            <LocalizedText vi="Selected work" en="Selected work" />
          </h2>
        </div>
        <div className="grid gap-3">
          {selectedWork.map((item) => (
            <div key={item.vi} className="rounded-lg border bg-card/70 p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                <LocalizedText vi={item.vi} en={item.en} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-card/70 p-5">
        <p className="tech-mono text-xs font-medium uppercase text-[var(--color-accent-text)]">
          <LocalizedText vi="đang cập nhật" en="updating" />
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          <LocalizedText
            vi="Experience & education"
            en="Experience & education"
          />
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          <LocalizedText
            vi="Timeline chi tiết sẽ được bổ sung sau khi chuẩn hóa nội dung CV. Hiện portfolio ưu tiên thể hiện năng lực qua dự án và bài viết kỹ thuật."
            en="A detailed timeline will be added after the CV content is normalized. For now, this portfolio emphasizes capability through projects and technical writing."
          />
        </p>
      </section>
    </div>
  );
}
