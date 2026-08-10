"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ErrorCard, ReviewGrade } from "@/lib/ielts/schema";
import { isStubborn } from "@/lib/ielts/srs";
import { cn } from "@/lib/utils";
import { submitReview } from "@/server/ielts/reviews";

const GRADES: { grade: ReviewGrade; label: string; variant: string }[] = [
  { grade: "again", label: "Again", variant: "destructive" },
  { grade: "hard", label: "Hard", variant: "outline" },
  { grade: "good", label: "Good", variant: "secondary" },
  { grade: "easy", label: "Easy", variant: "default" },
];

// How many other cards to put between an "Again" card and its retry, and
// how many times a single card may be requeued within one session before
// it's left to resurface via the normal due-today queue instead (avoids an
// infinite loop on a card the learner keeps failing).
const REQUEUE_OFFSET = 3;
const MAX_REQUEUE_PER_CARD = 2;

export function ReviewSession({ initialCards }: { initialCards: ErrorCard[] }) {
  const [cards, setCards] = useState(initialCards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [requeueCounts, setRequeueCounts] = useState<Record<number, number>>(
    {},
  );
  const [pending, startTransition] = useTransition();

  const card = cards[index];

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          🎉 Không còn lỗi nào đến hạn hôm nay. Quay lại sau nhé.
        </CardContent>
      </Card>
    );
  }

  if (!card) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-lg font-medium">Xong phiên ôn! ✓</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Đã ôn {done} lỗi. Tải lại trang để xem lỗi mới đến hạn.
          </p>
        </CardContent>
      </Card>
    );
  }

  function grade(g: ReviewGrade) {
    if (!card) return;
    const id = card.id;
    const gradedAt = index;
    startTransition(async () => {
      await submitReview(id, g);
      setDone((d) => d + 1);
      setRevealed(false);

      if (g === "again") {
        const timesRequeued = requeueCounts[id] ?? 0;
        if (timesRequeued < MAX_REQUEUE_PER_CARD) {
          setRequeueCounts((c) => ({ ...c, [id]: timesRequeued + 1 }));
          setCards((prev) => {
            const target = prev[gradedAt];
            if (!target || target.id !== id) return prev;
            const rest = [
              ...prev.slice(0, gradedAt),
              ...prev.slice(gradedAt + 1),
            ];
            const insertAt = Math.min(gradedAt + REQUEUE_OFFSET, rest.length);
            return [
              ...rest.slice(0, insertAt),
              target,
              ...rest.slice(insertAt),
            ];
          });
          // The card at `gradedAt` was removed and reinserted further
          // ahead, so the next card to review has shifted into this same
          // index — don't advance.
          return;
        }
      }
      setIndex((i) => i + 1);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {index + 1} / {cards.length}
        </span>
        <span>Đã ôn: {done}</span>
      </div>

      <Card>
        <CardContent className="space-y-4 py-8">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {card.errorType}
            </Badge>
            {isStubborn(card.lapses) && (
              <Badge variant="destructive" className="text-[10px]">
                lỗi cứng đầu ({card.lapses})
              </Badge>
            )}
          </div>

          <p className="text-center text-lg text-destructive">{card.front}</p>

          {revealed ? (
            <div className="space-y-3 border-t pt-4">
              <p className="text-center text-lg font-medium">{card.back}</p>
              {card.explanation && (
                <p className="text-center text-sm text-muted-foreground">
                  {card.explanation}
                </p>
              )}
              {card.context && (
                <p className="text-center text-xs text-muted-foreground">
                  ({card.context})
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => setRevealed(true)}>
                Hiện đáp án
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {revealed && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {GRADES.map((g) => (
              <Button
                key={g.grade}
                variant={
                  g.variant as
                    | "default"
                    | "outline"
                    | "secondary"
                    | "destructive"
                }
                disabled={pending}
                onClick={() => grade(g.grade)}
                className={cn("w-full")}
              >
                {g.label}
              </Button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Bấm Again: câu này sẽ hỏi lại sau vài card trong chính phiên này.
          </p>
        </>
      )}
    </div>
  );
}
