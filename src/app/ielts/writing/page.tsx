import { WritingWorkbench } from "@/components/ielts/writing-workbench";
import { isLLMConfigured } from "@/lib/ielts/llm";

export const dynamic = "force-dynamic";

export default function WritingPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Writing</h1>
        <p className="text-sm text-muted-foreground">
          Nộp bài Task 1/2 → AI chấm theo 4 tiêu chí IELTS → chọn lỗi để đưa vào
          kho ôn tập.
        </p>
      </header>
      <WritingWorkbench configured={isLLMConfigured()} />
    </section>
  );
}
