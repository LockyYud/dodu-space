"use client";

import { useState, useTransition } from "react";
import {
  WEEK_LOAD_HINT,
  WEEK_LOAD_LABEL,
  WEEK_LOADS,
  type WeekLoad,
} from "@/lib/ielts/plan";
import { cn } from "@/lib/utils";
import { setWeekLoad } from "@/server/ielts/week-load";

/**
 * Declares how heavy this week is.
 *
 * The schedule is fixed by weekday so the learner never has to decide what to
 * do; this is the one dial that keeps a fixed schedule from breaking on a busy
 * week. It scales days, not the plan — the phase still exits on competence.
 */
export function WeekLoadPicker({ current }: { current: WeekLoad }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-1">
        {WEEK_LOADS.map((load) => (
          <button
            key={load}
            type="button"
            title={WEEK_LOAD_HINT[load]}
            disabled={pending}
            onClick={() => {
              setError(null);
              start(async () => {
                try {
                  await setWeekLoad(load);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Không đổi được.");
                }
              });
            }}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs transition-colors",
              load === current
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {WEEK_LOAD_LABEL[load]}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
