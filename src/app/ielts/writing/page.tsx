import { WritingWorkbench } from "@/components/ielts/writing-workbench";
import { isLLMConfigured } from "@/lib/ielts/llm";
import { pickPrompt, promptById } from "@/lib/ielts/prompts";
import { loadProgress } from "@/server/ielts/progress";
import {
  getRewriteSource,
  latestRewritableSubmission,
  usedPromptIds,
} from "@/server/ielts/writing";

export const dynamic = "force-dynamic";

function firstParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WritingPage({
  searchParams,
}: {
  searchParams?: Promise<{
    rewrite?: string | string[];
    rewriteOf?: string | string[];
    promptId?: string | string[];
    kind?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const [progress, used] = await Promise.all([loadProgress(), usedPromptIds()]);

  // A rewrite opens the exact piece it fixes; leaving the learner to find it
  // turned the rewrite step into "write something new again".
  const explicitId = Number(firstParam(params?.rewriteOf));
  const wantsRewrite = firstParam(params?.rewrite) === "1";
  const rewriteSource = Number.isFinite(explicitId)
    ? await getRewriteSource(explicitId)
    : wantsRewrite
      ? await latestRewritableSubmission()
      : null;

  const kindParam = firstParam(params?.kind);
  const kind =
    kindParam === "task1" || kindParam === "task2" || kindParam === "free"
      ? kindParam
      : undefined;

  const requestedPrompt = firstParam(params?.promptId);
  const prompt = rewriteSource
    ? rewriteSource.prompt
      ? {
          id: "",
          kind: rewriteSource.taskType,
          topic: rewriteSource.topic ?? "",
          text: rewriteSource.prompt,
          words: rewriteSource.wordCount ?? 0,
        }
      : null
    : ((requestedPrompt ? promptById(requestedPrompt) : null) ??
      pickPrompt(progress.phase.id, used, kind));

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {rewriteSource ? "Viết lại" : "Writing"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {rewriteSource
            ? "Sửa lại bài đã được góp ý. Mục tiêu là ít lỗi hơn bản trước."
            : progress.phase.gradingMode === "coach"
              ? "Giai đoạn này chưa chấm band. Bạn viết, app chỉ ra lỗi ngôn ngữ và một việc cần sửa tiếp."
              : "Viết đúng giờ, nhận band theo bốn tiêu chí và lưu 1–3 lỗi quan trọng."}
        </p>
      </header>
      <WritingWorkbench
        configured={isLLMConfigured()}
        phaseLabel={progress.phase.label}
        mode={progress.phase.gradingMode}
        prompt={prompt}
        rewriteSource={rewriteSource}
      />
    </section>
  );
}
