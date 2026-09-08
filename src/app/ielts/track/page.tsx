import { TrackForm } from "@/components/ielts/track-form";
import { isLLMConfigured } from "@/lib/ielts/llm";
import { getReadingArticles } from "@/lib/ielts/reading";
import type { TrackKind } from "@/server/ielts/track";

export const dynamic = "force-dynamic";

const KINDS: TrackKind[] = ["practice", "timed", "mock", "baseline"];

function firstParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TrackPage({
  searchParams,
}: {
  searchParams?: Promise<{
    kind?: string | string[];
    skill?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const kindParam = firstParam(params?.kind);
  const kind: TrackKind = KINDS.includes(kindParam as TrackKind)
    ? (kindParam as TrackKind)
    : "timed";
  const skillParam = firstParam(params?.skill);
  const skill = skillParam === "listening" ? "listening" : "reading";

  const articles = skill === "listening" ? [] : await getReadingArticles(3);
  const sources = articles.map((article) => ({
    title: article.title,
    url: article.url,
    source: article.source,
    summary: article.summary,
    level: article.level,
  }));

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reading / Listening
        </h1>
        <p className="text-sm text-muted-foreground">
          Làm đề ở nguồn ngoài, rồi ghi kết quả và lý do sai vào đây.
        </p>
      </header>
      <TrackForm
        configured={isLLMConfigured()}
        initialKind={kind}
        initialSkill={skill}
        sources={sources}
      />
    </section>
  );
}
