import { TrackForm } from "@/components/ielts/track-form";
import { isLLMConfigured } from "@/lib/ielts/llm";

export const dynamic = "force-dynamic";

export default function TrackPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reading / Listening
        </h1>
        <p className="text-sm text-muted-foreground">
          Làm bài ở nguồn ngoài → chụp màn hình kết quả → AI đọc điểm + gợi ý
          lỗi, hoặc nhập tay. Lỗi được đưa vào kho ôn tập.
        </p>
      </header>
      <TrackForm configured={isLLMConfigured()} />
    </section>
  );
}
