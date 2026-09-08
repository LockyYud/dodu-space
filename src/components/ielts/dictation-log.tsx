"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { logDictation } from "@/server/ielts/dictation";

/**
 * Ghi một buổi chép chính tả: số từ, số chỗ sai, và tuỳ chọn liệt kê chỗ nghe
 * sai để đẩy vào SRS. Mật độ lỗi dùng chung thước đo với Writing.
 */
export function DictationLog({ done }: { done: boolean }) {
  const [open, setOpen] = useState(false);
  const [words, setWords] = useState("");
  const [errors, setErrors] = useState("");
  const [misses, setMisses] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function save() {
    setError(null);
    setNote(null);
    start(async () => {
      try {
        const result = await logDictation({
          wordCount: Number(words),
          errorCount: Number(errors),
          misses,
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setNote(
          `${result.data.density} lỗi / 100 từ` +
            (result.data.cardsCreated > 0
              ? ` · thêm ${result.data.cardsCreated} thẻ`
              : ""),
        );
        setWords("");
        setErrors("");
        setMisses("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không ghi được.");
      }
    });
  }

  if (!open) {
    return (
      <Button
        size="sm"
        variant={done ? "outline" : "default"}
        onClick={() => setOpen(true)}
      >
        {done ? "Ghi thêm" : "Nhập kết quả"}
      </Button>
    );
  }

  return (
    <div className="w-full space-y-2 rounded-lg border bg-background p-3">
      <div className="flex flex-wrap gap-2">
        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          Số từ
          <input
            type="number"
            min={1}
            value={words}
            onChange={(e) => setWords(e.target.value)}
            className="h-9 w-20 rounded-md border bg-background px-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          Chỗ sai
          <input
            type="number"
            min={0}
            value={errors}
            onChange={(e) => setErrors(e.target.value)}
            className="h-9 w-20 rounded-md border bg-background px-2 text-sm"
          />
        </label>
      </div>
      <textarea
        value={misses}
        onChange={(e) => setMisses(e.target.value)}
        rows={3}
        placeholder={"mỗi dòng một chỗ nghe sai\nnghe thành → đúng là"}
        className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
        aria-label="Chỗ nghe sai"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={pending || !words}>
          {pending ? "…" : "Lưu"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Đóng
        </Button>
      </div>
    </div>
  );
}
