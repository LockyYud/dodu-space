import Link from "next/link";
import { TodayWorkbench } from "@/components/ielts/today-workbench";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adaptiveRecommendation, latestSkillGaps } from "@/lib/ielts/insights";
import {
  type Activity,
  type Lesson,
  lessonQueueStatus,
} from "@/lib/ielts/plan";
import { getReadingArticles } from "@/lib/ielts/reading";
import { cn } from "@/lib/utils";
import { listBands } from "@/server/ielts/bands";
import { listCards } from "@/server/ielts/errors";
import { listCompletedLessonIds } from "@/server/ielts/lessons";
import { countDue } from "@/server/ielts/reviews";
import { getStreak, listSessions } from "@/server/ielts/sessions";

export const dynamic = "force-dynamic";

const SKILL_EMOJI: Record<string, string> = {
  writing: "✍️",
  reading: "📖",
  listening: "👂",
  speaking: "🗣️",
  vocab: "🧠",
  rest: "🔁",
};
export default async function TodayPage() {
  const [completedLessons, streak, due, bands, cards, sessions] =
    await Promise.all([
      listCompletedLessonIds(),
      getStreak(),
      countDue(),
      listBands(),
      listCards(),
      listSessions(14),
    ]);
  const queue = lessonQueueStatus(completedLessons);
  const lesson = queue.current;
  const a = lesson.activity;
  const articles = needsArticles(a) ? await getReadingArticles(4) : [];
  const href = actionHrefFor(a);
  const startsInline = href === "#today-workbench";
  const recommendation = adaptiveRecommendation({
    bands,
    cards,
    dueCount: due,
    sessions,
  });
  const gaps = latestSkillGaps(bands);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Hôm nay</h1>
          <p className="text-sm text-muted-foreground">
            {lesson.phaseLabel} · Bài {lesson.index}/{queue.totalCount} · Tuần{" "}
            {lesson.week} · {lesson.dowLabel}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {queue.percent}% lộ trình
          </Badge>
          <Badge variant="secondary" className="text-xs">
            🔥 {streak} ngày
          </Badge>
          {due > 0 && (
            <Badge variant="destructive" className="text-xs">
              {due} lỗi cần ôn
            </Badge>
          )}
        </div>
      </header>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">
              Coach riêng: {recommendation.title}
            </CardTitle>
            <Badge variant="secondary" className="text-[11px]">
              adaptive
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {recommendation.reason}
          </p>
          {recommendation.secondary.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
              {recommendation.secondary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Link href={recommendation.href}>
              <Button>{recommendation.actionLabel} →</Button>
            </Link>
            {gaps.map((g) => (
              <Badge key={g.skill} variant="outline" className="text-[10px]">
                {g.skill} {g.latest == null ? "—" : g.latest.toFixed(1)} /{" "}
                {g.target.toFixed(1)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current focused lesson */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <span>{SKILL_EMOJI[a.skill] ?? "•"}</span>
              {a.label}
            </CardTitle>
            <Badge variant="outline" className="text-[11px]">
              ~{a.minutes} phút
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">🎯 {a.focus}</p>

          <div id="today-workbench" className="scroll-mt-20">
            <TodayWorkbench lesson={lesson} articles={articles} />
          </div>

          {a.links && a.links.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Nguồn:</span>
              {a.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border px-2.5 py-1 text-xs hover:bg-muted"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <Link href={href}>
              <Button>{startsInline ? "Làm tại đây ↓" : "Bắt đầu →"}</Button>
            </Link>
            {due > 0 && a.skill !== "rest" && (
              <Link href="/ielts/review">
                <Button variant="outline">Ôn {due} lỗi</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Queue bài học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {queue.previous.map((item) => (
            <LessonRow
              key={item.id}
              lesson={item}
              state="done"
              completed={queue.completedIds.has(item.id)}
            />
          ))}
          <LessonRow lesson={lesson} state="current" completed={false} />
          {queue.upcoming.map((item) => (
            <LessonRow
              key={item.id}
              lesson={item}
              state="upcoming"
              completed={false}
            />
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Lộ trình chạy theo queue liên tiếp, không còn tự nhảy theo ngày. Bài chỉ
        chuyển khi bạn bấm{" "}
        <span className="font-medium">Hoàn thành bài này</span>.
      </p>
    </section>
  );
}

function needsArticles(activity: Activity): boolean {
  return activity.steps.some((s) => /bài báo|article|đọc 1 bài/i.test(s.text));
}

function actionHrefFor(activity: Activity): string {
  const text = `${activity.label} ${activity.focus} ${activity.steps
    .map((s) => s.text)
    .join(" ")}`;
  const needsDedicatedWriting =
    activity.skill === "writing" &&
    /AI chấm|Chấm bài|đúng 40|Task 1|Task 2/i.test(text);

  if (needsDedicatedWriting) return "/ielts/writing";
  if (activity.skill === "reading" || activity.skill === "listening") {
    return "/ielts/track";
  }
  if (activity.skill === "speaking") return "/ielts/speaking";
  if (activity.skill === "rest") return "/ielts/review";
  return "#today-workbench";
}

function LessonRow({
  lesson,
  state,
  completed,
}: {
  lesson: Lesson;
  state: "done" | "current" | "upcoming";
  completed: boolean;
}) {
  const activity = lesson.activity;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
        state === "current" ? "bg-primary/5 ring-1 ring-primary/30" : "",
        state === "done" ? "text-muted-foreground" : "",
      )}
    >
      <span
        className={cn(
          "w-16 text-xs font-medium",
          state === "current" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        #{lesson.index}
      </span>
      <span>{SKILL_EMOJI[activity.skill] ?? "•"}</span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate",
          state === "current" && "font-medium",
        )}
      >
        {activity.label}
      </span>
      <span className="hidden text-[10px] text-muted-foreground sm:inline">
        W{lesson.week} · {lesson.dowLabel}
      </span>
      {state === "current" && (
        <Badge variant="secondary" className="text-[10px]">
          đang học
        </Badge>
      )}
      {completed && (
        <Badge variant="outline" className="text-[10px]">
          xong
        </Badge>
      )}
    </div>
  );
}
