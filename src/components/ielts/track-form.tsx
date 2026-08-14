"use client";

import Link from "next/link";
import { type ClipboardEvent, useState, useTransition } from "react";
import {
  type LearningSource,
  SourceRunner,
} from "@/components/ielts/source-runner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Lesson } from "@/lib/ielts/plan";
import type { ErrorType, Skill } from "@/lib/ielts/schema";
import type { ScreenshotResult } from "@/lib/ielts/vision";
import { cn } from "@/lib/utils";
import { parseScreenshotAction, saveTrackSession } from "@/server/ielts/track";

type TrackSkill = Extract<Skill, "reading" | "listening" | "vocab">;
type SuggestedCardDraft = {
  error_type: ErrorType;
  front: string;
  back: string;
  explanation: string;
};

export function TrackForm({
  configured,
  lesson,
  sources = [],
}: {
  configured: boolean;
  lesson?: Lesson;
  sources?: LearningSource[];
}) {
  const lessonSkill = lesson?.activity.skill;
  const [skill, setSkill] = useState<TrackSkill>(() =>
    lessonSkill === "listening" || lessonSkill === "reading"
      ? lessonSkill
      : "reading",
  );
  const [sourceUrl, setSourceUrl] = useState("");
  const [rawScore, setRawScore] = useState("");
  const [band, setBand] = useState("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("");
  const [readyToRecord, setReadyToRecord] = useState(sources.length === 0);
  const [cards, setCards] = useState<SuggestedCardDraft[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{
    cardsAdded: number;
    lessonCompleted: boolean;
  } | null>(null);
  const [parsing, startParse] = useTransition();
  const [saving, startSave] = useTransition();

  function onFile(file: File) {
    if (!configured) {
      setError("Cần cấu hình AI trước khi đọc screenshot.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      startParse(async () => {
        try {
          const r: ScreenshotResult = await parseScreenshotAction(dataUrl);
          if (r.raw_score) setRawScore(r.raw_score);
          if (r.band_estimate != null) setBand(String(r.band_estimate));
          setCards(r.suggested_cards);
          setSelected(new Set(r.suggested_cards.slice(0, 3).map((_, i) => i)));
          if (r.wrong_items.length)
            setNotes((n) => (n ? n : r.wrong_items.join("\n")));
        } catch (e) {
          setError(e instanceof Error ? e.message : "Đọc ảnh thất bại.");
        }
      });
    };
    reader.readAsDataURL(file);
  }

  function onPaste(event: ClipboardEvent<HTMLDivElement>) {
    const image = [...event.clipboardData.items]
      .find((item) => item.type.startsWith("image/"))
      ?.getAsFile();
    if (!image) return;
    event.preventDefault();
    onFile(image);
  }

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else if (next.size < 3) next.add(i);
      return next;
    });
  }

  function save() {
    setError(null);
    if (!rawScore.trim() && notes.trim().length < 20) {
      setError(
        "Nhập điểm/kết quả hoặc ghi ít nhất một lỗi, bẫy bạn đã gặp (20 ký tự).",
      );
      return;
    }
    if (
      band &&
      (Number.isNaN(Number(band)) || Number(band) < 0 || Number(band) > 9)
    ) {
      setError("Band phải nằm trong khoảng 0–9.");
      return;
    }
    startSave(async () => {
      try {
        const res = await saveTrackSession({
          lessonId: lesson?.id,
          skill,
          sourceUrl: sourceUrl || undefined,
          rawScore: rawScore || undefined,
          bandEstimate: band ? Number(band) : undefined,
          durationMin: duration ? Number(duration) : undefined,
          notes: notes || undefined,
          cards: cards.filter((_, i) => selected.has(i)),
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

  return (
    <div className="space-y-6" onPaste={onPaste}>
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

      {sources.length > 0 && (
        <Card className="border-primary/25 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">
              1. Chọn và làm nguồn trong app
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SourceRunner
              sources={sources}
              onPick={(source) => {
                setSourceUrl(source.url);
                setReadyToRecord(false);
              }}
              onComplete={() => setReadyToRecord(true)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">2. Ghi lại kết quả</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {readyToRecord ? (
            <>
              {lessonSkill === "reading" || lessonSkill === "listening" ? (
                <Badge variant="secondary">
                  Phiên này:{" "}
                  {lessonSkill === "reading" ? "Reading" : "Listening"}
                </Badge>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(["reading", "listening", "vocab"] as TrackSkill[]).map(
                    (s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={skill === s ? "default" : "outline"}
                        onClick={() => setSkill(s)}
                      >
                        {s === "reading"
                          ? "Reading"
                          : s === "listening"
                            ? "Listening"
                            : "Vocab"}
                      </Button>
                    ),
                  )}
                </div>
              )}
              <details>
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Dán link nguồn thủ công (nếu không dùng nguồn đề xuất)
                </summary>
                <Input
                  placeholder="https://…"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="mt-2"
                />
              </details>

              <div className="rounded-lg border border-dashed p-3">
                <p className="text-sm font-medium">
                  Tuỳ chọn: đọc screenshot kết quả bằng AI
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="text-sm file:mr-3">
                    <span className="sr-only">Chọn ảnh screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={!configured || parsing}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onFile(f);
                      }}
                      className="text-sm file:mr-3 file:rounded-md file:border file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                    />
                  </label>
                  <span className="text-sm text-muted-foreground">hoặc</span>
                  <span className="rounded-md bg-muted px-2.5 py-1.5 text-sm font-medium">
                    Dán ảnh bằng Ctrl/Cmd + V
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Bạn có thể dán ảnh ở bất kỳ đâu trong bước này; app sẽ tự đọc
                  ảnh.
                </p>
                {!configured && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Chưa cấu hình AI (LLM_* trong .env) — dùng nhập tay bên
                    dưới.
                  </p>
                )}
                {parsing && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Đang đọc ảnh…
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Điểm (nếu nguồn có, vd 32/40)"
                  value={rawScore}
                  onChange={(e) => setRawScore(e.target.value)}
                />
                <Input
                  placeholder="Phút"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  inputMode="numeric"
                  className="max-w-24"
                />
              </div>
              <details>
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Thêm band ước tính (tuỳ chọn)
                </summary>
                <Input
                  placeholder="Band (vd 7.0)"
                  value={band}
                  onChange={(e) => setBand(e.target.value)}
                  className="mt-2 max-w-32"
                />
              </details>
              <Textarea
                placeholder="Vì sao bạn sai? Ví dụ: chọn theo từ khóa, bỏ sót not given, không nhận ra paraphrase…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-20"
              />
            </>
          ) : (
            <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
              Bước này sẽ mở sau khi bạn chọn một nguồn và bấm “Tôi đã làm
              xong”.
            </div>
          )}
        </CardContent>
      </Card>

      {readyToRecord && error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {readyToRecord && cards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Lỗi đáng nhớ — chọn tối đa 3 ({selected.size}/3)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cards.map((c, i) => (
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
                  <p className="text-sm text-destructive">{c.front}</p>
                  <p className="text-sm font-medium">{c.back}</p>
                  {c.explanation && (
                    <p className="text-xs text-muted-foreground">
                      {c.explanation}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {readyToRecord && (
        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={saving || saved != null}>
            {saving
              ? "Đang lưu…"
              : saved
                ? "Đã lưu buổi"
                : `Lưu buổi + ${selected.size} lỗi`}
          </Button>
          {saved && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                Đã lưu ✓ ({saved.cardsAdded} lỗi để ôn lại)
                {saved.lessonCompleted && " · Bài hôm nay đã hoàn tất"}
              </span>
              <Link
                href="/ielts/today"
                className="text-sm font-medium text-primary hover:underline"
              >
                Về bài hôm nay →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
