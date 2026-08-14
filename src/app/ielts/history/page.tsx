import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listLessonHistory } from "@/server/ielts/lessons";

export const dynamic = "force-dynamic";

const SKILL_EMOJI: Record<string, string> = {
  writing: "✍️",
  reading: "📖",
  listening: "👂",
  speaking: "🗣️",
  vocab: "🧠",
  rest: "🔁",
};

export default async function HistoryPage() {
  const records = await listLessonHistory();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Hành trình học
        </h1>
        <p className="text-sm text-muted-foreground">
          Mỗi attempt, feedback và repair bạn đã lưu — mở lại để học tiếp từ
          đúng chỗ.
        </p>
      </header>

      {records.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            Chưa có attempt nào. Hoàn thành một phiên ở Hôm nay để bắt đầu có
            hành trình xem lại.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map(({ lesson, sessions, submissions, cards }) => {
            const latest = sessions[0];
            return (
              <Card key={lesson.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {SKILL_EMOJI[lesson.activity.skill]} Bài {lesson.index}:{" "}
                        {lesson.activity.label}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Lần gần nhất: {latest.date} · {sessions.length} lần lưu
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {submissions.length > 0 && (
                        <Badge variant="secondary">
                          {submissions.length} bài viết
                        </Badge>
                      )}
                      {cards.length > 0 && (
                        <Badge variant="outline">
                          {cards.length} lỗi đã lưu
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-0">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {latest.notes ||
                      latest.rawScore ||
                      "Đã lưu kết quả buổi học."}
                  </p>
                  <Link
                    href={`/ielts/history/${lesson.id}`}
                    className="shrink-0 text-sm font-medium text-primary hover:underline"
                  >
                    Mở attempt →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
