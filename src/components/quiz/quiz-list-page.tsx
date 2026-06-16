"use client";

import { useMemo, useState } from "react";

import { SectionHeader } from "@/components/custom/section-header";
import type { ChapterSummary } from "@/lib/content/quiz";
import { cn } from "@/lib/utils";
import { QuizCard } from "./quiz-card";

type Part = "all" | "I" | "II" | "III";

const PART_LABELS: Record<Part, string> = {
  all: "Tất cả",
  I: "Part I — Tabular",
  II: "Part II — Approximate",
  III: "Part III — Looking Deeper",
};

type QuizListPageProps = Readonly<{ chapters: ChapterSummary[] }>;

export function QuizListPage({ chapters }: QuizListPageProps) {
  const [activePart, setActivePart] = useState<Part>("all");

  const filtered = useMemo(
    () =>
      activePart === "all"
        ? chapters
        : chapters.filter((c) => c.part === activePart),
    [chapters, activePart],
  );

  const totals = useMemo(
    () => ({
      mcq: chapters.reduce((s, c) => s + c.mcqCount, 0),
      sa: chapters.reduce((s, c) => s + c.saCount, 0),
    }),
    [chapters],
  );

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader
        eyebrow="quiz"
        title="RL Book Quiz"
        titleAs="h1"
        description={`Bộ câu hỏi ôn tập bám sát từng chương sách Reinforcement Learning: An Introduction (Sutton & Barto, 2nd ed.) — ${totals.mcq} câu trắc nghiệm và ${totals.sa} câu trả lời ngắn.`}
      />

      {/* Part filter */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PART_LABELS) as Part[]).map((part) => (
          <button
            key={part}
            type="button"
            onClick={() => setActivePart(part)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs transition-colors",
              activePart === part
                ? "border-[var(--color-accent-text)] bg-[var(--color-accent-text)]/10 text-[var(--color-accent-text)]"
                : "bg-background/60 text-muted-foreground hover:border-[var(--color-accent-text)]/50 hover:text-foreground",
            )}
          >
            {PART_LABELS[part]}
          </button>
        ))}
      </div>

      {/* Chapter grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((chapter) => (
          <QuizCard key={chapter.slug} chapter={chapter} />
        ))}
      </div>
    </div>
  );
}
