import { desc } from "drizzle-orm";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Mic,
  PenLine,
  Target,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db, schema } from "@/lib/ielts/db";
import { adaptiveRecommendation } from "@/lib/ielts/insights";
import { lessonQueueStatus } from "@/lib/ielts/plan";
import { learnerProfile, targetSummary } from "@/lib/ielts/profile";
import { isStubborn } from "@/lib/ielts/srs";
import { listBands } from "@/server/ielts/bands";
import { listCompletedLessonIds } from "@/server/ielts/lessons";
import { getDueCards } from "@/server/ielts/reviews";
import { getStreak, listSessions } from "@/server/ielts/sessions";

export const dynamic = "force-dynamic";

export default function IeltsHome() {
  redirect("/ielts/today");
}

// Kept as a direct URL for the compact metrics view, but the learner's home
// is now the actionable Today session.
async function _IeltsDashboard() {
  const [due, allCards, latestBand, streak] = await Promise.all([
    getDueCards(),
    db.select().from(schema.errorCard),
    db
      .select()
      .from(schema.bandHistory)
      .orderBy(desc(schema.bandHistory.date))
      .limit(1),
    getStreak(),
  ]);
  const [bands, sessions, completedLessons] = await Promise.all([
    listBands(),
    listSessions(14),
    listCompletedLessonIds(),
  ]);

  const stubborn = allCards.filter((c) => isStubborn(c.lapses)).length;
  const band = latestBand[0];
  const queue = lessonQueueStatus(completedLessons);
  const currentLesson = queue.current;
  const profile = await learnerProfile();
  const [recommendation, profileSummary] = await Promise.all([
    adaptiveRecommendation({
      bands,
      cards: allCards,
      dueCount: due.length,
      sessions,
    }),
    targetSummary(profile),
  ]);

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            IELTS Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            {profileSummary} · {currentLesson.phaseLabel} · Bài{" "}
            {currentLesson.index}/{queue.totalCount}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1 text-xs">
            <Flame className="size-3" />
            Streak {streak} ngày
          </Badge>
          <Badge variant="outline" className="text-xs">
            {queue.percent}% lộ trình
          </Badge>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="space-y-5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <Badge variant="secondary" className="gap-1 text-[11px]">
                  <Target className="size-3" />
                  Việc cần làm tiếp theo
                </Badge>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Bài {currentLesson.index}: {currentLesson.activity.label}
                  </h2>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    {currentLesson.activity.focus}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[11px]">
                ~{currentLesson.activity.minutes} phút
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-background/70">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${queue.percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {queue.completedCount}/{queue.totalCount} bài đã hoàn thành
                </span>
                <span>{queue.percent}%</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/ielts/today" prefetch={false}>
                <Button size="lg" className="gap-2">
                  Tiếp tục bài học
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              {due.length > 0 && (
                <Link href="/ielts/review" prefetch={false}>
                  <Button variant="outline" size="lg" className="gap-2">
                    Ôn {due.length} lỗi sau bài học
                    <CheckCircle2 className="size-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-primary" />
              <h2 className="font-medium">Coach nhắc nhẹ</h2>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{recommendation.title}</p>
              <p className="text-sm text-muted-foreground">
                {recommendation.reason}
              </p>
            </div>
            <Link href={recommendation.href} prefetch={false}>
              <Button variant="outline" className="w-full gap-2">
                Xem phần liên quan
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={<Clock className="size-4" />}
          label="Bài hiện tại"
          value={currentLesson.index}
          href="/ielts/today"
        />
        <Stat
          icon={<CheckCircle2 className="size-4" />}
          label="Lỗi đến hạn"
          value={due.length}
          href="/ielts/review"
        />
        <Stat
          icon={<AlertCircle className="size-4" />}
          label="Lỗi cứng đầu"
          value={stubborn}
          href="/ielts/errors"
        />
        <Stat
          icon={<BarChart3 className="size-4" />}
          label="Band gần nhất"
          value={band?.overall != null ? band.overall.toFixed(1) : "—"}
          href="/ielts/progress"
        />
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-base font-medium">Công cụ khi cần</h2>
          <p className="text-xs text-muted-foreground">
            Dùng sau khi hoàn thành bài học hoặc có dữ liệu mới.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ToolCard
            href="/ielts/writing"
            icon={<PenLine className="size-4" />}
            title="Chấm Writing"
            desc="Khi bài hôm nay yêu cầu Task 1/2 hoặc bạn muốn chấm thêm."
          />
          <ToolCard
            href="/ielts/track"
            icon={<Upload className="size-4" />}
            title="Log Reading/Listening"
            desc="Khi vừa làm đề ngoài và cần lưu điểm, screenshot, lỗi."
          />
          <ToolCard
            href="/ielts/speaking"
            icon={<Mic className="size-4" />}
            title="Ghi Speaking"
            desc="Sau buổi gia sư, lưu note và lỗi được sửa."
          />
          <ToolCard
            href="/ielts/progress"
            icon={<BookOpen className="size-4" />}
            title="Xem tiến độ"
            desc="Khi muốn nhìn band, streak và nhật ký học."
          />
        </div>
      </section>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  href?: string;
}) {
  const inner = (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xl font-semibold tabular-nums">{value}</div>
          <div className="text-[11px] text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
  return href ? (
    <Link
      href={href}
      prefetch={false}
      className="block transition-opacity hover:opacity-80"
    >
      {inner}
    </Link>
  ) : (
    inner
  );
}

function ToolCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} prefetch={false} className="block">
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardContent className="space-y-2 p-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{icon}</span>
            <p className="font-medium">{title}</p>
          </div>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
