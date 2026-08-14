"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Lesson } from "@/lib/ielts/plan";
import type { ReadingArticle } from "@/lib/ielts/reading";
import type { Skill } from "@/lib/ielts/schema";
import { cn } from "@/lib/utils";
import { completeGuidedLesson } from "@/server/ielts/lessons";
import { captureLessonCards } from "@/server/ielts/today";

export function TodayWorkbench({
  lesson,
  articles,
  dueCount,
}: {
  lesson: Lesson;
  articles: ReadingArticle[];
  dueCount: number;
}) {
  const activity = lesson.activity;
  const router = useRouter();
  const [sources, setSources] = useState<Record<number, ReadingArticle>>({});
  const [captureText, setCaptureText] = useState("");
  const [captured, setCaptured] = useState<number | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [reflection, setReflection] = useState("");
  const [lessonDone, setLessonDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const noteSkill = useMemo<Skill>(
    () => (activity.skill === "rest" ? "vocab" : activity.skill),
    [activity.skill],
  );

  const selectedSource = Object.values(sources)[0];
  const hasDedicatedTool = Boolean(activity.tool);
  const allStepsComplete = checkedSteps.size === activity.steps.length;
  const hasReflection = reflection.trim().length >= 20;

  function capture() {
    const raw = captureText.trim();
    if (!raw) {
      setError("Dán câu sai, từ mới, collocation hoặc bẫy bạn gặp trước đã.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const res = await captureLessonCards({
          lessonId: lesson.id,
          skill: noteSkill,
          sourceTitle: selectedSource?.title,
          sourceUrl: selectedSource?.url,
          raw,
        });
        setCaptured(res.cardsAdded);
        setCaptureText("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không thể tạo card.");
      }
    });
  }

  function complete() {
    setError(null);
    startTransition(async () => {
      try {
        await completeGuidedLesson({
          lessonId: lesson.id,
          completedSteps: checkedSteps.size,
          reflection,
          sourceTitle: selectedSource?.title,
        });
        setLessonDone(true);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không thể hoàn thành bài.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {activity.steps.map((step, i) => {
          const articleStep = isArticleStep(step.text);
          const selected = sources[i];

          return (
            <li
              key={`${i}-${step.text.slice(0, 8)}`}
              className="space-y-3 rounded-md border p-3"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={checkedSteps.has(i)}
                  onChange={() =>
                    setCheckedSteps((previous) => {
                      const next = new Set(previous);
                      if (next.has(i)) next.delete(i);
                      else next.add(i);
                      return next;
                    })
                  }
                  className="mt-1 size-4 accent-primary"
                  aria-label={`Đã xong bước ${i + 1}`}
                />
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{step.text}</p>
                  <span className="text-[11px] text-muted-foreground">
                    {step.min} phút
                  </span>
                </div>
              </div>

              {articleStep && (
                <div className="space-y-2 rounded-md bg-muted/30 p-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-medium">Bài đọc thật hôm nay</p>
                    <Badge variant="outline" className="text-[10px]">
                      live fetch
                    </Badge>
                  </div>
                  {articles.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Chưa fetch được bài. Thử tải lại trang hoặc mở nguồn
                      Reading/Listening bên dưới.
                    </p>
                  ) : (
                    <div className="grid gap-2 md:grid-cols-2">
                      {articles.map((article) => (
                        <div
                          key={article.url}
                          className={cn(
                            "rounded-md border p-2 transition-colors",
                            selected?.url === article.url &&
                              "border-primary/50 bg-primary/5",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px]">
                              {article.source}
                            </Badge>
                            {article.level && (
                              <span className="truncate text-[10px] text-muted-foreground">
                                {article.level}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm font-medium">
                            {article.title}
                          </p>
                          {article.summary && (
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {article.summary}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="xs"
                              variant={
                                selected?.url === article.url
                                  ? "secondary"
                                  : "outline"
                              }
                              onClick={() =>
                                setSources((prev) => ({
                                  ...prev,
                                  [i]: article,
                                }))
                              }
                            >
                              {selected?.url === article.url
                                ? "Đã chọn"
                                : "Chọn bài"}
                            </Button>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-6 items-center rounded-md px-2 text-xs font-medium text-primary hover:underline"
                            >
                              Mở bài đọc →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {articleStep && selected && (
                <p className="text-xs text-muted-foreground">
                  Source đã chọn: {selected.title}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <details className="rounded-md border bg-muted/20 p-3">
        <summary className="cursor-pointer list-none text-sm font-medium">
          Ghi lại 1–3 lỗi đáng nhớ{" "}
          <span className="text-muted-foreground">(tuỳ chọn)</span>
        </summary>
        <div className="mt-3 space-y-3">
          <p className="text-xs text-muted-foreground">
            Chỉ cần dán câu sai, từ mới hoặc bẫy vừa gặp. App sẽ tạo card ôn
            tập; không cần viết note dài.
          </p>
          <Textarea
            value={captureText}
            onChange={(e) => setCaptureText(e.target.value)}
            placeholder="Ví dụ: do more efforts → make more efforts"
            className="min-h-20 text-sm"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={capture} disabled={pending}>
              Lưu lỗi để ôn lại
            </Button>
            {captured != null && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                Đã thêm {captured} card
              </span>
            )}
            {selectedSource && (
              <span className="truncate text-xs text-muted-foreground">
                Nguồn: {selectedSource.title}
              </span>
            )}
          </div>
        </div>
      </details>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/20 p-3">
        {hasDedicatedTool ? (
          <p className="text-sm text-muted-foreground">
            Sau khi lưu kết quả ở công cụ, bài này sẽ tự được đánh dấu hoàn
            thành.
          </p>
        ) : (
          <div className="w-full space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Xác nhận kết quả buổi học</p>
              <Badge variant={allStepsComplete ? "secondary" : "outline"}>
                {checkedSteps.size}/{activity.steps.length} bước
              </Badge>
            </div>
            <Textarea
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder="Bạn đã làm được gì, lỗi/bẫy nào cần nhớ? (ít nhất 20 ký tự)"
              className="min-h-20 text-sm"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={complete}
                disabled={
                  pending || lessonDone || !allStepsComplete || !hasReflection
                }
              >
                {lessonDone ? "Đã lưu vào lịch sử" : "Hoàn tất & lưu nhật ký"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Tick đủ các bước và ghi điều đã học để mở bài kế tiếp.
              </p>
            </div>
            {lessonDone && (
              <a
                href={`/ielts/history/${lesson.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Xem lại bài vừa làm →
              </a>
            )}
          </div>
        )}
      </div>

      {dueCount > 0 && activity.skill !== "rest" && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary/20 bg-primary/5 p-3">
          <p className="text-sm">
            Bạn có <span className="font-medium">{dueCount} lỗi đến hạn</span>.
            Dành 5–10 phút ôn sau buổi học?
          </p>
          <a
            href="/ielts/review"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ôn sau →
          </a>
        </div>
      )}
    </div>
  );
}

function isArticleStep(text: string): boolean {
  return /bài báo|article|đọc 1 bài/i.test(text);
}
