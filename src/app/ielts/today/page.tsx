import Link from "next/link";
import { DailyInput } from "@/components/ielts/daily-input";
import { PhasePanel } from "@/components/ielts/phase-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWeek, phaseById, type SlotId } from "@/lib/ielts/plan";
import type { WeeklyItem } from "@/lib/ielts/progress";
import { loadToday } from "@/server/ielts/today";

export const dynamic = "force-dynamic";

const PACE_TONE = {
  "on-track": "text-emerald-600 dark:text-emerald-400",
  behind: "text-amber-600 dark:text-amber-400",
  "at-risk": "text-destructive",
  "no-exam": "text-muted-foreground",
} as const;

const SLOT_HREF: Partial<Record<SlotId, string>> = {
  writing: "/ielts/writing",
  rewrite: "/ielts/writing?rewrite=1",
  "timed-listening": "/ielts/track?kind=timed&skill=listening",
  "timed-reading": "/ielts/track?kind=timed&skill=reading",
  mock: "/ielts/track?kind=mock",
  tutor: "/ielts/speaking",
};

export default async function TodayPage() {
  const { progress, pace, dueCount, streak, profile } = await loadToday();

  const { phase, daily, weekly, exit, canAdvance, nextPhase, weekInPhase } =
    progress;
  const degraded = pace.degraded;
  const curriculum = phase.id === "format" ? formatWeek(weekInPhase) : null;
  const dailyDone = daily.filter((d) => d.done).length;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{phase.label}</Badge>
          <Badge variant="outline">Tuần {weekInPhase}</Badge>
          {streak > 0 && <Badge variant="outline">🔥 {streak} ngày</Badge>}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {dailyDone === daily.length
            ? "Hôm nay xong rồi."
            : "Hôm nay, làm gì?"}
        </h1>
        <p className="text-sm text-muted-foreground">{phase.goal}</p>
        <p className={`text-xs ${PACE_TONE[pace.status]}`}>{pace.message}</p>
      </header>

      {degraded && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="space-y-2 py-4">
            <p className="font-medium">Chế độ giữ nhịp</p>
            <p className="text-sm text-muted-foreground">
              14 ngày qua học quá thưa. Hôm nay chỉ cần phần hằng ngày bên dưới,
              phần tuần để đó. Một ngày ngắn vẫn là một ngày.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/40">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg">Mỗi ngày</CardTitle>
            <Badge
              variant={dailyDone === daily.length ? "secondary" : "outline"}
            >
              {dailyDone}/{daily.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {daily.map((item) =>
            item.key === "srs" ? (
              <div
                key={item.key}
                className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 ${
                  item.done ? "border-emerald-500/40 bg-emerald-500/5" : ""
                }`}
              >
                <div className="min-w-40 flex-1">
                  <p className="text-sm font-medium">
                    {item.done ? "✓ " : ""}
                    {item.label}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {dueCount > 0
                        ? `${dueCount} lỗi đến hạn`
                        : "không có lỗi đến hạn"}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{item.hint}</p>
                </div>
                <Link href="/ielts/review" prefetch={false}>
                  <Button size="sm" variant={item.done ? "outline" : "default"}>
                    {item.done ? "Ôn thêm" : "Ôn lỗi"}
                  </Button>
                </Link>
              </div>
            ) : (
              <DailyInput
                key={item.key}
                kind={item.key === "input-listen" ? "listening" : "reading"}
                label={item.label}
                targetMinutes={item.targetMinutes}
                doneMinutes={item.doneMinutes}
                done={item.done}
                hint={item.hint}
              />
            ),
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Trong tuần này</CardTitle>
          {curriculum && (
            <p className="text-sm text-muted-foreground">
              Dạng câu hỏi tuần {curriculum.week}: Reading {curriculum.reading}{" "}
              · Listening {curriculum.listening} · Writing {curriculum.writing}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {weekly.map((item) => (
            <WeeklyRow key={item.slot} item={item} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Điều kiện sang giai đoạn sau
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Giai đoạn chuyển khi bạn làm được, không phải khi hết tuần.
          </p>
        </CardHeader>
        <CardContent>
          <PhasePanel
            exit={exit}
            canAdvance={canAdvance}
            nextLabel={nextPhase ? phaseById(nextPhase).label : null}
          />
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Mục tiêu {profile.examGoal}.{" "}
        <Link href="/ielts/progress" className="text-primary hover:underline">
          Xem tiến độ
        </Link>{" "}
        ·{" "}
        <Link href="/ielts/settings" className="text-primary hover:underline">
          Hồ sơ học
        </Link>
      </p>
    </section>
  );
}

function WeeklyRow({ item }: { item: WeeklyItem }) {
  const complete = item.done >= item.target;
  const href = SLOT_HREF[item.slot];
  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 ${
        complete ? "border-emerald-500/40 bg-emerald-500/5" : ""
      }`}
    >
      <div className="min-w-48 flex-1">
        <p className="text-sm font-medium">
          {complete ? "✓ " : ""}
          {item.label}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {item.done}/{item.target} · ~{item.minutes} phút
          </span>
        </p>
        <p className="text-xs text-muted-foreground">{item.hint}</p>
      </div>
      {href && !complete && (
        <Link href={href} prefetch={false}>
          <Button size="sm" variant="outline">
            Bắt đầu
          </Button>
        </Link>
      )}
    </div>
  );
}
