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
import { completeLesson } from "@/server/ielts/lessons";
import { saveTodayNote } from "@/server/ielts/today";

export function TodayWorkbench({
  lesson,
  articles,
}: {
  lesson: Lesson;
  articles: ReadingArticle[];
}) {
  const activity = lesson.activity;
  const router = useRouter();
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [sources, setSources] = useState<Record<number, ReadingArticle>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [lessonDone, setLessonDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const noteSkill = useMemo<Skill>(
    () => (activity.skill === "rest" ? "vocab" : activity.skill),
    [activity.skill],
  );

  function save(index: number, minutes: number) {
    const note = notes[index]?.trim();
    if (!note) {
      setError("Ghi vài dòng trước khi lưu note.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await saveTodayNote({
          lessonId: lesson.id,
          skill: noteSkill,
          durationMin: minutes,
          sourceUrl: sources[index]?.url,
          notes: withSource(note, sources[index]),
        });
        setSaved((prev) => ({ ...prev, [index]: true }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu note thất bại.");
      }
    });
  }

  function complete() {
    setError(null);
    startTransition(async () => {
      try {
        await completeLesson(lesson.id);
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

              <div className="space-y-2">
                <Textarea
                  value={notes[i] ?? ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [i]: e.target.value }))
                  }
                  placeholder={placeholderFor(step.text, articleStep)}
                  className="min-h-28 text-sm"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => save(i, step.min)}
                  >
                    {saved[i] ? "Đã lưu note" : "Lưu note"}
                  </Button>
                  {selected && (
                    <span className="truncate text-xs text-muted-foreground">
                      Source: {selected.title}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/20 p-3">
        <Button onClick={complete} disabled={pending || lessonDone}>
          {lessonDone ? "Đã hoàn thành" : "Hoàn thành bài này"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Bấm nút này mới chuyển sang bài kế tiếp. Nếu bỏ qua vài ngày, bài này
          vẫn nằm ở đây.
        </p>
      </div>
    </div>
  );
}

function isArticleStep(text: string): boolean {
  return /bài báo|article|đọc 1 bài/i.test(text);
}

function placeholderFor(text: string, articleStep: boolean): string {
  if (articleStep) {
    return [
      "Summary 2-3 câu:",
      "Vocab/collocation:",
      "1 câu paraphrase lại ý chính:",
      "Câu hỏi/chỗ chưa hiểu:",
    ].join("\n");
  }
  if (/viết|essay|dàn ý/i.test(text)) {
    return [
      "Ý chính:",
      "Câu/cụm muốn sửa:",
      "Viết lại phiên bản tốt hơn:",
    ].join("\n");
  }
  return ["Takeaway:", "Từ/cụm cần nhớ:", "Lỗi hoặc bẫy gặp phải:"].join("\n");
}

function withSource(note: string, source?: ReadingArticle): string {
  if (!source) return note;
  return [`Article: ${source.title}`, `URL: ${source.url}`, "", note].join(
    "\n",
  );
}
