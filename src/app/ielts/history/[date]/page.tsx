import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudyDay } from "@/server/ielts/history";

export const dynamic = "force-dynamic";

export default async function StudyDayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const day = await getStudyDay(date);
  if (!day) notFound();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Link
          href="/ielts/history"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Hành trình học
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{day.date}</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buổi đã ghi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {day.sessions.map((session) => (
            <div key={session.id} className="rounded-md border p-3 text-sm">
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{session.slot ?? session.skill}</Badge>
                {session.durationMin != null && (
                  <span>{session.durationMin} phút</span>
                )}
                {session.rawScore && <span>{session.rawScore}</span>}
                {session.bandEstimate != null && (
                  <span>band {session.bandEstimate.toFixed(1)}</span>
                )}
              </div>
              {session.notes && (
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                  {session.notes}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {day.submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bài viết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {day.submissions.map((submission) => (
              <div key={submission.id} className="rounded-md border p-3">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{submission.taskType}</Badge>
                  {submission.isRewrite && (
                    <Badge variant="secondary">viết lại</Badge>
                  )}
                  {submission.errorDensity != null && (
                    <span>{submission.errorDensity} lỗi / 100 từ</span>
                  )}
                  {submission.bandOverall != null && (
                    <span>band {submission.bandOverall.toFixed(1)}</span>
                  )}
                  <span>{submission.wordCount} từ</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {submission.essayText}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {day.cards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Lỗi đã lưu ({day.cards.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {day.cards.map((card) => (
              <div key={card.id} className="rounded-md border p-3 text-sm">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">
                    {card.rule ?? card.errorType}
                  </Badge>
                </div>
                <p className="mt-1 text-destructive line-through">
                  {card.front}
                </p>
                <p className="font-medium">{card.back}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
