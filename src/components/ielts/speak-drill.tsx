"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { logSpeakDrill } from "@/server/ielts/input";

/**
 * Ô 4/3/2. Hai nút thay vì một, vì con số duy nhất đáng ghi là lượt ba có gọn
 * trong hai phút hay không — đó là dấu hiệu độ trôi chảy đang lên.
 */
export function SpeakDrill({
  minutes,
  done,
}: {
  minutes: number;
  done: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const log = (fit: boolean) => {
    setError(null);
    start(async () => {
      try {
        await logSpeakDrill(fit, minutes);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không ghi được.");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={done ? "outline" : "default"}
          onClick={() => log(true)}
          disabled={pending}
        >
          Kịp 2 phút
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => log(false)}
          disabled={pending}
        >
          Chưa kịp
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
