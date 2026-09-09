"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { VOCAB_DAILY_CAP } from "@/lib/ielts/plan";
import {
  backOf,
  type EnrichedTerm,
  MAX_TERMS_PER_LOOKUP,
} from "@/lib/ielts/vocab-enrich";
import { cn } from "@/lib/utils";
import { addVocabCards, lookupVocab } from "@/server/ielts/vocab";

/**
 * Bắt từ mới: người học chỉ đưa **cụm từ**, app dựng phần còn lại.
 *
 * Bản đầu bắt tự chọn cụm, tự tìm câu, dán cả hai, chọn loại — tức bắt người
 * học làm việc của app. Nay dán một danh sách là xong; ô đoạn văn là tuỳ chọn
 * và chỉ để câu ví dụ lấy được từ chính bài vừa đọc thay vì do máy sinh.
 */
export function VocabCapture({
  todayCount,
  target,
}: {
  todayCount: number;
  target: number;
}) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [passage, setPassage] = useState("");
  const [showPassage, setShowPassage] = useState(false);
  const [found, setFound] = useState<EnrichedTerm[] | null>(null);
  const [keep, setKeep] = useState<Set<string>>(new Set());
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(todayCount);
  const [pending, start] = useTransition();

  function lookup() {
    setError(null);
    setNote(null);
    start(async () => {
      const result = await lookupVocab(raw, passage);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setFound(result.data);
      // Mặc định giữ tất cả trừ những cụm model đã gắn cờ.
      setKeep(new Set(result.data.filter((t) => !t.note).map((t) => t.term)));
    });
  }

  function save() {
    if (!found) return;
    setError(null);
    start(async () => {
      const result = await addVocabCards(
        found
          .filter((t) => keep.has(t.term) && t.example)
          .map((t) => ({
            term: t.term,
            context: t.example,
            kind: t.kind,
            explanation: backOf(t),
          })),
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const { added, repeated, capped, todayCount: now } = result.data;
      setCount(now);
      setNote(
        [
          added > 0 ? `Thêm ${added} thẻ` : "",
          repeated > 0 ? `${repeated} cụm đã có, kéo về ôn hôm nay` : "",
          capped > 0 ? `${capped} cụm quá trần hôm nay, để mai` : "",
        ]
          .filter(Boolean)
          .join(" · ") || "Không có gì để lưu.",
      );
      setFound(null);
      setRaw("");
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
    <div className="w-full space-y-3 rounded-lg border bg-background p-3">
      {!found && (
        <>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={4}
            placeholder={
              "mỗi dòng một cụm từ mới\na growing body of evidence\nmitigate\nraise concerns"
            }
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
            aria-label="Các cụm từ mới"
          />
          {showPassage ? (
            <textarea
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              rows={4}
              placeholder="dán đoạn văn bạn vừa đọc — không bắt buộc"
              className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              aria-label="Đoạn văn vừa đọc"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowPassage(true)}
              className="text-xs text-primary underline underline-offset-2"
            >
              Dán đoạn văn vừa đọc (không bắt buộc — để lấy câu thật thay vì câu
              máy sinh)
            </button>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={lookup}
              disabled={pending || !raw.trim()}
            >
              {pending ? "Đang tra…" : "Tra và dựng thẻ"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Đóng
            </Button>
            <span className="ml-auto text-xs text-muted-foreground">
              {count}/{VOCAB_DAILY_CAP} thẻ mới hôm nay · tối đa{" "}
              {MAX_TERMS_PER_LOOKUP} cụm mỗi lần
            </span>
          </div>
        </>
      )}

      {found && (
        <>
          <p className="text-xs text-muted-foreground">
            Bỏ tick những cụm bạn không muốn học. Mặt trước thẻ sẽ là câu ví dụ
            với chỗ trống.
          </p>
          <ul className="space-y-2">
            {found.map((entry) => (
              <li
                key={entry.term}
                className={cn(
                  "rounded-md border p-2 text-xs",
                  entry.note && "border-dashed opacity-70",
                )}
              >
                <label className="flex cursor-pointer items-start gap-2">
                  <input
                    type="checkbox"
                    checked={keep.has(entry.term)}
                    onChange={(e) => {
                      const next = new Set(keep);
                      if (e.target.checked) next.add(entry.term);
                      else next.delete(entry.term);
                      setKeep(next);
                    }}
                    className="mt-0.5"
                  />
                  <span className="min-w-0 flex-1 space-y-0.5">
                    <span className="block font-medium">
                      {entry.term}
                      <span className="ml-2 font-normal text-muted-foreground">
                        {entry.kind === "collocation" ? "cụm" : "từ đơn"}
                        {entry.fromPassage ? " · câu từ bài bạn đọc" : ""}
                      </span>
                    </span>
                    {entry.meaning && (
                      <span className="block">{entry.meaning}</span>
                    )}
                    {entry.example && (
                      <span className="block text-muted-foreground italic">
                        {entry.example}
                      </span>
                    )}
                    {entry.collocations.length > 0 && (
                      <span className="block text-muted-foreground">
                        Hay đi với: {entry.collocations.join(", ")}
                      </span>
                    )}
                    {entry.note && (
                      <span className="block text-amber-600 dark:text-amber-400">
                        {entry.note}
                      </span>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={save}
              disabled={pending || keep.size === 0}
            >
              {pending ? "…" : `Lưu ${keep.size} thẻ`}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setFound(null)}>
              Sửa danh sách
            </Button>
          </div>
        </>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
