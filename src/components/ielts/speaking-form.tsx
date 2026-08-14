"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Lesson } from "@/lib/ielts/plan";
import { addSpeaking } from "@/server/ielts/speaking";

type CardDraft = { front: string; back: string; explanation: string };

export function SpeakingForm({ lesson }: { lesson?: Lesson }) {
  const [duration, setDuration] = useState("");
  const [band, setBand] = useState("");
  const [notes, setNotes] = useState("");
  const [cards, setCards] = useState<CardDraft[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSave] = useTransition();

  function addCardRow() {
    setCards((c) => [...c, { front: "", back: "", explanation: "" }]);
  }
  function setCard(i: number, patch: Partial<CardDraft>) {
    setCards((c) => c.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  }
  function removeCard(i: number) {
    setCards((c) => c.filter((_, j) => j !== i));
  }

  function save() {
    setError(null);
    if (!duration || Number.isNaN(Number(duration)) || Number(duration) <= 0) {
      setError("Hãy nhập thời lượng buổi Speaking lớn hơn 0 phút.");
      return;
    }
    if (notes.trim().length < 20) {
      setError(
        "Hãy ghi ít nhất một nhận xét cụ thể của buổi Speaking (20 ký tự).",
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
        await addSpeaking({
          lessonId: lesson?.id,
          durationMin: duration ? Number(duration) : undefined,
          bandEstimate: band ? Number(band) : undefined,
          tutorNotes: notes || undefined,
          cards: cards.filter((c) => c.front && c.back),
        });
        setSaved(true);
        setDuration("");
        setBand("");
        setNotes("");
        setCards([]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lưu thất bại.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ghi buổi Speaking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lesson && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/25 bg-primary/5 px-3 py-2">
            <div>
              <p className="text-xs font-medium text-primary">Bài hôm nay</p>
              <p className="text-sm font-medium">
                Bài {lesson.index}: {lesson.activity.label}
              </p>
            </div>
            <Link
              href="/ielts/today"
              className="text-sm font-medium text-primary hover:underline"
            >
              ← Hôm nay
            </Link>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Thời lượng (phút)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            inputMode="numeric"
          />
          <Input
            placeholder="Band gia sư đánh giá (vd 6.5)"
            value={band}
            onChange={(e) => setBand(e.target.value)}
            className="max-w-56"
          />
        </div>
        <Textarea
          placeholder="Điểm mạnh/yếu, phát âm, fluency… (ít nhất 20 ký tự; mỗi lỗi một dòng nếu có)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-24"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">1–3 lỗi ưu tiên</span>
            <Button
              size="xs"
              variant="outline"
              onClick={addCardRow}
              disabled={cards.length >= 3}
            >
              + Thêm lỗi
            </Button>
          </div>
          {cards.map((c, i) => (
            <div
              key={`card-${i}-${c.front.slice(0, 6)}`}
              className="space-y-1 rounded-md border p-2"
            >
              <Input
                placeholder="Câu/điểm sai"
                value={c.front}
                onChange={(e) => setCard(i, { front: e.target.value })}
              />
              <Input
                placeholder="Sửa đúng"
                value={c.back}
                onChange={(e) => setCard(i, { back: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Giải thích (tuỳ chọn)"
                  value={c.explanation}
                  onChange={(e) => setCard(i, { explanation: e.target.value })}
                />
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => removeCard(i)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={saving}>
            {saving ? "Đang lưu…" : "Lưu buổi"}
          </Button>
          {saved && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                Đã lưu ✓
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
      </CardContent>
    </Card>
  );
}
