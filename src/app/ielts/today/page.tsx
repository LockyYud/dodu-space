import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonQueueStatus } from "@/lib/ielts/plan";
import { learnerProfile } from "@/lib/ielts/profile";
import { listCompletedLessonIds } from "@/server/ielts/lessons";
import { countDue } from "@/server/ielts/reviews";
import { getStreak, listSessions } from "@/server/ielts/sessions";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const [completedLessons, dueCount, streak, sessions, profile] =
    await Promise.all([
      listCompletedLessonIds(),
      countDue(),
      getStreak(),
      listSessions(7),
      learnerProfile(),
    ]);
  const queue = lessonQueueStatus(completedLessons);
  const { current: lesson } = queue;
  const action = actionFor(
    lesson.id,
    lesson.activity.tool,
    lesson.activity.skill,
  );
  const hasStudiedToday = sessions.some(
    (session) => session.date === new Date().toISOString().slice(0, 10),
  );

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {hasStudiedToday
            ? "Bạn đã có một attempt hôm nay."
            : "Một bước nhỏ cũng tính."}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Hôm nay, học gì?
        </h1>
        <p className="text-sm text-muted-foreground">
          Không cần theo kịp một backlog. Chỉ cần hoàn thành một attempt có đầu
          ra.
        </p>
      </header>

      <Card>
        <CardContent className="space-y-3 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">Trạng thái hiện tại</p>
            <Badge variant="outline">
              {queue.completedCount}/{queue.totalCount} mốc đã hoàn thành
            </Badge>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Bạn đang ở</p>
              <p className="mt-1 font-medium">
                {lesson.phaseLabel} · Bài {lesson.index}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Buổi hôm nay</p>
              <p className="mt-1 font-medium">
                {hasStudiedToday ? "Đã có attempt" : "Chưa bắt đầu"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ôn tập</p>
              <p className="mt-1 font-medium">
                {dueCount > 0
                  ? `${dueCount} lỗi đến hạn`
                  : "Không có lỗi đến hạn"}
              </p>
            </div>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${queue.percent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Đây là mốc để định vị lộ trình, không phải backlog cần chạy cho hết.
          </p>
        </CardContent>
      </Card>

      {dueCount > 0 && (
        <Card className="border-primary/25 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-medium">Khởi động 5–8 phút</p>
              <p className="text-sm text-muted-foreground">
                Gọi lại {dueCount} lỗi đến hạn trước khi học nội dung mới.
              </p>
            </div>
            <Link href="/ielts/review" prefetch={false}>
              <Button variant="outline">
                Ôn nhanh {Math.min(dueCount, 6)} lỗi
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/40 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <Badge variant="secondary">Phiên ưu tiên hôm nay</Badge>
              <CardTitle className="text-xl">{lesson.activity.label}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {lesson.activity.focus}
              </p>
            </div>
            <Badge variant="outline">~{lesson.activity.minutes} phút</Badge>
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            <span className="font-medium">Đầu ra cần có: </span>
            {outcomeFor(lesson.activity.tool, lesson.activity.skill)}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <ol className="space-y-2">
            {lesson.activity.steps.slice(0, 3).map((step, index) => (
              <li key={step.text} className="flex gap-3 text-sm">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {index + 1}
                </span>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2">
            <Link href={action.href} prefetch={false}>
              <Button size="lg">{action.label} →</Button>
            </Link>
            <Link href="/ielts/review" prefetch={false}>
              <Button size="lg" variant="outline">
                Đang bận? Ôn 5 phút
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Kế hoạch theo mục tiêu {profile.examGoal}. Nhịp gần đây: {streak}
            ngày liên tiếp.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 py-4">
            <p className="font-medium">Bạn không phải học lại từ đầu</p>
            <p className="text-sm text-muted-foreground">
              Mở Hành trình để xem bài cũ, feedback và repair đã lưu.
            </p>
            <Link
              href="/ielts/journey"
              className="text-sm font-medium text-primary hover:underline"
            >
              Mở hành trình →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 py-4">
            <p className="font-medium">Ngày bận vẫn có giá trị</p>
            <p className="text-sm text-muted-foreground">
              Một phiên review ngắn giữ mạch mà không tạo cảm giác nợ bài.
            </p>
            <Link
              href="/ielts/review"
              className="text-sm font-medium text-primary hover:underline"
            >
              Làm phiên ngắn →
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function actionFor(lessonId: string, tool: string | undefined, skill: string) {
  if (tool === "writing") {
    return {
      href: `/ielts/writing?lessonId=${lessonId}`,
      label: "Bắt đầu Writing",
    };
  }
  if (tool === "track") {
    return {
      href: `/ielts/track?lessonId=${lessonId}`,
      label: "Mở Source Runner",
    };
  }
  if (tool === "speaking") {
    return {
      href: `/ielts/speaking?lessonId=${lessonId}`,
      label: "Bắt đầu Speaking",
    };
  }
  return skill === "writing"
    ? { href: `/ielts/writing?lessonId=${lessonId}`, label: "Bắt đầu Writing" }
    : { href: `/ielts/track?lessonId=${lessonId}`, label: "Bắt đầu phiên học" };
}

function outcomeFor(tool: string | undefined, skill: string) {
  if (tool === "writing" || skill === "writing") {
    return "một bài viết, feedback theo rubric và một repair ngắn.";
  }
  if (tool === "track" || skill === "reading" || skill === "listening") {
    return "điểm/kết quả và lý do sai đáng nhớ.";
  }
  if (tool === "speaking" || skill === "speaking") {
    return "một ghi âm hoặc nhận xét tutor, kèm một điểm cần sửa.";
  }
  return "một ghi chú cụ thể về điều bạn đã truy hồi hoặc áp dụng.";
}
