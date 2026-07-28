"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export function TrackForm({ configured }: { configured: boolean }) {
  const [skill, setSkill] = useState<TrackSkill>("reading");
  const [sourceUrl, setSourceUrl] = useState("");
  const [rawScore, setRawScore] = useState("");
  const [band, setBand] = useState("");
  const [notes, setNotes] = useState("");
  const [cards, setCards] = useState<SuggestedCardDraft[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ cardsAdded: number } | null>(null);
  const [parsing, startParse] = useTransition();
  const [saving, startSave] = useTransition();

  function onFile(file: File) {
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
          setSelected(new Set(r.suggested_cards.map((_, i) => i)));
          if (r.wrong_items.length)
            setNotes((n) => (n ? n : r.wrong_items.join("\n")));
        } catch (e) {
          setError(e instanceof Error ? e.message : "Đọc ảnh thất bại.");
        }
      });
    };
    reader.readAsDataURL(file);
  }

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function save() {
    setError(null);
    startSave(async () => {
      try {
        const res = await saveTrackSession({
          skill,
          sourceUrl: sourceUrl || undefined,
          rawScore: rawScore || undefined,
          bandEstimate: band ? Number(band) : undefined,
          notes: notes || undefined,
          cards: cards.filter((_, i) => selected.has(i)),
        });
        setSaved({ cardsAdded: res.cardsAdded });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu thất bại.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ghi nhận buổi làm bài</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["reading", "listening", "vocab"] as TrackSkill[]).map((s) => (
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
            ))}
          </div>
          <Input
            placeholder="Link nguồn đã làm (tuỳ chọn)"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />

          <label className="block rounded-lg border border-dashed p-3">
            <span className="text-sm font-medium">
              Screenshot kết quả (AI đọc điểm + gợi ý lỗi)
            </span>
            <input
              type="file"
              accept="image/*"
              disabled={!configured || parsing}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
              className="mt-2 block w-full text-sm file:mr-3 file:rounded-md file:border file:bg-muted file:px-3 file:py-1.5 file:text-sm"
            />
            {!configured && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Chưa cấu hình AI (LLM_* trong .env) — dùng nhập tay bên dưới.
              </p>
            )}
            {parsing && (
              <p className="mt-1 text-xs text-muted-foreground">
                Đang đọc ảnh…
              </p>
            )}
          </label>

          <div className="flex gap-2">
            <Input
              placeholder="Điểm thô (vd 32/40)"
              value={rawScore}
              onChange={(e) => setRawScore(e.target.value)}
            />
            <Input
              placeholder="Band (vd 7.0)"
              value={band}
              onChange={(e) => setBand(e.target.value)}
              className="max-w-32"
            />
          </div>
          <Textarea
            placeholder="Ghi chú / các câu sai…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-20"
          />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {cards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Lỗi gợi ý ({selected.size}/{cards.length})
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

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? "Đang lưu…" : `Lưu buổi + ${selected.size} card`}
        </Button>
        {saved && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Đã lưu ✓ ({saved.cardsAdded} card vào SRS)
          </span>
        )}
      </div>
    </div>
  );
}
