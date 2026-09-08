"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { VOCAB_DAILY_CAP } from "@/lib/ielts/plan";
import type { VocabKind } from "@/lib/ielts/vocab";
import { cn } from "@/lib/utils";
import { addVocabCard } from "@/server/ielts/vocab";

/**
 * Bắt một cụm từ từ bài vừa đọc vào SRS.
 *
 * Bắt buộc nhập câu chứa nó: thứ cần nhớ là cách dùng, không phải nghĩa rời,
 * nên thẻ được dựng ở dạng điền vào chỗ trống trong chính câu đã gặp.
 */
export function VocabCapture({
  todayCount,
  target,
}: {
  todayCount: number;
  target: number;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [context, setContext] = useState("");
  const [kind, setKind] = useState<VocabKind>("collocation");
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(todayCount);
  const [pending, start] = useTransition();

  function save() {
    setError(null);
    setNote(null);
    start(async () => {
      try {
        const result = await addVocabCard({ term, context, kind });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setCount(result.data.todayCount);
        setNote(
          result.data.repeated
            ? "Đã gặp lại cụm này — kéo thẻ cũ về ôn hôm nay thay vì tạo thẻ mới."
            : "Đã thêm vào hàng ôn.",
        );
        setTerm("");
        setContext("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không thêm được.");
      }
    });
  }

  if (!open) {
    return (
      <Button
        size="sm"
        variant={count >= target ? "outline" : "default"}
        onClick={() => setOpen(true)}
      >
        {count >= target ? "Thêm nữa" : "Bắt từ"}
      </Button>
    );
  }

  return (
    <div className="w-full space-y-2 rounded-lg border bg-background p-3">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="cụm từ, ví dụ: a growing body of evidence"
        className="h-9 w-full rounded-md border bg-background px-2 text-sm"
        aria-label="Cụm từ"
      />
      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        rows={2}
        placeholder="câu chứa nó trong bài đọc"
        className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
        aria-label="Câu chứa cụm từ"
      />
      <div className="flex flex-wrap items-center gap-2">
        {(["collocation", "vocab"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              "rounded-md px-2 py-1 text-xs transition-colors",
              kind === k
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {k === "collocation" ? "Cụm từ đi với nhau" : "Từ đơn"}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {count}/{VOCAB_DAILY_CAP} thẻ mới hôm nay
        </span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={save}
          disabled={pending || !term || !context}
        >
          {pending ? "…" : "Thêm"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Đóng
        </Button>
      </div>
    </div>
  );
}
