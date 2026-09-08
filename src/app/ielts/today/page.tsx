import Link from "next/link";
import type { ReactNode } from "react";
import { DailyInput } from "@/components/ielts/daily-input";
import { DictationLog } from "@/components/ielts/dictation-log";
import { PhasePanel } from "@/components/ielts/phase-panel";
import { SlotLog } from "@/components/ielts/slot-log";
import { SpeakDrill } from "@/components/ielts/speak-drill";
import { VocabCapture } from "@/components/ielts/vocab-capture";
import { WeekLoadPicker } from "@/components/ielts/week-load-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatWeek,
  isSelfLoggable,
  phaseById,
  type SlotId,
  VOCAB_DAILY_TARGET,
  WEEKDAY_LABEL,
  WEEKDAY_MAX,
} from "@/lib/ielts/plan";
import type {
  DailyItem,
  TodayItem,
  WeekDayPlan,
  WeeklyItem,
} from "@/lib/ielts/progress";
import type { DueSplit } from "@/server/ielts/reviews";
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

/**
 * One line of today's run sheet.
 *
 * The page used to show a daily card and a weekly card of counters and let the
 * learner work out which of them was today's. That is the one decision the app
 * exists to make, so today is now a single ordered list and everything else is
 * folded away underneath it.
 */
interface Step {
  key: string;
  label: string;
  hint: string;
  minutes: number;
  done: boolean;
  blocked?: string;
  /** Vượt quỹ thời gian của buổi tối: làm được thì tốt, không thì để mai. */
  optional?: boolean;
  /**
   * Không ăn vào quỹ buổi tối — podcast nghe khi di chuyển. Cả phần tính giờ
   * của lộ trình cũng loại nó ra, nên trang phải loại giống hệt, bằng không nó
   * sẽ cắt mất việc mà lịch coi là vẫn trong quỹ.
   */
  offBudget?: boolean;
  action: ReactNode;
}

