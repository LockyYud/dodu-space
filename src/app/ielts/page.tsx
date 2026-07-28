import { desc } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

// Reads the DB per request — never prerender at build time.
export const dynamic = "force-dynamic";

export default async function IeltsDashboard() {
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
  const profile = learnerProfile();
  const recommendation = adaptiveRecommendation({
    bands,
    cards: allCards,
    dueCount: due.length,
    sessions,
  });

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            IELTS Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            {targetSummary(profile)} · {currentLesson.phaseLabel} · Bài{" "}
            {currentLesson.index}/{queue.totalCount}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          🔥 Streak {streak} ngày
        </Badge>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Lỗi đến hạn" value={due.length} href="/ielts/review" />
        <Stat label="Tổng lỗi" value={allCards.length} href="/ielts/errors" />
        <Stat label="Lỗi cứng đầu" value={stubborn} href="/ielts/errors" />
        <Stat
          label="Band gần nhất"
          value={band?.overall != null ? band.overall.toFixed(1) : "—"}
          href="/ielts/progress"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ActionCard
          href={recommendation.href}
          title={`Coach: ${recommendation.title}`}
          desc={recommendation.reason}
        />
        <ActionCard
          href="/ielts/today"
          title="Hôm nay"
          desc={`Bài ${currentLesson.index}: ${currentLesson.activity.label}.`}
        />
        <ActionCard
          href="/ielts/writing"
          title="Chấm Writing"
          desc="Nộp bài → AI chấm 4 tiêu chí → trích lỗi."
        />
        <ActionCard
          href="/ielts/track"
          title="Reading/Listening"
          desc="Screenshot kết quả → AI đọc điểm + lỗi."
        />
        <ActionCard
          href="/ielts/review"
          title="Ôn tập SRS"
          desc={`${due.length} lỗi đang chờ ôn hôm nay.`}
        />
        <ActionCard
          href="/ielts/speaking"
          title="Speaking"
          desc="Ghi buổi gia sư + lỗi vào SRS."
        />
        <ActionCard
          href="/ielts/progress"
          title="Tiến độ"
          desc="Biểu đồ band, streak, nhật ký buổi học."
        />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href?: string;
}) {
  const inner = (
    <Card>
      <CardContent className="py-4 text-center">
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
  return href ? (
    <Link href={href} className="block transition-opacity hover:opacity-80">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function ActionCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardContent className="space-y-1 py-4">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
