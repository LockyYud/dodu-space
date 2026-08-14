import { WritingWorkbench } from "@/components/ielts/writing-workbench";
import { isLLMConfigured } from "@/lib/ielts/llm";
import { lessonSequence } from "@/lib/ielts/plan";

export const dynamic = "force-dynamic";

export default async function WritingPage({
  searchParams,
}: {
  searchParams?: Promise<{ lessonId?: string | string[] }>;
}) {
  const params = await searchParams;
  const lessonId = Array.isArray(params?.lessonId)
    ? params.lessonId[0]
    : params?.lessonId;
  const lesson = lessonId
    ? lessonSequence().find((item) => item.id === lessonId)
    : undefined;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Writing</h1>
        <p className="text-sm text-muted-foreground">
          Viết bài → nhận feedback → lưu 1–3 lỗi quan trọng. Kết quả sẽ được ghi
          vào buổi học hôm nay.
        </p>
      </header>
      <WritingWorkbench configured={isLLMConfigured()} lesson={lesson} />
    </section>
  );
}