export default async function TodayPage() {
  const {
    progress,
    pace,
    hours,
    suggestedExam,
    due,
    vocabToday,
    streak,
    profile,
  } = await loadToday();

  const {
    phase,
    daily,
    weekly,
    exit,
    canAdvance,
    nextPhase,
    weekInPhase,
    weekday,
    load,
    todayWork,
    restDay,
    week,
    studyDaysThisWeek,
  } = progress;

  const curriculum = phase.id === "format" ? formatWeek(weekInPhase) : null;
  const metCount = exit.filter((e) => e.met).length;

  // SRS leads the session on purpose — its own instruction is "before
  // anything else" — and the daily habit comes before the week's assignment.
  const ordered = [...daily].sort(
    (a, b) => Number(b.key === "srs") - Number(a.key === "srs"),
  );
  const steps = [
    ...ordered.map((item) => dailyStep(item, due, vocabToday)),
    ...todayWork.map(workStep),
  ];
  // A blocked step is not something the learner can act on, so it never
  // becomes "the next thing" and never counts against the day.
  const remaining = steps.filter((s) => !s.done && !s.blocked);
  // Quỹ thời gian thật. `dailyMinutes` là buổi tối ngày thường sau khi đi làm;
  // cuối tuần rộng hơn nên không cắt. Trước đây trường này nằm trong hồ sơ mà
  // không chỗ nào đọc, nên lịch có thể đòi 100 phút mà app vẫn im lặng.
  const budget = weekday <= WEEKDAY_MAX ? profile.dailyMinutes : null;
  let spent = 0;
  const withinBudget = new Set<string>();
  for (const step of steps) {
    if (step.done || step.blocked || step.offBudget) continue;
    if (budget !== null && spent > 0 && spent + step.minutes > budget) continue;
    spent += step.minutes;
    withinBudget.add(step.key);
  }
  for (const step of steps) {
    if (
      !step.done &&
      !step.blocked &&
      !step.offBudget &&
      !withinBudget.has(step.key)
    ) {
      step.optional = true;
    }
  }

  const core = remaining.filter((s) => !s.optional);
  const overflow = remaining.filter((s) => s.optional);
  const coreMinutes = core
    .filter((s) => !s.offBudget)
    .reduce((sum, s) => sum + s.minutes, 0);

  // Chỉ đánh số việc còn phải làm. Việc đã xong mang dấu ✓, việc bị chặn mang
  // dấu –, và nếu chúng vẫn chiếm số thì danh sách nhảy cóc 3 → 6 — đọc như thể
  // có hai việc bị mất.
  const numbering = new Map(core.map((s, i) => [s.key, i + 1]));
  const allDone = remaining.length === 0;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{phase.label}</Badge>
          <Badge variant="outline">Tuần {weekInPhase}</Badge>
          {streak > 0 && <Badge variant="outline">🔥 {streak} ngày</Badge>}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {allDone
            ? "Hôm nay xong rồi."
            : restDay
              ? `${WEEKDAY_LABEL[weekday]} — ngày nhẹ`
              : WEEKDAY_LABEL[weekday]}
        </h1>
        <p className="text-sm text-muted-foreground">{phase.goal}</p>
        <p className={`text-xs ${PACE_TONE[pace.status]}`}>
          {pace.message}
          {!profile.examDate && (
            <>
              {` Sớm nhất nên là ${suggestedExam}. `}
              <Link
                href="/ielts/settings"
                className="text-primary underline underline-offset-2"
              >
                Đặt ngày thi
              </Link>
            </>
          )}
        </p>
      </header>

      {!hours.fullyFunded && (
        <Card
          className={
            hours.funded
              ? "border-amber-500/40 bg-amber-500/5"
              : "border-destructive/40 bg-destructive/5"
          }
        >
          <CardContent className="space-y-2 py-4">
            <p className="font-medium">
              {hours.funded ? "Quỹ giờ sát mép" : "Quỹ giờ chưa đủ"}
            </p>
            <p className="text-sm text-muted-foreground">{hours.message}</p>
            <p className="text-xs text-muted-foreground">
              Ba cách xoay: học đều hơn mỗi tuần, lùi ngày thi, hoặc hạ mục
              tiêu.{" "}
              <Link
                href="/ielts/settings"
                className="text-primary underline underline-offset-2"
              >
                Sửa mục tiêu
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      {pace.degraded && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="space-y-2 py-4">
            <p className="font-medium">Chế độ giữ nhịp</p>
            <p className="text-sm text-muted-foreground">
              14 ngày qua học quá thưa. Hạ tuần này xuống “Tuần bận” và chỉ giữ
              bốn buổi lõi. Một ngày ngắn vẫn là một ngày.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/40">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <CardTitle className="text-lg">
              {allDone ? "Đã xong hết" : "Làm theo thứ tự này"}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {allDone
                ? `${steps.length} việc`
                : `còn ${core.length} việc · ~${coreMinutes} phút ngồi`}
            </span>
          </div>
          {restDay && !allDone && (
            <p className="text-sm text-muted-foreground">
              Lịch tuần không xếp buổi nào hôm nay. Chỉ cần phần hằng ngày.
            </p>
          )}
          {overflow.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Cắt theo quỹ {profile.dailyMinutes} phút mỗi tối của bạn.{" "}
              {overflow.length} việc dưới cùng để dành, làm được thì tốt.
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {steps.map((step) => (
            <StepRow
              key={step.key}
              step={step}
              index={numbering.get(step.key) ?? 0}
              next={core[0]?.key === step.key}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <CardTitle className="text-lg">Tuần này</CardTitle>
            <span className="text-sm text-muted-foreground">
              {studyDaysThisWeek} buổi
            </span>
          </div>
          {curriculum && (
            <p className="text-sm text-muted-foreground">
              Dạng câu hỏi tuần {curriculum.week}: Reading {curriculum.reading}{" "}
              · Listening {curriculum.listening} · Writing {curriculum.writing}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-7 gap-1">
            {week.map((day) => (
              <DayCell key={day.day} day={day} />
            ))}
          </div>
          <WeekLoadPicker current={load} />
          <details>
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Đếm theo tuần
            </summary>
            <div className="mt-3 space-y-2">
              {weekly.map((item) => (
                <WeeklyRow key={item.slot} item={item} />
              ))}
            </div>
          </details>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4">
          <details open={metCount > 0}>
            <summary className="cursor-pointer list-none">
              <span className="text-base font-semibold">
                Điều kiện sang giai đoạn sau
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                {metCount}/{exit.length} đã đạt
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                Giai đoạn chuyển khi bạn làm được, không phải khi hết tuần.
              </p>
            </summary>
            <div className="mt-4">
              <PhasePanel
                exit={exit}
                canAdvance={canAdvance}
                nextLabel={nextPhase ? phaseById(nextPhase).label : null}
              />
            </div>
          </details>
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

function dailyStep(item: DailyItem, due: DueSplit, vocabToday: number): Step {
  if (item.key === "vocab") {
    return {
      key: item.key,
      label: item.label,
      hint: item.hint,
      minutes: item.targetMinutes,
      done: vocabToday >= VOCAB_DAILY_TARGET,
      action: (
        <VocabCapture todayCount={vocabToday} target={VOCAB_DAILY_TARGET} />
      ),
    };
  }
  if (item.key === "speak-drill") {
    return {
      key: item.key,
      label: item.label,
      hint: item.hint,
      minutes: item.targetMinutes,
      done: item.done,
      action: <SpeakDrill minutes={item.targetMinutes} done={item.done} />,
    };
  }
  if (item.key === "srs") {
    return {
      key: item.key,
      label: item.label,
      hint:
        due.total > 0
          ? `${dueLabel(due)} đến hạn. ${item.hint}`
          : "Không có thẻ nào đến hạn hôm nay.",
      minutes: item.targetMinutes,
      done: item.done,
      action: (
        <Link href="/ielts/review" prefetch={false}>
          <Button size="sm" variant={item.done ? "outline" : "default"}>
            {item.done ? "Ôn thêm" : "Ôn lỗi"}
          </Button>
        </Link>
      ),
    };
  }
  return {
    key: item.key,
    label: item.label,
    hint: item.hint,
    minutes: item.targetMinutes,
    done: item.done,
    offBudget: item.key === "input-listen",
    action: (
      <DailyInput
        kind={item.key === "input-listen" ? "listening" : "reading"}
        label={item.label}
        targetMinutes={item.targetMinutes}
        doneMinutes={item.doneMinutes}
        done={item.done}
        hint={item.hint}
        compact
      />
    ),
  };
}

/** "3 lỗi · 5 từ", hoặc chỉ một vế khi vế kia trống. */
function dueLabel(due: DueSplit): string {
  const parts: string[] = [];
  if (due.errors > 0) parts.push(`${due.errors} lỗi`);
  if (due.vocab > 0) parts.push(`${due.vocab} từ`);
  return parts.join(" · ");
}

function workStep(item: TodayItem): Step {
  const href = item.blocked ? "/ielts/writing" : SLOT_HREF[item.slot];
  return {
    key: item.key,
    label: item.label,
    hint: item.blocked ?? item.hint,
    minutes: item.minutes,
    done: item.done,
    blocked: item.blocked,
    action:
      item.slot === "dictation" ? (
        <DictationLog done={item.done} />
      ) : href ? (
        <Link href={href} prefetch={false}>
          <Button size="sm" variant={item.done ? "outline" : "default"}>
            {item.blocked ? "Viết bài mới" : item.done ? "Làm thêm" : "Bắt đầu"}
          </Button>
        </Link>
      ) : isSelfLoggable(item.slot) ? (
        <SlotLog slot={item.slot} minutes={item.minutes} done={item.done} />
      ) : null,
  };
}

function StepRow({
  step,
  index,
  next,
}: {
  step: Step;
  index: number;
  next: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 ${
        step.done
          ? "border-emerald-500/40 bg-emerald-500/5"
          : step.blocked || step.optional
            ? "border-dashed"
            : next
              ? "border-primary/50 bg-primary/5"
              : ""
      }`}
    >
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
          step.done
            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {step.done ? "✓" : step.blocked ? "–" : step.optional ? "+" : index}
      </span>
      <div className="min-w-40 flex-1">
        <p className="text-sm font-medium">
          {step.label}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ~{step.minutes} phút
            {step.optional ? " · nếu còn thời gian" : ""}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">{step.hint}</p>
      </div>
      {step.action}
    </div>
  );
}

function DayCell({ day }: { day: WeekDayPlan }) {
  const rest = day.items.length === 0;
  const tone = day.done
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    : day.isToday
      ? "border-primary bg-primary/10 font-medium"
      : rest
        ? "border-dashed text-muted-foreground/60"
        : "text-muted-foreground";
  return (
    <div
      title={
        rest ? `${day.label}: nghỉ` : `${day.label}: ${labelsOf(day.items)}`
      }
      className={`rounded-md border px-1 py-2 text-center text-xs ${tone}`}
    >
      <div>{day.short}</div>
      <div className="mt-0.5 text-[10px] leading-tight">
        {rest ? "—" : day.done ? "✓" : `${day.items.length} việc`}
      </div>
    </div>
  );
}

function labelsOf(items: TodayItem[]): string {
  return items.map((i) => i.label).join(", ");
}

function WeeklyRow({ item }: { item: WeeklyItem }) {
  const complete = item.done >= item.target;
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className={complete ? "text-muted-foreground" : ""}>
        {item.label}
      </span>
      <span
        className={
          complete
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground"
        }
      >
        {item.done}/{item.target}
      </span>
    </div>
  );
}
