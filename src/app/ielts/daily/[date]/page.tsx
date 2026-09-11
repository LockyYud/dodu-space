import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clusterById } from "@/lib/ielts/daily-prompts";
import { dailyEntryFor } from "@/server/ielts/daily";

export const dynamic = "force-dynamic";

/**
 * Bài của một ngày, mở từ ô lịch trên trang Viết mỗi ngày. Đọc lại bài cũ của
 * chính mình là động lực mạnh hơn con số chuỗi ngày.
 */
export default async function DailyEntryPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const entry = await dailyEntryFor(date);
  if (!entry) notFound();

  const cluster = clusterById(entry.cluster);

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-1">
        <Link
          href="/ielts/daily"
          className="text-sm text-primary hover:underline"
        >
          ← Viết mỗi ngày
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {cluster ? `${cluster.emoji} ${cluster.label}` : entry.cluster} ·{" "}
          {entry.date}
        </h1>
        <p className="text-sm text-muted-foreground">
          {entry.wordCount ?? "—"} từ ·{" "}
          {entry.density != null ? `${entry.density.toFixed(1)}` : "—"} lỗi /
          100 từ
        </p>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Đề</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{entry.promptText}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Bài bạn viết</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {entry.essay}
          </p>
        </CardContent>
      </Card>

      {entry.rewrite && (
        <Card className="border-emerald-500/40 bg-emerald-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bản sửa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {entry.rewrite}
            </p>
            {entry.strength && (
              <p className="text-sm text-muted-foreground">{entry.strength}</p>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
