"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  type GradingMode,
  type GradingResult,
  isBandResult,
  type SuggestedCard,
} from "@/lib/ielts/grading";
import type { WritingPrompt } from "@/lib/ielts/prompts";
import { cn } from "@/lib/utils";
import {
  gradeAction,
  type RewriteSource,
  saveSubmission,
} from "@/server/ielts/writing";

type CriterionKey = "task_response" | "coherence" | "lexical" | "grammar";
const CRITERIA: { key: CriterionKey; label: string }[] = [
  { key: "task_response", label: "Task Response" },
  { key: "coherence", label: "Coherence & Cohesion" },
  { key: "lexical", label: "Lexical Resource" },
  { key: "grammar", label: "Grammar" },
];

const MAX_KEPT_CARDS = 3;

export function WritingWorkbench({
  configured,
  phaseLabel,
  mode,
  prompt,
  rewriteSource = null,
}: {
  configured: boolean;
  phaseLabel: string;
  mode: GradingMode;
  prompt: WritingPrompt | null;
  rewriteSource?: RewriteSource | null;
}) {
  const taskType = rewriteSource?.taskType ?? guessTask(prompt);
  const wordTarget = prompt?.words ?? (taskType === "task1" ? 150 : 250);
  const writeMinutes = minutesFor(taskType, wordTarget);

  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [repairNote, setRepairNote] = useState("");
  const [saved, setSaved] = useState<{
    cardsAdded: number;
    rulesFixed: string[];
    rulesRemaining: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [grading, startGrading] = useTransition();
  const [saving, startSaving] = useTransition();

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const minWords = Math.round(wordTarget * 0.8);
  const timeLimit = writeMinutes * 60;

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => window.clearInterval(timer);
  }, [started]);

  function handleGrade() {
    if (wordCount < minWords) {
      setError(`Bài này cần ít nhất ${minWords} từ trước khi gửi.`);
      return;
    }
    setError(null);
    setSaved(null);
    startGrading(async () => {
      try {
        const r = await gradeAction({
          taskType,
          promptId: prompt?.id || undefined,
          prompt: prompt?.text,
          essay,
          writeMinutes,
        });
        if (!r.ok) {
          setError(r.error);
          return;
        }
        setResult(r.data);
        setSelected(
          new Set(r.data.cards.slice(0, MAX_KEPT_CARDS).map((_, i) => i)),
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gửi bài thất bại.");
      }
    });
  }

  function handleSave() {
    if (!result) return;
    setError(null);
    startSaving(async () => {
      try {
        const res = await saveSubmission({
          parentSubmissionId: rewriteSource?.id,
          taskType,
          promptId: prompt?.id || undefined,
          topic: prompt?.topic,
          prompt: prompt?.text,
          essay,
          result,
          selectedCards: result.cards.filter((_, i) => selected.has(i)),
          repairNote,
        });
        setSaved(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu thất bại.");
      }
    });
  }

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else if (next.size < MAX_KEPT_CARDS) next.add(i);
      return next;
    });
  }

  const densityDelta =
    result && rewriteSource?.errorDensity != null
      ? Math.round((result.density - rewriteSource.errorDensity) * 10) / 10
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
        <div>
          <p className="text-xs font-medium text-primary">{phaseLabel}</p>
          <p className="text-sm font-medium">
            {mode === "coach"
              ? "Chế độ coach — chỉ lỗi ngôn ngữ, chưa chấm band"
              : "Chế độ chấm band"}
          </p>
        </div>
        <Link
          href="/ielts/today"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Quay lại Hôm nay
        </Link>
      </div>

      {!configured && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          Chưa cấu hình AI. Đặt <code>LLM_BASE_URL</code>,{" "}
          <code>LLM_API_KEY</code>, <code>LLM_MODEL</code> trong{" "}
          <code>.env</code>.
        </div>
      )}

      {rewriteSource && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base">
              Bản gốc
              {rewriteSource.errorDensity != null
                ? ` · ${rewriteSource.errorDensity} lỗi / 100 từ`
                : ""}
              {rewriteSource.bands
                ? ` · band ${rewriteSource.bands.overall.toFixed(1)}`
                : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rewriteSource.feedback?.next_steps?.length ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {rewriteSource.feedback.next_steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : null}
            <details className="rounded-md border p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Xem lại bài đã viết
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {rewriteSource.essayText}
              </p>
            </details>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEssay(rewriteSource.essayText)}
              disabled={essay.trim().length > 0}
            >
              Chép bản gốc xuống để sửa
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">Đề bài</CardTitle>
            {prompt?.topic && <Badge variant="secondary">{prompt.topic}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {prompt ? (
            <p className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm">
              {prompt.text}
            </p>
          ) : (
            <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              Không lấy được đề bài. Quay lại Hôm nay và mở lại phiên viết.
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Mục tiêu khoảng {wordTarget} từ trong {writeMinutes} phút.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">Bài viết</CardTitle>
            <span className="text-xs text-muted-foreground">
              {wordCount} từ
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Viết vào đây…"
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
                : `Thời gian viết: ${formatTime(timeLimit)}`}
            </span>
            <Button
              onClick={handleGrade}
              disabled={!configured || grading || wordCount < minWords}
            >
              {grading
                ? "Đang đọc bài…"
                : mode === "coach"
                  ? "Nhận góp ý"
                  : "Chấm bài"}
            </Button>
            {essay.trim().length > 0 && wordCount < minWords && (
              <span className="text-xs text-muted-foreground">
                Còn {minWords - wordCount} từ nữa.
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

      {result && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {result.mode === "coach" ? "Góp ý" : "Kết quả chấm"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Stat
                  label="Lỗi / 100 từ"
                  value={result.density.toFixed(1)}
                  delta={densityDelta}
                  lowerIsBetter
                />
                <Stat label="Tổng lỗi" value={String(result.error_count)} />
                <Stat label="Số từ" value={String(result.word_count)} />
              </div>

              {isBandResult(result) ? (
                <>
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
                  {result.spread > 0.5 && (
                    <p className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs">
                      Các lần chấm lệch nhau {result.spread.toFixed(1)} band.
                      Hãy coi điểm này là ước lượng mềm, đừng bám vào con số.
                    </p>
                  )}
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
                  {result.feedback.next_steps.length > 0 && (
                    <div className="rounded-md bg-muted/50 p-3 text-sm">
                      <p className="mb-1 font-medium">Việc kế tiếp:</p>
                      <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                        {result.feedback.next_steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3">
                    <p className="mb-1 font-medium">Làm tốt</p>
                    <p className="text-muted-foreground">{result.strength}</p>
                  </div>
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="mb-1 font-medium">Việc sửa tiếp theo</p>
                    <p className="text-muted-foreground">{result.next_fix}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {!rewriteSource && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sửa ngay · 5 phút</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Viết lại một câu yếu nhất, hoặc nêu chính xác thay đổi bạn sẽ
                  áp dụng ở bản viết lại.
                </p>
                <Textarea
                  value={repairNote}
                  onChange={(e) => setRepairNote(e.target.value)}
                  placeholder="Ví dụ: tôi hay quên -s số nhiều. Bản sau tôi soát riêng danh từ trước khi nộp."
                  className="min-h-24"
                />
                <p className="text-xs text-muted-foreground">
                  {repairNote.trim().length < 20
                    ? `Còn ${20 - repairNote.trim().length} ký tự.`
                    : "Đã sẵn sàng lưu."}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Lỗi để ôn — chọn tối đa {MAX_KEPT_CARDS} ({selected.size}/
                {MAX_KEPT_CARDS})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.cards.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Không tìm thấy lỗi đáng lưu. Tốt.
                </p>
              )}
              {result.cards.map((card, i) => (
                <CardRow
                  key={`${card.rule}-${card.front}`}
                  card={card}
                  selected={selected.has(i)}
                  onToggle={() => toggle(i)}
                />
              ))}
              <div className="pt-1">
                <Button
                  onClick={handleSave}
                  disabled={
                    saving ||
                    saved != null ||
                    (!rewriteSource && repairNote.trim().length < 20)
                  }
                >
                  {saving
                    ? "Đang lưu…"
                    : saved
                      ? "Đã lưu"
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
                    Đã lưu
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {saved.cardsAdded} lỗi vào lịch ôn.
                    {saved.rulesFixed.length > 0 &&
                      ` Đã sửa được ${saved.rulesFixed.length} lỗi so với bản gốc.`}
                    {saved.rulesRemaining.length > 0 &&
                      ` Còn ${saved.rulesRemaining.length} lỗi lặp lại.`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/ielts/today">
                    <Button>Về Hôm nay →</Button>
                  </Link>
                  {!rewriteSource && (
                    <Link href="/ielts/writing?rewrite=1">
                      <Button variant="outline">Viết lại bài này</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function CardRow({
  card,
  selected,
  onToggle,
}: {
  card: SuggestedCard;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
        selected ? "border-primary/50 bg-primary/5" : "hover:bg-muted/40",
      )}
    >
      <input type="checkbox" checked={selected} readOnly className="mt-1" />
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px]">
            {card.rule}
          </Badge>
          {card.occurrences > 1 && (
            <Badge variant="outline" className="text-[10px]">
              lặp {card.occurrences} lần
            </Badge>
          )}
        </div>
        <p className="text-sm text-destructive line-through">{card.front}</p>
        <p className="text-sm font-medium">{card.back}</p>
        {card.explanation && (
          <p className="whitespace-pre-wrap text-xs text-muted-foreground">
            {card.explanation}
          </p>
        )}
      </div>
    </button>
  );
}

function Stat({
  label,
  value,
  delta,
  lowerIsBetter,
}: {
  label: string;
  value: string;
  delta?: number | null;
  lowerIsBetter?: boolean;
}) {
  const good = delta == null ? false : lowerIsBetter ? delta < 0 : delta > 0;
  return (
    <div className="rounded-lg border px-4 py-2">
      <div className="text-xl font-semibold tabular-nums">
        {value}
        {delta != null && delta !== 0 && (
          <span
            className={cn(
              "ml-2 text-xs font-medium",
              good
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive",
            )}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        )}
      </div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
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

function guessTask(prompt: WritingPrompt | null): "task1" | "task2" {
  return prompt?.kind === "task1" ? "task1" : "task2";
}

/** Writing time budget: exam pace for full tasks, gentler for short pieces. */
function minutesFor(taskType: "task1" | "task2", words: number): number {
  if (words <= 150) return taskType === "task1" ? 20 : 15;
  return taskType === "task1" ? 20 : 40;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
