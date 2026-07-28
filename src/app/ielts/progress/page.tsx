import { BandChart } from "@/components/ielts/band-chart";
import { BandForm } from "@/components/ielts/band-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonQueueStatus } from "@/lib/ielts/plan";
import { listBands } from "@/server/ielts/bands";
import { listCompletedLessonIds } from "@/server/ielts/lessons";
import { getStreak, listSessions } from "@/server/ielts/sessions";

export const dynamic = "force-dynamic";

const SKILL_EMOJI: Record<string, string> = {
  writing: "✍️",
  reading: "📖",
  listening: "👂",
  speaking: "🗣️",
  vocab: "🧠",
};

export default async function ProgressPage() {
  const [bands, sessions, streak, completedLessons] = await Promise.all([
    listBands(),
    listSessions(30),
    getStreak(),
    listCompletedLessonIds(),
  ]);
  const queue = lessonQueueStatus(completedLessons);
  const currentLesson = queue.current;
  const latest = bands[0];

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Tiến độ</h1>
        <p className="text-sm text-muted-foreground">
          {currentLesson.phaseLabel} · Bài {currentLesson.index}/
          {queue.totalCount} · streak {streak} ngày
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Streak" value={`${streak}🔥`} />
        <Stat label="Buổi học" value={sessions.length} />
        <Stat
          label="Bài học"
          value={`${queue.completedCount}/${queue.totalCount}`}
        />
        <Stat
          label="Overall gần nhất"
          value={latest?.overall != null ? latest.overall.toFixed(1) : "—"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Band overall theo thời gian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BandChart history={bands} />
          <BandForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nhật ký buổi học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có buổi nào.</p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm"
            >
              <span>{SKILL_EMOJI[s.skill] ?? "•"}</span>
              <span className="w-24 text-muted-foreground">{s.date}</span>
              <Badge variant="outline" className="text-[10px]">
                {s.skill}
              </Badge>
              {s.rawScore && (
                <span className="text-muted-foreground">{s.rawScore}</span>
              )}
              {s.bandEstimate != null && (
                <span className="text-muted-foreground">
                  band {s.bandEstimate.toFixed(1)}
                </span>
              )}
              {s.notes && (
                <span className="truncate text-muted-foreground">
                  — {s.notes}
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="py-4 text-center">
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
