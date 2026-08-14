import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { QuizSession } from "@/components/quiz/quiz-session";
import { requireIeltsUser } from "@/lib/auth/guard";
import { getChapterQuiz } from "@/lib/content/quiz";

export const dynamic = "force-dynamic";

type Props = Readonly<{ params: Promise<{ chapter: string }> }>;

export default async function QuizChapterPage({ params }: Props) {
  await requireIeltsUser();
  const { chapter } = await params;
  const quiz = await getChapterQuiz(chapter);

  if (!quiz) notFound();

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/quiz"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-[var(--color-accent-text)] w-fit"
      >
        <ArrowLeft className="size-3" />
        Tất cả chương
      </Link>

      {/* Header */}
      <header className="space-y-1.5 border-b pb-6">
        <p className="tech-mono text-xs font-medium uppercase tracking-wider text-[var(--color-accent-text)]">
          Chương {quiz.chapterNum} · Part {quiz.part} — {quiz.partTitle}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {quiz.title}
        </h1>
        <p className="tech-mono text-xs text-muted-foreground">
          {quiz.mcqQuestions.length} câu trắc nghiệm ·{" "}
          {quiz.shortAnswerQuestions.length} câu trả lời ngắn
        </p>
      </header>

      {/* Interactive session */}
      <QuizSession
        mcqQuestions={quiz.mcqQuestions}
        shortAnswerQuestions={quiz.shortAnswerQuestions}
        chapterTitle={quiz.title}
      />
    </div>
  );
}
