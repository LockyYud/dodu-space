"use client";

import Link from "next/link";
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
  const [bandFluencyCoherence, setBandFluencyCoherence] = useState("");
  const [bandLexicalResource, setBandLexicalResource] = useState("");
  const [bandGrammaticalAccuracy, setBandGrammaticalAccuracy] = useState("");
  const [bandPronunciation, setBandPronunciation] = useState("");
  const [transcript, setTranscript] = useState("");
  const [drillApplicable, setDrillApplicable] = useState(false);
  const [fitInTwoMinutes, setFitInTwoMinutes] = useState(false);
  const [evaluator, setEvaluator] = useState("self");
  const [notes, setNotes] = useState("");
  const [feedbackFluency, setFeedbackFluency] = useState("");
  const [feedbackLexical, setFeedbackLexical] = useState("");
  const [feedbackGrammar, setFeedbackGrammar] = useState("");
  const [feedbackPronunciation, setFeedbackPronunciation] = useState("");
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
    if (!transcript.trim()) {
      setError("Hãy nhập transcript của buổi Speaking trước khi lưu.");
      return;
    }
    if (notes.trim().length < 20) {
      setError(
        "Hãy ghi ít nhất một nhận xét cụ thể của buổi Speaking (20 ký tự).",
      );
      return;
    }
    const criteria = [
      band,
      bandFluencyCoherence,
      bandLexicalResource,
      bandGrammaticalAccuracy,
      bandPronunciation,
    ];
    if (criteria.some((value) => !value.trim())) {
      setError("Hãy nhập Overall và đủ band của 4 tiêu chí Speaking.");
      return;
    }
    if (
      criteria.some(
        (value) =>
          value &&
          (Number.isNaN(Number(value)) ||
            Number(value) < 0 ||
            Number(value) > 9),
      )
    ) {
      setError("Band phải nằm trong khoảng 0–9.");
      return;
    }
    startSave(async () => {
      try {
        await addSpeaking({
          durationMin: duration ? Number(duration) : undefined,
          bandEstimate: band ? Number(band) : undefined,
          bandOverall: band ? Number(band) : undefined,
          bandFluencyCoherence: bandFluencyCoherence
            ? Number(bandFluencyCoherence)
            : undefined,
          bandLexicalResource: bandLexicalResource
            ? Number(bandLexicalResource)
            : undefined,
          bandGrammaticalAccuracy: bandGrammaticalAccuracy
            ? Number(bandGrammaticalAccuracy)
            : undefined,
          bandPronunciation: bandPronunciation
            ? Number(bandPronunciation)
            : undefined,
          transcript,
          fitInTwoMinutes: drillApplicable ? fitInTwoMinutes : undefined,
          evaluator: evaluator || undefined,
          tutorNotes: notes || undefined,
          feedback: {
            summary: notes,
            fluency_coherence: feedbackFluency,
            lexical_resource: feedbackLexical,
            grammatical_accuracy: feedbackGrammar,
            pronunciation: feedbackPronunciation,
          },
          cards: cards.filter((c) => c.front && c.back),
        });
        setSaved(true);
        setDuration("");
        setBand("");
        setBandFluencyCoherence("");
        setBandLexicalResource("");
        setBandGrammaticalAccuracy("");
        setBandPronunciation("");
        setTranscript("");
        setDrillApplicable(false);
        setFitInTwoMinutes(false);
        setEvaluator("self");
        setNotes("");
        setFeedbackFluency("");
        setFeedbackLexical("");
        setFeedbackGrammar("");
        setFeedbackPronunciation("");
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
            placeholder="Overall band (bắt buộc, vd 6.5)"
            value={band}
            onChange={(e) => setBand(e.target.value)}
            className="max-w-56"
          />
        </div>
        <Textarea
          placeholder="Transcript của câu trả lời (bắt buộc)"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="min-h-28"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={drillApplicable}
            onChange={(e) => setDrillApplicable(e.target.checked)}
          />
          Đây là bài 4/3/2
        </label>
        {drillApplicable && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={fitInTwoMinutes}
              onChange={(e) => setFitInTwoMinutes(e.target.checked)}
            />
            Lượt ba gọn trong 2 phút
          </label>
        )}
        <Input
          placeholder="Người đánh giá (mặc định: tự đánh giá)"
          value={evaluator}
          onChange={(e) => setEvaluator(e.target.value)}
        />
        <Textarea
          placeholder="Điểm mạnh/yếu, phát âm, fluency… (ít nhất 20 ký tự; mỗi lỗi một dòng nếu có)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-24"
        />

        <details className="rounded-md border p-3">
          <summary className="cursor-pointer text-sm font-medium">
            Feedback theo 4 tiêu chí (tuỳ chọn)
          </summary>
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Fluency & Coherence"
              value={feedbackFluency}
              onChange={(e) => setFeedbackFluency(e.target.value)}
            />
            <Textarea
              placeholder="Lexical Resource"
              value={feedbackLexical}
              onChange={(e) => setFeedbackLexical(e.target.value)}
            />
            <Textarea
              placeholder="Grammatical Range & Accuracy"
              value={feedbackGrammar}
              onChange={(e) => setFeedbackGrammar(e.target.value)}
            />
            <Textarea
              placeholder="Pronunciation"
              value={feedbackPronunciation}
              onChange={(e) => setFeedbackPronunciation(e.target.value)}
            />
          </div>
        </details>

        <details className="rounded-md border p-3">
          <summary className="cursor-pointer text-sm font-medium">
            Band theo 4 tiêu chí (bắt buộc)
          </summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Fluency & Coherence"
              value={bandFluencyCoherence}
              onChange={(e) => setBandFluencyCoherence(e.target.value)}
              inputMode="decimal"
            />
            <Input
              placeholder="Lexical Resource"
              value={bandLexicalResource}
              onChange={(e) => setBandLexicalResource(e.target.value)}
              inputMode="decimal"
            />
            <Input
              placeholder="Grammatical Range & Accuracy"
              value={bandGrammaticalAccuracy}
              onChange={(e) => setBandGrammaticalAccuracy(e.target.value)}
              inputMode="decimal"
            />
            <Input
              placeholder="Pronunciation"
              value={bandPronunciation}
              onChange={(e) => setBandPronunciation(e.target.value)}
              inputMode="decimal"
            />
          </div>
        </details>

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
