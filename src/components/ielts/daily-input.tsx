"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type InputKind, logDailyInput } from "@/server/ielts/input";

/**
 * The daily contact habit. Deliberately one tap plus a number: roadmap v3 puts
 * Listening and Reading on a daily cadence, and anything that needs a source,
 * a score or an upload would not survive a busy day.
 */
export function DailyInput({
  kind,
  label,
  targetMinutes,
  doneMinutes,
  done,
  hint,
  compact = false,
}: {
  kind: InputKind;
  label: string;
  targetMinutes: number;
  doneMinutes: number;
  done: boolean;
  hint: string;
  /** Control only: the label, minutes and hint are drawn by the caller. */
  compact?: boolean;
}) {
  const [minutes, setMinutes] = useState(String(targetMinutes));
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function log() {
    setError(null);
    const value = Number(minutes);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Nhập số phút lớn hơn 0.");
      return;
    }
    start(async () => {
      try {
        await logDailyInput(kind, value);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không ghi được.");
      }
    });
  }

  const control = (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        className="h-9 w-16 rounded-md border bg-background px-2 text-sm"
        aria-label={`Số phút ${label}`}
      />
      <Button
        size="sm"
        variant={done ? "outline" : "default"}
        onClick={log}
        disabled={pending}
      >
        {pending ? "…" : done ? "Ghi thêm" : "Đã xong"}
      </Button>
    </div>
  );

  if (compact) {
    return (
      <div className="flex flex-col items-end gap-1">
        {control}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-lg border p-3",
        done && "border-emerald-500/40 bg-emerald-500/5",
      )}
    >
      <div className="min-w-40 flex-1">
        <p className="text-sm font-medium">
          {done ? "✓ " : ""}
          {label}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {done
              ? `${doneMinutes} phút hôm nay`
              : `mục tiêu ${targetMinutes} phút`}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      {control}
    </div>
  );
}
