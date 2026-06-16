import { ArrowRight, BookOpen, FileQuestion } from "lucide-react";
import Link from "next/link";

import { GradientCard } from "@/components/custom/gradient-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChapterSummary } from "@/lib/content/quiz";

const PART_COLORS = {
  I: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
  II: "bg-violet-500/10 text-violet-500 dark:text-violet-400",
  III: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
} as const;

export function QuizCard({ chapter }: Readonly<{ chapter: ChapterSummary }>) {
  return (
    <Link href={`/quiz/${chapter.slug}`} className="group block min-w-0">
      <div className="transition-all duration-200 hover:-translate-y-1">
        <GradientCard className="hover:border-[var(--color-accent-text)]/40 hover:shadow-[0_16px_32px_-16px_color-mix(in_oklab,var(--color-accent-text),transparent_60%)]">
          <Card className="flex h-full flex-col border-0 bg-transparent">
            <CardHeader className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <Badge
                  variant="secondary"
                  className="bg-[var(--color-accent-text)]/10 tech-mono text-xs text-[var(--color-accent-text)]"
                >
                  Ch.{chapter.chapterNum}
                </Badge>
                <span
                  className={`rounded-full px-2 py-0.5 tech-mono text-[10px] ${PART_COLORS[chapter.part]}`}
                >
                  Part {chapter.part}
                </span>
              </div>
              <CardTitle className="text-[1rem] leading-snug [overflow-wrap:anywhere] group-hover:text-[var(--color-accent-text)]">
                {chapter.title}
              </CardTitle>
              <p className="tech-mono text-[11px] text-muted-foreground">
                {chapter.partTitle}
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-1 tech-mono text-[11px] text-muted-foreground">
                  <BookOpen className="size-3" />
                  {chapter.mcqCount} MCQ
                </span>
                <span className="flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-1 tech-mono text-[11px] text-muted-foreground">
                  <FileQuestion className="size-3" />
                  {chapter.saCount} Short Answer
                </span>
              </div>
              <span className="flex items-center gap-1 self-end text-xs text-muted-foreground/60 transition-colors group-hover:text-[var(--color-accent-text)]">
                Ôn luyện
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </CardContent>
          </Card>
        </GradientCard>
      </div>
    </Link>
  );
}
