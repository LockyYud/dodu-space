import { ReviewSession } from "@/components/ielts/review-session";
import { getDueCards } from "@/server/ielts/reviews";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const cards = await getDueCards();
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Ôn tập (SRS)</h1>
        <p className="text-sm text-muted-foreground">
          Ôn lại lỗi của chính bạn theo lịch giãn cách. Lỗi cứng đầu (sai lặp)
          được ưu tiên trước.
        </p>
      </header>
      <ReviewSession initialCards={cards} />
    </section>
  );
}
