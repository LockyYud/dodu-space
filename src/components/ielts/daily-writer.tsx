"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { SpinWheel } from "@/components/ielts/spin-wheel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type {
  DailyCoachResult,
  RewriteComparison,
} from "@/lib/ielts/daily-coach";
import {
  CLUSTERS,
  type Cluster,
  type ClusterId,
  type DailyPrompt,
} from "@/lib/ielts/daily-prompts";
import type { SuggestedCard } from "@/lib/ielts/grading";
import { cn } from "@/lib/utils";
import {
  type DailyView,
  freeSpin,
  gradeDaily,
  saveDaily,
  skipToday,
  spinToday,
  type TodaySpin,
} from "@/server/ielts/daily";

const MAX_KEPT_CARDS = 3;
/** Đồng hồ chạy để biết, không khoá gì cả — đây là trang thói quen. */
const SOFT_MINUTES = 10;

export function DailyWriter({ view }: { view: DailyView }) {
  const [spin, setSpin] = useState<TodaySpin | null>(view.spin);
  const [free, setFree] = useState<{
    prompt: DailyPrompt;
    cluster: Cluster;
  } | null>(null);
  const [revealed, setRevealed] = useState(view.spin != null);

  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<DailyCoachResult | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<{
    cardsAdded: number;
    comparison: RewriteComparison | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);

  const [spinning, startSpin] = useTransition();
  const [grading, startGrading] = useTransition();
  const [saving, startSaving] = useTransition();

  const prompt = free?.prompt ?? spin?.prompt ?? null;
  const cluster = free?.cluster ?? spin?.cluster ?? null;
  const isFree = free != null;
  const done = !isFree && spin?.status === "written";
  const skipped = spin?.status === "skipped";

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const floor = prompt ? Math.round(prompt.words * 0.5) : 0;

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => window.clearInterval(timer);
  }, [started]);

  function handleSpin() {
    setError(null);
    startSpin(async () => {
      const r = await spinToday();
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setSpin(r.data);
    });
  }

  function handleSkip() {
    setError(null);
    startSpin(async () => {
      const r = await skipToday();
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setSpin((prev) => (prev ? { ...prev, status: "skipped" } : prev));
    });
  }

  function handleFreeSpin() {
    setError(null);
    startSpin(async () => {
      const r = await freeSpin();
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setFree(r.data);
      setRevealed(false);
      setEssay("");
      setResult(null);
      setSaved(null);
      setSelected(new Set());
      setElapsed(0);
      setStarted(false);
    });
  }

  function handleGrade() {
    if (!prompt) return;
    setError(null);
    startGrading(async () => {
      const r = await gradeDaily({ promptId: prompt.id, essay });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setResult(r.data);
      setSelected(
        new Set(r.data.cards.slice(0, MAX_KEPT_CARDS).map((_, i) => i)),
      );
    });
  }

  function handleSave() {
    if (!prompt || !result) return;
    setError(null);
    startSaving(async () => {
      const r = await saveDaily({
        promptId: prompt.id,
        essay,
        result,
        selectedCards: result.cards.filter((_, i) => selected.has(i)),
        free: isFree,
      });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setSaved({
        cardsAdded: r.data.cardsAdded,
        comparison: r.data.comparison,
      });
      if (!isFree) {
        setSpin((prev) => (prev ? { ...prev, status: "written" } : prev));
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

  const activeIds: ClusterId[] = view.cycle.clusters.map((c) => c.id);
  const showWheel = !prompt || (isFree && !revealed);

  return (
    <div className="space-y-6">
      <StreakStrip view={view} />

      {!view.configured && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          Chưa cấu hình AI. Đặt <code>LLM_BASE_URL</code>,{" "}
          <code>LLM_API_KEY</code>, <code>LLM_MODEL</code> trong{" "}
          <code>.env</code>.
        </div>
      )}

      {showWheel && (
        <Card>
          <CardContent className="space-y-4 py-6">
            <SpinWheel
              clusters={CLUSTERS}
              activeIds={activeIds}
              target={cluster?.id ?? null}
              onRest={() => window.setTimeout(() => setRevealed(true), 200)}
            />
            <div className="flex flex-wrap justify-center gap-1.5">
              {view.cycle.clusters.map((c) => (
                <Badge key={c.id} variant="secondary">
                  {c.emoji} {c.label}
                </Badge>
              ))}
            </div>
            <div className="text-center">
              <Button
                size="lg"
                onClick={isFree ? handleFreeSpin : handleSpin}
                disabled={spinning || (!isFree && view.spent)}
              >
                {spinning ? "Đang quay…" : "Quay"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                {view.spent && !isFree
                  ? "Hôm nay đã dùng lượt quay."
                  : "Một lượt mỗi ngày. Quay xong là đề của hôm nay."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {skipped && !isFree && (
        <Card className="border-muted-foreground/30">
          <CardContent className="py-5 text-sm text-muted-foreground">
            Hôm nay đã bỏ qua đề. Không có đề thay thế — mai quay lại. Câu bị bỏ
            qua sẽ quay về pool.
          </CardContent>
        </Card>
      )}

      {prompt && cluster && revealed && !skipped && (
        <Card className={cn(isFree && "border-dashed")}>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <span>{cluster.emoji}</span>
                <span>{cluster.label}</span>
                {isFree && <Badge variant="outline">quay tự do</Badge>}
                {!isFree && spin?.half === "rewrite" && (
                  <Badge variant="secondary">viết lại</Badge>
                )}
              </CardTitle>
              {!isFree && !done && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  disabled={spinning || result != null}
                >
                  Bỏ qua đề
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg leading-snug font-medium">{prompt.text}</p>
            <p className="text-sm text-muted-foreground">
              Gợi ý: {prompt.hint}
            </p>
            {!isFree && spin?.half === "rewrite" && (
              <p className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                Câu này bạn đã viết ở nửa đầu chu kỳ. Bản cũ được giấu tới khi
                chấm xong — xem trước thì thành chép lại.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {prompt && revealed && !skipped && !done && !saved && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">Bài viết</CardTitle>
              <span className="text-xs text-muted-foreground">
                {wordCount} từ · mục tiêu ~{prompt.words}
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
              className="min-h-56"
            />
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {started
                  ? formatTime(elapsed)
                  : `Khoảng ${SOFT_MINUTES} phút là đủ`}
              </span>
              <Button
                onClick={handleGrade}
                disabled={!view.configured || grading || wordCount < floor}
              >
                {grading ? "Đang đọc bài…" : "Chấm"}
              </Button>
              {wordCount > 0 && wordCount < floor && (
                <span className="text-xs text-muted-foreground">
                  Còn {floor - wordCount} từ nữa.
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bản sửa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-wrap rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3 text-sm leading-relaxed">
                {result.rewrite}
              </p>
              <details className="rounded-md border p-3">
                <summary className="cursor-pointer text-sm font-medium">
                  Bài bạn viết
                </summary>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {essay}
                </p>
              </details>
              <div className="flex flex-wrap gap-3">
                <Stat label="Lỗi / 100 từ" value={result.density.toFixed(1)} />
                <Stat label="Tổng lỗi" value={String(result.error_count)} />
                <Stat label="Số từ" value={String(result.word_count)} />
              </div>
            </CardContent>
          </Card>

          {(result.strength || result.cards.length > 0) && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm">
                <p className="mb-1 font-medium">Làm được</p>
                <p className="text-muted-foreground">
                  {result.strength || "—"}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                <p className="mb-1 font-medium">Sửa tiếp</p>
                <p className="text-muted-foreground">
                  {result.cards[0]
                    ? `${result.cards[0].front} → ${result.cards[0].back}`
                    : "Không tìm thấy lỗi đáng sửa. Tốt."}
                </p>
              </div>
            </div>
          )}

          {result.phrases.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Nói tự nhiên hơn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.phrases.map((p) => (
                  <div key={p.say} className="rounded-md border p-3 text-sm">
                    <p className="text-muted-foreground line-through">
                      {p.instead_of}
                    </p>
                    <p className="font-medium">{p.say}</p>
                    {p.note && (
                      <p className="text-xs text-muted-foreground">{p.note}</p>
                    )}
                  </div>
                ))}
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
                  Không tìm thấy lỗi đáng lưu.
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
                <Button onClick={handleSave} disabled={saving || saved != null}>
                  {saving
                    ? "Đang lưu…"
                    : saved
                      ? "Đã lưu"
                      : `Lưu bài + ${selected.size} lỗi`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {saved?.comparison && <Comparison data={saved.comparison} />}

      {saved && (
        <Card className="border-emerald-500/40 bg-emerald-500/5">
          <CardContent className="space-y-3 py-5">
            <p className="font-medium text-emerald-700 dark:text-emerald-400">
              Đã lưu — {saved.cardsAdded} lỗi vào lịch ôn
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleFreeSpin}
                disabled={spinning}
              >
                Quay tự do thêm một bài
              </Button>
              <Link href="/ielts/today">
                <Button variant="ghost">Về Hôm nay →</Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Bài quay tự do vẫn được chấm và lưu lỗi, nhưng không tính vào
              chuỗi ngày.
            </p>
          </CardContent>
        </Card>
      )}

      {done && !result && !saved && (
        <Card className="border-emerald-500/40 bg-emerald-500/5">
          <CardContent className="space-y-3 py-5 text-sm">
            <p className="font-medium">Hôm nay viết xong rồi.</p>
            <Button
              variant="outline"
              onClick={handleFreeSpin}
              disabled={spinning}
            >
              Quay tự do thêm một bài
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StreakStrip({ view }: { view: DailyView }) {
  const { cycle } = view;
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">🔥 {view.streak} ngày liên tiếp</p>
        <p className="text-xs text-muted-foreground">
          Chu kỳ {cycle.id} · bài {Math.min(cycle.written + 1, cycle.length)}/
          {cycle.length} ·{" "}
          {cycle.half === "fresh" ? "câu mới" : "tuần viết lại"}
        </p>
      </div>
      <div className="flex flex-wrap gap-1">
        {/* Chỉ ngày có bài mới bấm được: cho ô rỗng dẫn tới một trang 404 thì
            cái lịch trông như đang hỏng. */}
        {view.heat.map((day) =>
          day.done ? (
            <Link
              key={day.date}
              href={`/ielts/daily/${day.date}`}
              title={day.date}
              className="h-3.5 w-3.5 rounded-[3px] bg-primary transition-colors hover:bg-primary/80"
            />
          ) : (
            <span
              key={day.date}
              title={day.date}
              className="h-3.5 w-3.5 rounded-[3px] bg-muted"
            />
          ),
        )}
      </div>
    </div>
  );
}

function Comparison({ data }: { data: RewriteComparison }) {
  const before = data.previousDensity;
  const delta =
    before == null ? null : Math.round((data.density - before) * 10) / 10;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">So với lần đầu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">
              Lần 1 · {data.previousDate}
            </p>
            <p className="font-medium">
              {before != null ? `${before.toFixed(1)} lỗi / 100 từ` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.previousWordCount ?? "—"} từ
            </p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="text-xs text-muted-foreground">Lần 2 · hôm nay</p>
            <p className="font-medium">
              {data.density.toFixed(1)} lỗi / 100 từ
              {delta != null && (
                <span
                  className={cn(
                    "ml-2 text-xs",
                    delta < 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : delta > 0
                        ? "text-destructive"
                        : "text-muted-foreground",
                  )}
                >
                  {delta < 0 ? "▼" : delta > 0 ? "▲" : "="}{" "}
                  {Math.abs(delta).toFixed(1)}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{data.wordCount} từ</p>
          </div>
        </div>

        <div className="space-y-1">
          <p>
            <span className="font-medium">Lỗi đã hết: </span>
            <span className="text-muted-foreground">
              {data.rulesFixed.length ? data.rulesFixed.join(", ") : "—"}
            </span>
          </p>
          <p>
            <span className="font-medium">Vẫn còn: </span>
            <span className="text-muted-foreground">
              {data.rulesRemaining.length
                ? data.rulesRemaining.join(", ")
                : "không còn lỗi nào lặp lại"}
            </span>
          </p>
        </div>

        <details className="rounded-md border bg-background p-3">
          <summary className="cursor-pointer font-medium">Bài lần đầu</summary>
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
            {data.previousEssay}
          </p>
        </details>
      </CardContent>
    </Card>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
