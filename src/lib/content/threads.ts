import type { BlogPost } from "@/lib/content/blog";

export type ResearchThread = {
  id: string;
  title: string;
  descriptionVi: string;
  descriptionEn: string;
  statusVi?: string;
  statusEn?: string;
  matches: (post: BlogPost) => boolean;
};

/**
 * Threads are a reading path over the archive, not a taxonomy in the content:
 * only `llm-from-scratch` sets `thread` in frontmatter, the rest resolve by
 * tag. Kept here (not in the blog list component) so post pages can label a
 * post with its thread server-side.
 */
export const RESEARCH_THREADS: ResearchThread[] = [
  {
    id: "llm-from-scratch",
    title: "LLM From Scratch",
    descriptionVi:
      "Transformer, GPT-2 style LM, LLaMA-style block và serving từ góc nhìn implement.",
    descriptionEn:
      "Transformer, GPT-2 style LMs, LLaMA-style blocks, and serving from an implementation lens.",
    statusVi: "Roadmap đã có",
    statusEn: "Roadmap drafted",
    matches: (post) =>
      post.thread === "llm-from-scratch" ||
      post.tags?.some((tag) =>
        ["LLM From Scratch", "Transformer", "GPT"].includes(tag),
      ) === true,
  },
  {
    id: "rag-systems",
    title: "RAG Systems",
    descriptionVi:
      "Retrieval, reranking, GraphRAG, evaluation và các quyết định production.",
    descriptionEn:
      "Retrieval, reranking, GraphRAG, evaluation, and production trade-offs.",
    matches: (post) =>
      post.thread === "rag-systems" ||
      post.tags?.some((tag) =>
        [
          "RAG",
          "GraphRAG",
          "Retrieval",
          "Evaluation",
          "Reranking",
          "Qdrant",
          "Neo4j",
        ].includes(tag),
      ) === true,
  },
  {
    id: "paper-notes",
    title: "Paper Notes",
    descriptionVi:
      "Ghi chú đọc paper tập trung vào thesis, trade-off và hướng triển khai.",
    descriptionEn:
      "Paper reading notes focused on thesis, trade-offs, and implementation paths.",
    matches: (post) =>
      post.thread === "paper-notes" ||
      /\b(20\d{2})\b/.test(post.slug) ||
      post.tags?.some((tag) =>
        ["DPR", "RAPTOR", "Adaptive RAG", "Corrective RAG"].includes(tag),
      ) === true,
  },
  {
    id: "engineering",
    title: "Engineering Notes",
    descriptionVi:
      "Tooling, framework, streaming và các ghi chú xây hệ thống hằng ngày.",
    descriptionEn:
      "Tooling, frameworks, streaming, and day-to-day system building notes.",
    matches: (post) =>
      post.thread === "engineering" ||
      post.tags?.some((tag) =>
        [
          "FastAPI",
          "Next.js",
          "Streaming",
          "Neovim",
          "Linux",
          "Tooling",
        ].includes(tag),
      ) === true,
  },
];

/**
 * The most specific thread a post belongs to. Paper Notes is checked last so a
 * dated RAG paper note reads as "RAG Systems" rather than the generic bucket.
 */
export function findThreadForPost(post: BlogPost): ResearchThread | null {
  const explicit = RESEARCH_THREADS.find((thread) => thread.id === post.thread);
  if (explicit) return explicit;

  const ordered = [
    ...RESEARCH_THREADS.filter((thread) => thread.id !== "paper-notes"),
    ...RESEARCH_THREADS.filter((thread) => thread.id === "paper-notes"),
  ];

  return ordered.find((thread) => thread.matches(post)) ?? null;
}
