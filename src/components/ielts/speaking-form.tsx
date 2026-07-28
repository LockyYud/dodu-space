"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addSpeaking } from "@/server/ielts/speaking";

type CardDraft = { front: string; back: string; explanation: string };

export function SpeakingForm() {
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
    startSave(async () => {
      try {
        await addSpeaking({
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
          placeholder="Ghi chú của gia sư (điểm mạnh/yếu, phát âm, fluency…)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-24"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Lỗi để đưa vào SRS</span>
            <Button size="xs" variant="outline" onClick={addCardRow}>
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
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              Đã lưu ✓
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
