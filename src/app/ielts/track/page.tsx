import { TrackForm } from "@/components/ielts/track-form";
import { isLLMConfigured } from "@/lib/ielts/llm";
import { lessonSequence } from "@/lib/ielts/plan";
import { getReadingArticles } from "@/lib/ielts/reading";

export const dynamic = "force-dynamic";

export default async function TrackPage({
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
  const articles =
    lesson?.activity.skill === "listening" ? [] : await getReadingArticles(3);
  const lessonSources = (lesson?.activity.links ?? []).map((link) => ({
    title: link.label,
    url: link.url,
    source: "Nguồn luyện IELTS",
  }));
  const sources = [
    ...lessonSources,
    ...articles.map((article) => ({
      title: article.title,
      url: article.url,
      source: article.source,
      summary: article.summary,
      level: article.level,
    })),
  ];

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reading / Listening
        </h1>
        <p className="text-sm text-muted-foreground">
          Làm nguồn ngay trong app nếu nguồn cho phép nhúng, sau đó ghi kết quả
          và lý do sai để buổi luyện có thể cải thiện lần sau.
        </p>
      </header>
      <TrackForm
        configured={isLLMConfigured()}
        lesson={lesson}
        sources={sources}
      />
    </section>
  );
}
