"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GradingResult, TaskType } from "@/lib/ielts/grading";
import { cn } from "@/lib/utils";
import { gradeAction, saveSubmission } from "@/server/ielts/writing";

type CriterionKey = "task_response" | "coherence" | "lexical" | "grammar";
const CRITERIA: { key: CriterionKey; label: string }[] = [
  { key: "task_response", label: "Task Response" },
  { key: "coherence", label: "Coherence & Cohesion" },
  { key: "lexical", label: "Lexical Resource" },
  { key: "grammar", label: "Grammar" },
];

export function WritingWorkbench({ configured }: { configured: boolean }) {
  const [taskType, setTaskType] = useState<TaskType>("task2");
  const [topic, setTopic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<GradingResult | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<{ cardsAdded: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [grading, startGrading] = useTransition();
  const [saving, startSaving] = useTransition();

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;

  function handleGrade() {
    setError(null);
    setSaved(null);
    startGrading(async () => {
      try {
        const r = await gradeAction({ taskType, prompt, essay });
        setResult(r);
        setSelected(new Set(r.error_cards.map((_, i) => i)));
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
          taskType,
          topic: topic || undefined,
          prompt: prompt || undefined,
          essay,
          result,
          selectedCards: cards,
        });
        setSaved({ cardsAdded: res.cardsAdded });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu thất bại.");
      }
    });
  }

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="space-y-6">
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
            {(["task2", "task1"] as TaskType[]).map((t) => (
              <Button
                key={t}
                type="button"
                size="sm"
                variant={taskType === t ? "default" : "outline"}
                onClick={() => setTaskType(t)}
              >
                {t === "task2" ? "Task 2 (Essay)" : "Task 1 (Report)"}
              </Button>
            ))}
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
            placeholder="Dán bài viết của bạn vào đây…"
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            className="min-h-64"
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleGrade}
              disabled={!configured || grading || essay.trim().length < 40}
            >
              {grading ? "Đang chấm…" : "Chấm bài"}
            </Button>
            {essay.trim().length > 0 && essay.trim().length < 40 && (
              <span className="text-xs text-muted-foreground">
                Cần ít nhất ~40 ký tự.
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Lỗi trích xuất — chọn để đưa vào kho ôn tập ({selected.size}/
                {result.error_cards.length})
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
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu…" : `Lưu bài + ${selected.size} card`}
                </Button>
                {saved && (
                  <span className="text-sm text-emerald-600 dark:text-emerald-400">
                    Đã lưu ✓ ({saved.cardsAdded} card vào SRS)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
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
