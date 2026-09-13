"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ExternalBenchmark } from "@/lib/ielts/schema";
import { addExternalBenchmark } from "@/server/ielts/benchmarks";

const PROVIDERS = [
  ["ef_set", "EF SET"],
  ["toeic", "TOEIC"],
  ["ielts", "IELTS"],
  ["other", "Khác"],
] as const;

export function ExternalBenchmarkForm({
  benchmarks,
}: {
  benchmarks: ExternalBenchmark[];
}) {
  const [provider, setProvider] =
    useState<(typeof PROVIDERS)[number][0]>("ef_set");
  const [date, setDate] = useState("");
  const [scores, setScores] = useState({
    reading: "",
    listening: "",
    writing: "",
    speaking: "",
    overall: "",
  });
  const [cefr, setCefr] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [sectionScores, setSectionScores] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const parse = (value: string) => (value.trim() ? Number(value) : null);

  function save() {
    setMessage(null);
    let parsedSections: Record<string, number> | null = null;
    if (sectionScores.trim()) {
      try {
        const parsed = JSON.parse(sectionScores) as unknown;
        if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
          throw new Error();
        }
        parsedSections = Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>).map(
            ([key, value]) => [key, Number(value)],
          ),
        );
      } catch {
        setMessage('Điểm theo phần phải là JSON, ví dụ {"LR":720,"SW":280}.');
        return;
      }
    }
    startTransition(async () => {
      const result = await addExternalBenchmark({
        provider,
        date,
        readingRaw: parse(scores.reading),
        listeningRaw: parse(scores.listening),
        writingRaw: parse(scores.writing),
        speakingRaw: parse(scores.speaking),
        overallRaw: parse(scores.overall),
        sectionScores: parsedSections,
        cefr,
        sourceUrl,
        notes,
      });
      if (!result.ok) return setMessage(result.error);
      setMessage("Đã lưu benchmark gốc; app không quy đổi sang IELTS band.");
      setScores({
        reading: "",
        listening: "",
        writing: "",
        speaking: "",
        overall: "",
      });
      setCefr("");
      setSourceUrl("");
      setNotes("");
      setSectionScores("");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Benchmark ngoài</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Lưu điểm đúng theo thang của EF SET, TOEIC hoặc IELTS. Không tự quy
          đổi giữa các bài thi.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as typeof provider)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            {PROVIDERS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-5">
          {(
            ["reading", "listening", "writing", "speaking", "overall"] as const
          ).map((skill) => (
            <Input
              key={skill}
              inputMode="decimal"
              placeholder={
                skill === "overall"
                  ? "Overall"
                  : skill[0].toUpperCase() + skill.slice(1)
              }
              value={scores[skill]}
              onChange={(e) =>
                setScores((current) => ({
                  ...current,
                  [skill]: e.target.value,
                }))
              }
            />
          ))}
        </div>
        <Input
          placeholder="CEFR (vd B2/C1, nếu có)"
          value={cefr}
          onChange={(e) => setCefr(e.target.value)}
        />
        <Textarea
          placeholder={'Điểm theo phần gốc (JSON, vd {"LR":720,"SW":280})'}
          value={sectionScores}
          onChange={(e) => setSectionScores(e.target.value)}
          rows={2}
        />
        <Input
          placeholder="Link kết quả (nếu có)"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
        <Textarea
          placeholder="Ghi chú"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button onClick={save} disabled={pending}>
          {pending ? "Đang lưu…" : "Lưu benchmark"}
        </Button>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        {benchmarks.length > 0 && (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {benchmarks.slice(0, 5).map((item) => (
              <li key={item.id}>
                {item.date} · {item.provider.toUpperCase()} · Overall{" "}
                {item.overallRaw ?? "—"}
                {item.cefr ? ` · ${item.cefr}` : ""}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
