import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLessonHistory } from "@/server/ielts/lessons";

export const dynamic = "force-dynamic";

export default async function LessonHistoryPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const record = await getLessonHistory(lessonId);
  if (!record) notFound();
  const { lesson, sessions, submissions, cards } = record;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Link
          href="/ielts/journey"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Hành trình học
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bài {lesson.index}: {lesson.activity.label}
        </h1>
        <p className="text-sm text-muted-foreground">{lesson.activity.focus}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attempts và repair</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa có kết quả được lưu cho bài này.
            </p>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="rounded-md border p-3 text-sm">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{session.date}</span>
                  {session.durationMin && (
                    <span>{session.durationMin} phút</span>
                  )}
                  {session.rawScore && (
                    <Badge variant="outline">{session.rawScore}</Badge>
                  )}
                  {session.bandEstimate != null && (
                    <Badge variant="outline">
                      band {session.bandEstimate.toFixed(1)}
                    </Badge>
                  )}
                </div>
                {session.sourceUrl &&
                  !session.sourceUrl.startsWith("ielts:lesson:") && (
                    <a
                      href={session.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block truncate text-primary hover:underline"
                    >
                      Nguồn đã dùng ↗
                    </a>
                  )}
                {session.notes && (
                  <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                    {session.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardHeader>
            <CardTitle className="text-base">
              Bài viết · {submission.taskType.toUpperCase()} ·{" "}
              {submission.wordCount ?? 0} từ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {submission.prompt && (
              <p className="text-sm text-muted-foreground">
                Đề: {submission.prompt}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {[
                ["TA", submission.bandTa],
                ["CC", submission.bandCc],
                ["LR", submission.bandLr],
                ["GRA", submission.bandGra],
              ].map(([name, score]) => (
                <div
                  key={String(name)}
                  className="rounded border p-2 text-center"
                >
                  {name}: {typeof score === "number" ? score.toFixed(1) : "—"}
                </div>
              ))}
            </div>
            <p className="whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm leading-6">
              {submission.essayText}
            </p>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Lỗi để ôn lại ({cards.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {cards.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Buổi này chưa lưu lỗi nào.
            </p>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="rounded-md border p-3 text-sm">
                <Badge variant="outline" className="mb-2 text-[10px]">
                  {card.errorType}
                </Badge>
                <p>{card.front}</p>
                <p className="mt-1 text-emerald-700 dark:text-emerald-400">
                  → {card.back}
                </p>
                {card.explanation && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {card.explanation}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
