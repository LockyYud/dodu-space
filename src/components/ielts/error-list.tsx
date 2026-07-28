"use client";

import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ErrorCard } from "@/lib/ielts/schema";
import { isStubborn } from "@/lib/ielts/srs";
import { cn } from "@/lib/utils";
import { deleteCard } from "@/server/ielts/errors";

type Filter = "all" | "stubborn" | "due";

export function ErrorList({
  cards,
  today,
}: {
  cards: ErrorCard[];
  today: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (filter === "stubborn") return cards.filter((c) => isStubborn(c.lapses));
    if (filter === "due") return cards.filter((c) => c.dueDate <= today);
    return cards;
  }, [cards, filter, today]);

  function remove(id: number) {
    startTransition(async () => {
      await deleteCard(id);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", `Tất cả (${cards.length})`],
            [
              "due",
              `Đến hạn (${cards.filter((c) => c.dueDate <= today).length})`,
            ],
            [
              "stubborn",
              `Lỗi cứng đầu (${cards.filter((c) => isStubborn(c.lapses)).length})`,
            ],
          ] as [Filter, string][]
        ).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Chưa có lỗi nào. Chấm một bài Writing để bắt đầu tích luỹ.
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-start gap-3 py-3">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">
                    {c.errorType}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {c.sourceType}
                  </Badge>
                  {isStubborn(c.lapses) && (
                    <Badge variant="destructive" className="text-[10px]">
                      cứng đầu ({c.lapses})
                    </Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    due {c.dueDate} · rep {c.repetitions}
                  </span>
                </div>
                <p className="text-sm text-destructive line-through">
                  {c.front}
                </p>
                <p className="text-sm font-medium">{c.back}</p>
                {c.explanation && (
                  <p className="text-xs text-muted-foreground">
                    {c.explanation}
                  </p>
                )}
              </div>
              <Button
                size="xs"
                variant="ghost"
                disabled={pending}
                onClick={() => remove(c.id)}
                className={cn("text-muted-foreground hover:text-destructive")}
              >
                Xóa
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
