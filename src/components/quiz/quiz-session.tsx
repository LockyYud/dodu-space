"use client";

import { CheckCircle2, ChevronDown, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

import type { MCQQuestion, ShortAnswerQuestion } from "@/lib/content/quiz-parser";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "mcq" | "sa";
type MCQAnswers = Record<string, "A" | "B" | "C" | "D">;
type SARevealed = Record<string, boolean>;

// ─── MCQ Question Card ────────────────────────────────────────────────────────

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

function MCQCard({
  q,
  selected,
  onSelect,
}: Readonly<{
  q: MCQQuestion;
  selected: "A" | "B" | "C" | "D" | undefined;
  onSelect: (opt: "A" | "B" | "C" | "D") => void;
}>) {
  const answered = selected !== undefined;
  const correct = selected === q.answer;

  return (
    <div className="rounded-lg border bg-card/60 p-5 space-y-4">
      {/* Question */}
      <p className="text-sm leading-6">
        <span className="tech-mono font-semibold text-[var(--color-accent-text)] mr-2">
          Câu {q.number}.
        </span>
        {q.question}
      </p>

      {/* Options */}
      <div className="grid gap-2">
        {OPTION_KEYS.map((opt) => {
          const optText = q.options[opt];
          const isSelected = selected === opt;
          const isCorrect = opt === q.answer;

          let style = "border-border/60 bg-background/50 hover:border-[var(--color-accent-text)]/40 hover:bg-[var(--color-accent-text)]/5";
          if (answered) {
            if (isCorrect) {
              style = "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
            } else if (isSelected && !isCorrect) {
              style = "border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-400";
            } else {
              style = "border-border/30 bg-background/30 text-muted-foreground";
            }
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={answered}
              onClick={() => onSelect(opt)}
              className={cn(
                "flex items-start gap-3 rounded-md border p-3 text-left text-sm transition-colors",
                answered ? "cursor-default" : "cursor-pointer",
                style,
              )}
            >
              <span className={cn(
                "tech-mono shrink-0 text-xs font-semibold w-5",
                answered && isCorrect && "text-emerald-600 dark:text-emerald-400",
                answered && isSelected && !isCorrect && "text-red-600 dark:text-red-400",
              )}>
                {opt}.
              </span>
              <span className="leading-5">{optText}</span>
              {answered && isCorrect && (
                <CheckCircle2 className="ml-auto shrink-0 size-4 text-emerald-500" />
              )}
              {answered && isSelected && !isCorrect && (
                <XCircle className="ml-auto shrink-0 size-4 text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && q.explanation && (
        <div className={cn(
          "rounded-md border-l-2 bg-muted/40 px-4 py-3 text-sm leading-6 text-muted-foreground",
          correct ? "border-emerald-500/50" : "border-red-500/50",
        )}>
          <span className="font-medium text-foreground">
            {correct ? "Chính xác! " : `Đáp án đúng: ${q.answer}. `}
          </span>
          {q.explanation}
        </div>
      )}
    </div>
  );
}

// ─── Short Answer Card ────────────────────────────────────────────────────────

function SACard({
  q,
  revealed,
  onReveal,
}: Readonly<{
  q: ShortAnswerQuestion;
  revealed: boolean;
  onReveal: () => void;
}>) {
  const [userAnswer, setUserAnswer] = useState("");

  return (
    <div className="rounded-lg border bg-card/60 p-5 space-y-4">
      <p className="text-sm leading-6">
        <span className="tech-mono font-semibold text-[var(--color-accent-text)] mr-2">
          Câu {q.number}.
        </span>
        {q.question}
      </p>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Gõ câu trả lời của bạn ở đây..."
        rows={3}
        className="w-full resize-y rounded-md border bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-[var(--color-accent-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-text)]/30"
      />

      <button
        type="button"
        onClick={onReveal}
        className={cn(
          "flex items-center gap-1.5 text-xs transition-colors",
          revealed
            ? "text-[var(--color-accent-text)]"
            : "text-muted-foreground hover:text-[var(--color-accent-text)]",
        )}
      >
        <ChevronDown className={cn("size-3.5 transition-transform", revealed && "rotate-180")} />
        {revealed ? "Ẩn đáp án tham khảo" : "Xem đáp án tham khảo"}
      </button>

      {revealed && q.referenceAnswer && (
        <div className="rounded-md border border-[var(--color-accent-text)]/20 bg-[var(--color-accent-text)]/5 px-4 py-3 text-sm leading-6 text-muted-foreground">
          <p className="tech-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent-text)] mb-2">
            Đáp án tham khảo
          </p>
          {q.referenceAnswer}
        </div>
      )}
    </div>
  );
}

// ─── Section Group ────────────────────────────────────────────────────────────

function groupBySection<T extends { section: string }>(items: T[]) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = item.section || "Không có mục";
    const existing = groups.get(key);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(key, [item]);
    }
  }
  return groups;
}

// ─── Score Banner ─────────────────────────────────────────────────────────────

function ScoreBanner({
  answered,
  correct,
  total,
  onReset,
}: Readonly<{
  answered: number;
  correct: number;
  total: number;
  onReset: () => void;
}>) {
  const pct = total > 0 ? Math.round((correct / Math.max(answered, 1)) * 100) : 0;

  return (
    <div className="sticky top-16 z-10 rounded-lg border bg-background/95 p-3 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Đã trả lời:{" "}
            <span className="font-semibold text-foreground">{answered}/{total}</span>
          </span>
          {answered > 0 && (
            <span className="text-muted-foreground">
              Đúng:{" "}
              <span className={cn(
                "font-semibold",
                pct >= 80 ? "text-emerald-500" : pct >= 60 ? "text-amber-500" : "text-red-500",
              )}>
                {correct}/{answered} ({pct}%)
              </span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="hidden w-32 rounded-full bg-muted/60 h-1.5 sm:block">
            <div
              className="h-1.5 rounded-full bg-[var(--color-accent-text)] transition-all duration-300"
              style={{ width: `${(answered / total) * 100}%` }}
            />
          </div>
          {answered > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              title="Làm lại"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Làm lại</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Session Component ───────────────────────────────────────────────────

type QuizSessionProps = Readonly<{
  mcqQuestions: MCQQuestion[];
  shortAnswerQuestions: ShortAnswerQuestion[];
  chapterTitle: string;
}>;

export function QuizSession({
  mcqQuestions,
  shortAnswerQuestions,
  chapterTitle,
}: QuizSessionProps) {
  const [activeTab, setActiveTab] = useState<Tab>("mcq");
  const [mcqAnswers, setMcqAnswers] = useState<MCQAnswers>({});
  const [saRevealed, setSaRevealed] = useState<SARevealed>({});

  const answeredCount = Object.keys(mcqAnswers).length;
  const correctCount = Object.values(mcqAnswers).filter(
    (ans, i) => ans === mcqQuestions[i]?.answer,
  ).length;
  // More accurate correct count
  const correctCountAccurate = mcqQuestions.filter(
    (q) => mcqAnswers[q.id] === q.answer,
  ).length;

  const mcqGroups = groupBySection(mcqQuestions);
  const saGroups = groupBySection(shortAnswerQuestions);

  function handleMCQAnswer(id: string, opt: "A" | "B" | "C" | "D") {
    setMcqAnswers((prev) => ({ ...prev, [id]: opt }));
  }

  function handleSAReveal(id: string) {
    setSaRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleReset() {
    setMcqAnswers({});
    setSaRevealed({});
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/30 p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("mcq")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            activeTab === "mcq"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Trắc nghiệm
          <span className="ml-2 tech-mono text-xs text-[var(--color-accent-text)]">
            {mcqQuestions.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sa")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            activeTab === "sa"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Trả lời ngắn
          <span className="ml-2 tech-mono text-xs text-[var(--color-accent-text)]">
            {shortAnswerQuestions.length}
          </span>
        </button>
      </div>

      {/* MCQ Tab */}
      {activeTab === "mcq" && mcqQuestions.length > 0 && (
        <>
          <ScoreBanner
            answered={answeredCount}
            correct={correctCountAccurate}
            total={mcqQuestions.length}
            onReset={handleReset}
          />
          <div className="flex flex-col gap-8">
            {[...mcqGroups.entries()].map(([section, questions]) => (
              <section key={section} className="space-y-4">
                <h2 className="text-sm font-semibold text-[var(--color-accent-text)] border-b border-border/60 pb-2">
                  {section}
                </h2>
                <div className="flex flex-col gap-3">
                  {questions.map((q) => (
                    <MCQCard
                      key={q.id}
                      q={q}
                      selected={mcqAnswers[q.id]}
                      onSelect={(opt) => handleMCQAnswer(q.id, opt)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {/* Short Answer Tab */}
      {activeTab === "sa" && shortAnswerQuestions.length > 0 && (
        <div className="flex flex-col gap-8">
          {[...saGroups.entries()].map(([section, questions]) => (
            <section key={section} className="space-y-4">
              <h2 className="text-sm font-semibold text-[var(--color-accent-text)] border-b border-border/60 pb-2">
                {section}
              </h2>
              <div className="flex flex-col gap-3">
                {questions.map((q) => (
                  <SACard
                    key={q.id}
                    q={q}
                    revealed={saRevealed[q.id] ?? false}
                    onReveal={() => handleSAReveal(q.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {activeTab === "mcq" && mcqQuestions.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có câu trắc nghiệm.</p>
      )}
      {activeTab === "sa" && shortAnswerQuestions.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có câu trả lời ngắn.</p>
      )}
    </div>
  );
}
