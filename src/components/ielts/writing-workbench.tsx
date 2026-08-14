"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GradingResult, TaskType } from "@/lib/ielts/grading";
import type { Lesson } from "@/lib/ielts/plan";
import { cn } from "@/lib/utils";
import { gradeAction, saveSubmission } from "@/server/ielts/writing";

type CriterionKey = "task_response" | "coherence" | "lexical" | "grammar";
const CRITERIA: { key: CriterionKey; label: string }[] = [
  { key: "task_response", label: "Task Response" },
  { key: "coherence", label: "Coherence & Cohesion" },
  { key: "lexical", label: "Lexical Resource" },
  { key: "grammar", label: "Grammar" },
];

export function WritingWorkbench({
  configured,
  lesson,
}: {
  configured: boolean;
  lesson?: Lesson;
}) {
  const plannedTaskType: TaskType = lesson?.activity.label.includes("Task 1")
    ? "task1"
    : "task2";
  const [taskType, setTaskType] = useState<TaskType>(plannedTaskType);
  const [topic, setTopic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [repairNote, setRepairNote] = useState("");
  const [saved, setSaved] = useState<{
    cardsAdded: number;
    lessonCompleted: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [grading, startGrading] = useTransition();
  const [saving, startSaving] = useTransition();

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const minimumWords = taskType === "task1" ? 150 : 250;
  const timeLimit = taskType === "task1" ? 20 * 60 : 40 * 60;

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(
      () => setElapsed((value) => value + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [started]);

  useEffect(() => {
    if (taskType === "task1" || taskType === "task2") {
      setStarted(false);
      setElapsed(0);
    }
  }, [taskType]);

  function handleGrade() {
    if (wordCount < minimumWords) {
      setError(`Bài này cần ít nhất ${minimumWords} từ trước khi chấm.`);
      return;
    }
    setError(null);
    setSaved(null);
    startGrading(async () => {
      try {
        const r = await gradeAction({ taskType, prompt, essay });
        setResult(r);
        setSelected(new Set(r.error_cards.slice(0, 3).map((_, i) => i)));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Chấm bài thất bại.");
      }
    });
  }

  function handleSave() {
    if (!result) return;
    setError(null);
    startSaving(async () => {
      try {
        const cards = result.error_cards.filter((_, i) => selected.has(i));
        const res = await saveSubmission({
          lessonId: lesson?.id,
          taskType,
          topic: topic || undefined,
          prompt: prompt || undefined,
          essay,
          result,
          selectedCards: cards,
          repairNote,
        });
        setSaved({
          cardsAdded: res.cardsAdded,
          lessonCompleted: res.lessonCompleted,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu thất bại.");
      }
    });
  }

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else if (next.size < 3) next.add(i);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {lesson && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
          <div>
            <p className="text-xs font-medium text-primary">
              Đang làm bài hôm nay
            </p>
            <p className="text-sm font-medium">
              Bài {lesson.index}: {lesson.activity.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {lesson.activity.focus}
            </p>
          </div>
          <Link
            href="/ielts/today"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Quay lại Hôm nay
          </Link>
        </div>
      )}

      {!configured && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          Chưa cấu hình AI chấm bài. Đặt <code>LLM_BASE_URL</code>,{" "}
          <code>LLM_API_KEY</code>, <code>LLM_MODEL</code> trong{" "}
          <code>.env</code> để bật.
        </div>
      )}

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bài viết</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {lesson ? (
              <Badge variant="secondary">
                Phiên này:{" "}
                {taskType === "task2" ? "Task 2 (Essay)" : "Task 1 (Report)"}
              </Badge>
            ) : (
              (["task2", "task1"] as TaskType[]).map((t) => (
                <Button
                  key={t}
                  type="button"
                  size="sm"
                  variant={taskType === t ? "default" : "outline"}
                  onClick={() => setTaskType(t)}
                >
                  {t === "task2" ? "Task 2 (Essay)" : "Task 1 (Report)"}
                </Button>
              ))
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {wordCount} từ
            </span>
          </div>
          <Input
            placeholder="Chủ đề (tuỳ chọn, vd: Environment)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Textarea
            placeholder="Đề bài / prompt (tuỳ chọn)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-16"
          />
          <Textarea
            placeholder="Viết bài viết của bạn vào đây…"
            value={essay}
            onChange={(e) => {
              setEssay(e.target.value);
              if (e.target.value.trim() && !started) setStarted(true);
            }}
            className="min-h-64"
          />
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={
                elapsed > timeLimit
                  ? "text-xs text-destructive"
                  : "text-xs text-muted-foreground"
              }
            >
              {started
                ? `${formatTime(elapsed)} / ${formatTime(timeLimit)}`
                : `Gợi ý: ${formatTime(timeLimit)}`}
            </span>
            <Button
              onClick={handleGrade}
              disabled={!configured || grading || wordCount < minimumWords}
            >
              {grading ? "Đang chấm…" : "Chấm bài"}
            </Button>
            {essay.trim().length > 0 && wordCount < minimumWords && (
              <span className="text-xs text-muted-foreground">
                Còn {minimumWords - wordCount} từ nữa để chấm.
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kết quả chấm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {CRITERIA.map((c) => (
                  <BandTile
                    key={c.key}
                    label={c.label}
                    value={result.bands[c.key]}
                  />
                ))}
                <BandTile
                  label="Overall"
                  value={result.bands.overall}
                  highlight
                />
              </div>
              <div className="space-y-2 text-sm">
                {CRITERIA.map((c) => (
                  <p key={c.key}>
                    <span className="font-medium">{c.label}: </span>
                    <span className="text-muted-foreground">
                      {result.feedback[c.key]}
                    </span>
                  </p>
                ))}
              </div>
              {result.feedback.to_reach_7.length > 0 && (
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  <p className="mb-1 font-medium">Để chạm band 7:</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {result.feedback.to_reach_7.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">
                Repair ngay bây giờ · 5 phút
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Đừng chỉ đọc feedback. Hãy viết lại một câu/đoạn yếu nhất, hoặc
                nêu chính xác thay đổi bạn sẽ áp dụng ở lần viết sau.
              </p>
              <Textarea
                value={repairNote}
                onChange={(event) => setRepairNote(event.target.value)}
                placeholder="Ví dụ: Body 2 thiếu giải thích. Tôi viết lại: This is because ... Therefore ..."
                className="min-h-28"
              />
              <p className="text-xs text-muted-foreground">
                {repairNote.trim().length < 20
                  ? `Còn ${20 - repairNote.trim().length} ký tự để chốt repair.`
                  : "Repair đã sẵn sàng để lưu."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Lỗi quan trọng — chọn tối đa 3 lỗi để ôn ({selected.size}/3)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.error_cards.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Không có lỗi đáng chú ý.
                </p>
              )}
              {result.error_cards.map((c, i) => (
                <button
                  key={`${c.front}-${i}`}
                  type="button"
                  onClick={() => toggle(i)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
                    selected.has(i)
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:bg-muted/40",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(i)}
                    readOnly
                    className="mt-1"
                  />
                  <div className="min-w-0 space-y-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {c.error_type}
                    </Badge>
                    <p className="text-sm text-destructive line-through">
                      {c.front}
                    </p>
                    <p className="text-sm font-medium">{c.back}</p>
                    {c.explanation && (
                      <p className="text-xs text-muted-foreground">
                        {c.explanation}
                      </p>
                    )}
                  </div>
                </button>
              ))}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={handleSave}
                  disabled={
                    saving || saved != null || repairNote.trim().length < 20
                  }
                >
                  {saving
                    ? "Đang lưu…"
                    : saved
                      ? "Đã lưu bài"
                      : `Lưu bài + ${selected.size} lỗi`}
                </Button>
              </div>
            </CardContent>
          </Card>
          {saved && (
            <Card className="border-emerald-500/40 bg-emerald-500/5">
              <CardContent className="space-y-4 py-5">
                <div className="space-y-1">
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">
                    Attempt đã được lưu
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {saved.cardsAdded} lỗi đã vào lịch ôn
                    {saved.lessonCompleted
                      ? ". Bài hôm nay đã hoàn thành; app đã chọn phiên kế tiếp cho bạn."
                      : ". Bạn có thể quay lại Hôm nay để chọn bước tiếp theo."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/ielts/today">
                    <Button>
                      {saved.lessonCompleted
                        ? "Tiếp tục phiên tiếp theo →"
                        : "Về Hôm nay →"}
                    </Button>
                  </Link>
                  <Link href="/ielts/journey">
                    <Button variant="outline">Xem lại attempt</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function BandTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 text-center",
        highlight && "border-primary/50 bg-primary/5",
      )}
    >
      <div className="text-2xl font-semibold tabular-nums">
        {value.toFixed(1)}
      </div>
      <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
