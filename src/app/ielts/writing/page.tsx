import { WritingWorkbench } from "@/components/ielts/writing-workbench";
import { isLLMConfigured } from "@/lib/ielts/llm";
import { findLesson } from "@/lib/ielts/plan";
import {
  getRewriteSource,
  latestRewritableSubmission,
  minimumWordsForLesson,
} from "@/server/ielts/writing";

export const dynamic = "force-dynamic";

function firstParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WritingPage({
  searchParams,
}: {
  searchParams?: Promise<{
    lessonId?: string | string[];
    rewriteOf?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const lessonId = firstParam(params?.lessonId);
  const lesson = lessonId ? findLesson(lessonId) : undefined;

  // A rewrite lesson opens the essay it is meant to fix, so the learner never
  // has to go hunting for it — the rewrite step is the one that moves the band.
  const explicitRewriteId = Number(firstParam(params?.rewriteOf));
  const rewriteSource = Number.isFinite(explicitRewriteId)
    ? await getRewriteSource(explicitRewriteId)
    : lesson?.activity.kind === "rewrite"
      ? await latestRewritableSubmission()
      : null;

  const taskType = lesson?.activity.label.includes("Task 1")
    ? "task1"
    : "task2";
  const minimumWords = await minimumWordsForLesson(taskType, lessonId);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {rewriteSource ? "Viết lại" : "Writing"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {rewriteSource
            ? "Sửa lại bài đã được chấm. So band trước và sau để thấy điều gì thực sự thay đổi."
            : "Viết bài → nhận feedback → lưu 1–3 lỗi quan trọng. Kết quả sẽ được ghi vào buổi học hôm nay."}
        </p>
      </header>
      <WritingWorkbench
        configured={isLLMConfigured()}
        lesson={lesson}
        rewriteSource={rewriteSource}
        minimumWords={minimumWords}
      />
    </section>
  );
}
