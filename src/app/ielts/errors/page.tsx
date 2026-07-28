import { ErrorList } from "@/components/ielts/error-list";
import { toISODate } from "@/lib/ielts/srs";
import { listCards } from "@/server/ielts/errors";

export const dynamic = "force-dynamic";

export default async function ErrorsPage() {
  const cards = await listCards();
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Kho lỗi</h1>
        <p className="text-sm text-muted-foreground">
          Toàn bộ lỗi đã lưu. Lỗi sai lặp ≥ 3 lần được đánh dấu "cứng đầu".
        </p>
      </header>
      <ErrorList cards={cards} today={toISODate()} />
    </section>
  );
}
