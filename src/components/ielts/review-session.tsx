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

export function ReviewSession({ initialCards }: { initialCards: ErrorCard[] }) {
  const [cards] = useState(initialCards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
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
    startTransition(async () => {
      await submitReview(id, g);
      setDone((d) => d + 1);
      setRevealed(false);
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
        <div className="grid grid-cols-4 gap-2">
          {GRADES.map((g) => (
            <Button
              key={g.grade}
              variant={
                g.variant as "default" | "outline" | "secondary" | "destructive"
              }
              disabled={pending}
              onClick={() => grade(g.grade)}
              className={cn("w-full")}
            >
              {g.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
