import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listStudyDays } from "@/server/ielts/history";

export const dynamic = "force-dynamic";

const SLOT_LABEL: Record<string, string> = {
  input: "Tiếp nhận",
  srs: "Ôn lỗi",
  writing: "Viết",
  rewrite: "Viết lại",
  "timed-listening": "Listening bấm giờ",
  "timed-reading": "Reading bấm giờ",
  mock: "Mock",
  tutor: "Speaking (đã ghi)",
  grammar: "Ngữ pháp",
};

export default async function HistoryPage() {
  const days = await listStudyDays();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Hành trình học
        </h1>
        <p className="text-sm text-muted-foreground">
          Mỗi ngày bạn đã học, và những gì còn giữ lại được từ ngày đó.
        </p>
      </header>

      {days.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            Chưa có ngày nào được ghi. Mở Hôm nay và bắt đầu bằng phần tiếp
            nhận.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {days.map((day) => {
            const slots = [
              ...new Set(
                day.sessions.map((s) => s.slot ?? "khác").filter(Boolean),
              ),
            ];
            const minutes = day.sessions.reduce(
              (sum, s) => sum + (s.durationMin ?? 0),
              0,
            );
            return (
              <Card key={day.date}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-base">{day.date}</CardTitle>
                    <div className="flex flex-wrap gap-1.5">
                      {minutes > 0 && (
                        <Badge variant="outline">{minutes} phút</Badge>
                      )}
                      {day.submissions.length > 0 && (
                        <Badge variant="secondary">
                          {day.submissions.length} bài viết
                        </Badge>
                      )}
                      {day.cards.length > 0 && (
                        <Badge variant="outline">{day.cards.length} lỗi</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-0">
                  <p className="text-sm text-muted-foreground">
                    {slots.map((s) => SLOT_LABEL[s] ?? s).join(" · ")}
                  </p>
                  <Link
                    href={`/ielts/history/${day.date}`}
                    className="shrink-0 text-sm font-medium text-primary hover:underline"
                  >
                    Xem ngày này →
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
