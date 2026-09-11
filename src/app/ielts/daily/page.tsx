import { DailyWriter } from "@/components/ielts/daily-writer";
import { loadDaily } from "@/server/ielts/daily";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  const view = await loadDaily();

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Viết mỗi ngày</h1>
        <p className="text-sm text-muted-foreground">
          Quay một câu hỏi đời sống, viết 5–10 phút. Không chấm band — chỉ lỗi,
          bản viết lại, và lỗi/100 từ để nhìn tiến bộ.
        </p>
      </header>
      <DailyWriter view={view} />
    </section>
  );
}
