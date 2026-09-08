"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { logSlot } from "@/server/ielts/input";

/**
 * Tick for a weekly slot with no tool behind it. Without this the grammar
 * drill row had no button at all and sat at 0 of 3 forever, which was the one
 * slot aimed squarely at the learner's repeat grammar mistakes.
 */
export function SlotLog({
  slot,
  minutes,
  done,
}: {
  slot: string;
  minutes: number;
  done: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function log() {
    setError(null);
    start(async () => {
      try {
        const result = await logSlot(slot, minutes);
        if (!result.ok) setError(result.error);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không ghi được.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        size="sm"
        variant={done ? "outline" : "default"}
        onClick={log}
        disabled={pending}
      >
        {pending ? "…" : done ? "Ghi thêm" : "Đã làm"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
