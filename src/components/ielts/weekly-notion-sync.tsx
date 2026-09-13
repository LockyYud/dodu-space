"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { syncWeeklyEnglishData } from "@/server/ielts/notion-sync";

function currentISOWeek() {
  const date = new Date();
  const utc = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function WeeklyNotionSync() {
  const [week, setWeek] = useState(currentISOWeek);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        aria-label="Tuần cần sync"
        value={week}
        onChange={(event) => setWeek(event.target.value)}
        className="h-8 w-28 rounded border bg-background px-2 text-xs"
      />
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await syncWeeklyEnglishData(week);
            setMessage(
              result.ok
                ? result.data.unchanged
                  ? "Notion đã có bản mới nhất."
                  : "Đã gửi dữ liệu tuần sang Notion."
                : result.error,
            );
          })
        }
      >
        {pending ? "Đang sync…" : "Sync weekly review"}
      </Button>
      {message && (
        <span className="text-xs text-muted-foreground">{message}</span>
      )}
    </div>
  );
}
