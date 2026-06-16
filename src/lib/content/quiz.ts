import fs from "node:fs/promises";
import path from "node:path";

import {
  parseMCQ,
  parseShortAnswer,
  type MCQQuestion,
  type ShortAnswerQuestion,
} from "@/lib/content/quiz-parser";

const QUIZ_DIR = path.join(process.cwd(), "content/blog/rl-book-quiz");
const SA_DIR = path.join(QUIZ_DIR, "short-answer");

export type ChapterMeta = {
  chapterNum: number;
  slug: string;
  title: string;
  part: "I" | "II" | "III";
  partTitle: string;
};

export const CHAPTER_META: ChapterMeta[] = [
  {
    chapterNum: 1,
    slug: "ch01-introduction",
    title: "Introduction",
    part: "I",
    partTitle: "Tabular Solution Methods",
  },
  {
    chapterNum: 2,
    slug: "ch02-multi-armed-bandits",
    title: "Multi-armed Bandits",
    part: "I",
    partTitle: "Tabular Solution Methods",
  },
  {
    chapterNum: 3,
    slug: "ch03-finite-mdps",
    title: "Finite Markov Decision Processes",
    part: "I",
    partTitle: "Tabular Solution Methods",
  },
  {
    chapterNum: 4,
    slug: "ch04-dynamic-programming",
    title: "Dynamic Programming",
    part: "I",
    partTitle: "Tabular Solution Methods",
  },
  {
    chapterNum: 5,
    slug: "ch05-monte-carlo",
    title: "Monte Carlo Methods",
    part: "I",
    partTitle: "Tabular Solution Methods",
  },
  {
    chapterNum: 6,
    slug: "ch06-temporal-difference",
    title: "Temporal-Difference Learning",
    part: "I",
    partTitle: "Tabular Solution Methods",
  },
  {
    chapterNum: 7,
    slug: "ch07-n-step-bootstrapping",
    title: "n-step Bootstrapping",
    part: "I",
    partTitle: "Tabular Solution Methods",
  },
  {
    chapterNum: 8,
    slug: "ch08-planning-learning",
    title: "Planning and Learning with Tabular Methods",
    part: "I",
    partTitle: "Tabular Solution Methods",
  },
  {
    chapterNum: 9,
    slug: "ch09-on-policy-prediction-approx",
    title: "On-policy Prediction with Approximation",
    part: "II",
    partTitle: "Approximate Solution Methods",
  },
  {
    chapterNum: 10,
    slug: "ch10-on-policy-control-approx",
    title: "On-policy Control with Approximation",
    part: "II",
    partTitle: "Approximate Solution Methods",
  },
  {
    chapterNum: 11,
    slug: "ch11-off-policy-approx",
    title: "Off-policy Methods with Approximation",
    part: "II",
    partTitle: "Approximate Solution Methods",
  },
  {
    chapterNum: 12,
    slug: "ch12-eligibility-traces",
    title: "Eligibility Traces",
    part: "II",
    partTitle: "Approximate Solution Methods",
  },
  {
    chapterNum: 13,
    slug: "ch13-policy-gradient",
    title: "Policy Gradient Methods",
    part: "II",
    partTitle: "Approximate Solution Methods",
  },
  {
    chapterNum: 14,
    slug: "ch14-psychology",
    title: "Psychology",
    part: "III",
    partTitle: "Looking Deeper",
  },
  {
    chapterNum: 15,
    slug: "ch15-neuroscience",
    title: "Neuroscience",
    part: "III",
    partTitle: "Looking Deeper",
  },
  {
    chapterNum: 16,
    slug: "ch16-applications",
    title: "Applications and Case Studies",
    part: "III",
    partTitle: "Looking Deeper",
  },
  {
    chapterNum: 17,
    slug: "ch17-frontiers",
    title: "Frontiers",
    part: "III",
    partTitle: "Looking Deeper",
  },
];

export type ChapterQuiz = ChapterMeta & {
  mcqQuestions: MCQQuestion[];
  shortAnswerQuestions: ShortAnswerQuestion[];
};

export type ChapterSummary = ChapterMeta & {
  mcqCount: number;
  saCount: number;
};

export async function getChapterQuiz(
  slug: string,
): Promise<ChapterQuiz | null> {
  const meta = CHAPTER_META.find((c) => c.slug === slug);
  if (!meta) return null;

  const mcqPath = path.join(QUIZ_DIR, `${slug}.md`);
  const saPath = path.join(SA_DIR, `${slug}.md`);

  const [mcqContent, saContent] = await Promise.all([
    fs.readFile(mcqPath, "utf8").catch(() => ""),
    fs.readFile(saPath, "utf8").catch(() => ""),
  ]);

  return {
    ...meta,
    mcqQuestions: parseMCQ(mcqContent, slug),
    shortAnswerQuestions: parseShortAnswer(saContent, slug),
  };
}

export async function getAllChapterSummaries(): Promise<ChapterSummary[]> {
  return Promise.all(
    CHAPTER_META.map(async (meta) => {
      const quiz = await getChapterQuiz(meta.slug);
      return {
        ...meta,
        mcqCount: quiz?.mcqQuestions.length ?? 0,
        saCount: quiz?.shortAnswerQuestions.length ?? 0,
      };
    }),
  );
}
