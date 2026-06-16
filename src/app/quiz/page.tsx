import { QuizListPage } from "@/components/quiz/quiz-list-page";
import { getAllChapterSummaries } from "@/lib/content/quiz";

export default async function QuizPage() {
  const chapters = await getAllChapterSummaries();
  return <QuizListPage chapters={chapters} />;
}
