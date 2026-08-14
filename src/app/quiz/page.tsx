import { QuizListPage } from "@/components/quiz/quiz-list-page";
import { requireIeltsUser } from "@/lib/auth/guard";
import { getAllChapterSummaries } from "@/lib/content/quiz";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  await requireIeltsUser();
  const chapters = await getAllChapterSummaries();
  return <QuizListPage chapters={chapters} />;
}
