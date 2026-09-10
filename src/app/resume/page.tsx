import { LocalizedText } from "@/components/custom/localized-text";

const skills = [
  {
    title: "AI / RAG",
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
    name: "FPIC Biodiversity Chatbot",
    vi: "Knowledge base và RAG pipeline cho dữ liệu môi trường.",
    en: "Knowledge base and RAG pipeline for environmental data.",
  },
  {
    name: "Document AI Pipeline",
    vi: "OCR, extraction và chuyển đổi tài liệu thành dữ liệu có cấu trúc.",
    en: "OCR, extraction, and conversion of documents into structured data.",
  },
  {
    name: "Web3 QA Automation",
    vi: "Sinh test case từ specification và hỗ trợ workflow kiểm thử.",
    en: "Generating test cases from specifications and supporting QA workflows.",
  },
] as const;

export default function ResumePage() {
  return (
    <div className="flex flex-col">
      <header className="grid gap-6 pb-16 pt-10 md:grid-cols-12">
        <div className="flex flex-col gap-5 md:col-span-8">
          <p className="eyebrow eyebrow-accent">CV</p>
          <h1 className="text-5xl leading-[1.05] md:text-6xl">
            <LocalizedText vi="Snapshot năng lực" en="Capability snapshot" />
          </h1>
          <p className="max-w-[36rem] text-xl leading-relaxed text-muted-foreground">
            <LocalizedText
              vi="Trang này tóm tắt các mảng kỹ thuật chính. Bản PDF đầy đủ đang được cập nhật để khớp với portfolio và case study mới nhất."
              en="This page summarizes my core technical areas. The full PDF is being updated to match the latest portfolio and case studies."
            />
          </p>
          <p className="meta text-muted-foreground">
            <LocalizedText
              vi="[cv pdf: đang cập nhật]"
              en="[cv pdf: updating]"
            />
          </p>
        </div>
      </header>

      <section className="grid gap-8 pb-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="eyebrow">
            <LocalizedText vi="KỸ NĂNG" en="SKILLS" />
          </p>
        </div>
        <div className="grid gap-8 border-t border-border pt-7 md:col-span-9 md:grid-cols-3">
          {skills.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <h2 className="text-[22px] leading-snug">{group.title}</h2>
              <p className="meta leading-relaxed text-muted-foreground">
                {group.items.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 pb-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="eyebrow">
            <LocalizedText vi="CÔNG VIỆC CHỌN LỌC" en="SELECTED WORK" />
          </p>
        </div>
        <div className="flex flex-col border-t border-border md:col-span-9">
          {selectedWork.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-1.5 border-b border-border-soft py-6 last:border-b-0"
            >
              <h3 className="text-[22px] leading-snug">{item.name}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                <LocalizedText vi={item.vi} en={item.en} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 pb-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="eyebrow">
            <LocalizedText
              vi="KINH NGHIỆM & HỌC VẤN"
              en="EXPERIENCE & EDUCATION"
            />
          </p>
        </div>
        <div className="flex flex-col gap-3 border-t border-border pt-7 md:col-span-9">
          <p className="max-w-[38rem] text-xl leading-relaxed">
            <LocalizedText
              vi="Timeline chi tiết sẽ được bổ sung sau khi chuẩn hóa nội dung CV. Hiện portfolio ưu tiên thể hiện năng lực qua dự án và bài viết kỹ thuật."
              en="A detailed timeline will be added after the CV content is normalized. For now, this portfolio emphasizes capability through projects and technical writing."
            />
          </p>
          <p className="meta text-muted-foreground">
            <LocalizedText
              vi="[timeline: đang cập nhật]"
              en="[timeline: updating]"
            />
          </p>
        </div>
      </section>
    </div>
  );
}
