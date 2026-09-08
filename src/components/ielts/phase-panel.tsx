"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExitStatus } from "@/lib/ielts/progress";
import { advancePhase } from "@/server/ielts/plan-state";

/**
 * Exit criteria for the current phase, and the button that moves on.
 *
 * Advancing is explicit rather than automatic: the learner should see which
 * criteria are met before the load changes, and v3 phases move on competence,
 * so a surprise jump would undermine the point.
 */
export function PhasePanel({
  exit,
  canAdvance,
  nextLabel,
}: {
  exit: ExitStatus[];
  canAdvance: boolean;
  nextLabel: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function advance() {
    setError(null);
    start(async () => {
      try {
        await advancePhase();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Không chuyển được giai đoạn.",
        );
      }
    });
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-1.5">
        {exit.map((criterion) => (
          <li key={criterion.id} className="flex items-start gap-2 text-sm">
            <span
              className={
                criterion.met
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }
            >
              {criterion.met ? "✓" : "○"}
            </span>
            <span className="flex-1">{criterion.label}</span>
            <Badge
              variant="outline"
              className="shrink-0 text-[10px] tabular-nums"
            >
              {criterion.lowerIsBetter
                ? criterion.current
                  ? `${criterion.current} · cần dưới ${criterion.target}`
                  : "chưa có dữ liệu"
                : `${criterion.current} / ${criterion.target}`}
            </Badge>
          </li>
        ))}
      </ul>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {nextLabel && (
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={advance} disabled={pending || !canAdvance} size="sm">
            {pending ? "Đang chuyển…" : `Sang ${nextLabel}`}
          </Button>
          {!canAdvance && (
            <p className="text-xs text-muted-foreground">
              Còn tiêu chí chưa đạt. Không sao, giai đoạn này kéo dài bao lâu
              cũng được.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
