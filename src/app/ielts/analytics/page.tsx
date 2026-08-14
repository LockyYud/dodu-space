import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLearningAnalytics } from "@/server/ielts/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const data = await getLearningAnalytics();
  const topTheme = data.errorThemes[0];
  const weakestCriterion = [...data.criteria]
    .filter((criterion) => criterion.value != null)
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))[0];

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <Badge variant="secondary">28 ngày gần nhất</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Learning analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Đọc tín hiệu để chọn buổi học tiếp theo, không phải để chạy theo số
          lượng bài.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric
          label="Ngày có học"
          value={`${data.activeDays}/28`}
          note="nhịp học"
        />
        <Metric
          label="Thời gian"
          value={`${data.minutes} phút`}
          note={`${data.sessions} attempts`}
        />
        <Metric
          label="Writing"
          value={data.writingOverall?.toFixed(1) ?? "—"}
          note={`${data.writingAttempts} attempts`}
        />
        <Metric
          label="Ôn lỗi"
          value={String(data.reviewsLast28)}
          note={`${data.dueCards} lỗi đến hạn`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-primary/25 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Nên làm gì tiếp?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-medium">
              {data.dueCards > 0
                ? `Ôn ${data.dueCards} lỗi đến hạn trước.`
                : weakestCriterion
                  ? `Ưu tiên ${weakestCriterion.label} trong Writing.`
                  : "Tạo attempt đầu tiên để app bắt đầu phân tích."}
            </p>
            <p className="text-sm text-muted-foreground">
              {data.dueCards > 0
                ? "Recall ngắn giúp lỗi cũ không quay lại trong attempt mới."
                : weakestCriterion
                  ? `Điểm trung bình 28 ngày: ${weakestCriterion.value?.toFixed(1)}. Chọn một repair tập trung đúng tiêu chí này.`
                  : "Sau một Writing hoặc Reading/Listening attempt, dashboard sẽ có dữ liệu thật."}
            </p>
            <Link href={data.dueCards > 0 ? "/ielts/review" : "/ielts/today"}>
              <Button>
                {data.dueCards > 0 ? "Ôn lỗi →" : "Bắt đầu phiên →"}
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Điểm nghẽn hiện tại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topTheme ? (
              <>
                <p className="text-lg font-medium">
                  {formatTheme(topTheme.label)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Xuất hiện trong {topTheme.count} lỗi đã lưu
                  {topTheme.lapses > 0
                    ? ` · quên lại ${topTheme.lapses} lần`
                    : ""}
                  .
                </p>
                <Link
                  href="/ielts/errors"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Xem các lỗi này →
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa đủ error card để tìm pattern. Hãy lưu 1–3 lỗi thật sau mỗi
                attempt.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Writing theo rubric</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.criteria.every((criterion) => criterion.value == null) ? (
            <p className="text-sm text-muted-foreground">
              Chưa có Writing được chấm trong 28 ngày gần nhất.
            </p>
          ) : (
            data.criteria.map((criterion) => (
              <Bar
                key={criterion.label}
                label={criterion.label}
                value={criterion.value}
              />
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Xu hướng Writing</CardTitle>
          </CardHeader>
          <CardContent>
            {data.writingTrend.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Chưa có dữ liệu band Writing.
              </p>
            ) : (
              <div className="flex h-36 items-end gap-2 border-b pb-1">
                {data.writingTrend.map((point, index) => (
                  <div
                    key={`${point.date}-${index}`}
                    className="flex min-w-0 flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-xs font-medium">
                      {point.value?.toFixed(1) ?? "—"}
                    </span>
                    <div
                      className="w-full rounded-t bg-primary/75"
                      style={{
                        height: `${Math.max(8, ((point.value ?? 0) / 9) * 100)}%`,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {point.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lỗi cần theo dõi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.errorThemes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Chưa có lỗi được lưu.
              </p>
            ) : (
              data.errorThemes.map((theme) => (
                <Bar
                  key={theme.label}
                  label={formatTheme(theme.label)}
                  value={theme.count + theme.lapses}
                  max={Math.max(
                    ...data.errorThemes.map((item) => item.count + item.lapses),
                  )}
                  suffix={`${theme.count} lỗi`}
                />
              ))
            )}
            {data.stubbornCards > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Có {data.stubbornCards} lỗi cứng đầu (sai lặp từ 3 lần).
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        <p className="mt-1 text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}

function Bar({
  label,
  value,
  max = 9,
  suffix,
}: {
  label: string;
  value: number | null;
  max?: number;
  suffix?: string;
}) {
  const percentage = value == null ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">
          {value == null ? "—" : (suffix ?? value.toFixed(1))}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function formatTheme(value: string): string {
  const [skill, type] = value.split(":");
  return `${skill === "writing" ? "Writing" : skill === "listening" ? "Listening" : skill === "reading" ? "Reading" : skill} · ${type}`;
}
