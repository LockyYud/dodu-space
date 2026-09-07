import Link from "next/link";
import { TodayWorkbench } from "@/components/ielts/today-workbench";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lesson } from "@/lib/ielts/plan";
import { lessonQueueStatus } from "@/lib/ielts/plan";
import { learnerProfile } from "@/lib/ielts/profile";
import { listCompletedLessonIds } from "@/server/ielts/lessons";
import { getPaceOverview } from "@/server/ielts/pace";
import { countDue } from "@/server/ielts/reviews";
import { getStreak, listSessions } from "@/server/ielts/sessions";
import { latestRewritableSubmission } from "@/server/ielts/writing";

export const dynamic = "force-dynamic";

const PACE_TONE = {
  "on-track": "text-emerald-600 dark:text-emerald-400",
  behind: "text-amber-600 dark:text-amber-400",
  "at-risk": "text-destructive",
  "no-exam": "text-muted-foreground",
} as const;

export default async function TodayPage() {
  const [completedLessons, dueCount, streak, sessions, profile, pace] =
    await Promise.all([
      listCompletedLessonIds(),
      countDue(),
      getStreak(),
      listSessions(7),
      learnerProfile(),
      getPaceOverview(),
    ]);
  const queue = lessonQueueStatus(completedLessons);
  const { current: lesson } = queue;

  // A rewrite lesson has to open the exact essay it fixes, otherwise the
  // rewrite loop quietly degrades into "write something new again".
  const rewriteSource =
    lesson.activity.kind === "rewrite"
      ? await latestRewritableSubmission()
      : null;
  const action = actionFor(lesson, rewriteSource?.id);
  const hasStudiedToday = sessions.some(
    (session) => session.date === new Date().toISOString().slice(0, 10),
  );
  const degraded = pace.report.degraded;

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
              {queue.completedCount}/{queue.totalCount} bài bắt buộc
            </Badge>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Bạn đang ở</p>
              <p className="mt-1 font-medium">
                {lesson.phaseLabel} · Tuần {lesson.week}
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
          <p className={`text-xs ${PACE_TONE[pace.report.status]}`}>
            {pace.report.message}
          </p>
          {!profile.examDate && pace.habitGate && (
            <p className="text-xs text-muted-foreground">
              Bạn đã giữ nhịp đủ 4 tuần. Có thể đặt ngày thi rồi — sớm nhất nên
              là {pace.suggestedExam}.{" "}
              <Link href="/ielts/settings" className="text-primary underline">
                Đặt trong Hồ sơ học
              </Link>
              .
            </p>
          )}
        </CardContent>
      </Card>

      {degraded && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="space-y-2 py-4">
            <p className="font-medium">Chế độ giữ nhịp</p>
            <p className="text-sm text-muted-foreground">
              14 ngày qua học quá thưa, nên hôm nay chỉ cần một phiên ngắn. Bài
              bên dưới vẫn chờ sẵn, hàng đợi không trôi đi đâu cả.
            </p>
            <Link href="/ielts/review" prefetch={false}>
              <Button variant="outline">Ôn 10 phút là đủ cho hôm nay</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {!degraded && dueCount > 0 && (
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
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Phiên ưu tiên hôm nay</Badge>
                {lesson.activity.kind !== "core" && (
                  <Badge variant="outline">
                    {KIND_LABEL[lesson.activity.kind]}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{lesson.activity.label}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {lesson.activity.focus}
              </p>
            </div>
            <Badge variant="outline">~{lesson.activity.minutes} phút</Badge>
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            <span className="font-medium">Đầu ra cần có: </span>
            {outcomeFor(lesson)}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <ol className="space-y-2">
            {lesson.activity.steps.map((step, index) => (
              <li key={step.text} className="flex gap-3 text-sm">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {index + 1}
                </span>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>
          {lesson.activity.kind === "rewrite" && !rewriteSource && (
            <p className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-muted-foreground">
              Chưa có bài nào được chấm để viết lại. Hãy làm bài Writing của hôm
              T2 trước, rồi quay lại đây.
            </p>
          )}
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
            Kế hoạch theo mục tiêu {profile.examGoal}. Nhịp gần đây: {streak}{" "}
            ngày liên tiếp.
          </p>
        </CardContent>
      </Card>

      {queue.buffer && (
        <Card>
          <CardContent className="space-y-3 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                {queue.buffer.dowLabel} tuần này: {queue.buffer.activity.label}
              </p>
              <Badge variant="outline">tuỳ chọn</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {queue.buffer.activity.focus}
            </p>
            <details className="rounded-md border p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Mở ngày bù
              </summary>
              <div className="mt-3">
                <TodayWorkbench
                  lesson={queue.buffer}
                  articles={[]}
                  dueCount={dueCount}
                />
              </div>
            </details>
          </CardContent>
        </Card>
      )}

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

const KIND_LABEL: Record<string, string> = {
  baseline: "Đo baseline",
  rewrite: "Viết lại",
  mock: "Mock test",
  buffer: "Ngày bù",
  core: "",
};

function actionFor(
  lesson: Lesson,
  rewriteOf?: number,
): { href: string; label: string } {
  const { tool, skill, kind } = lesson.activity;
  const base = `lessonId=${lesson.id}`;

  if (kind === "rewrite") {
    return {
      href: rewriteOf
        ? `/ielts/writing?${base}&rewriteOf=${rewriteOf}`
        : `/ielts/writing?${base}`,
      label: "Mở bài để viết lại",
    };
  }
  if (tool === "writing" || skill === "writing") {
    return { href: `/ielts/writing?${base}`, label: "Bắt đầu Writing" };
  }
  if (tool === "speaking" || skill === "speaking") {
    return { href: `/ielts/speaking?${base}`, label: "Ghi buổi Speaking" };
  }
  if (kind === "baseline") {
    return { href: `/ielts/track?${base}`, label: "Làm bài baseline" };
  }
  if (kind === "mock") {
    return { href: `/ielts/track?${base}`, label: "Bắt đầu mock" };
  }
  return { href: `/ielts/track?${base}`, label: "Mở Source Runner" };
}

function outcomeFor(lesson: Lesson): string {
  const { tool, skill, kind } = lesson.activity;
  if (kind === "baseline") {
    return "một band khởi điểm được ghi lại, làm mốc so sánh cả lộ trình.";
  }
  if (kind === "mock") {
    return "band Listening và Reading của một mock đúng giờ.";
  }
  if (kind === "rewrite") {
    return "một bản viết lại được chấm, kèm chênh lệch band so với bài gốc.";
  }
  if (tool === "writing" || skill === "writing") {
    return "một bài viết, feedback theo rubric và một repair ngắn.";
  }
  if (tool === "track" || skill === "reading" || skill === "listening") {
    return "điểm/kết quả và lý do sai đáng nhớ.";
  }
  if (tool === "speaking" || skill === "speaking") {
    return "band ước tính của gia sư kèm 1–3 lỗi cần sửa.";
  }
  return "một ghi chú cụ thể về điều bạn đã truy hồi hoặc áp dụng.";
}
