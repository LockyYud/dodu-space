"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { benchmarkScoreError } from "@/lib/ielts/benchmarks";
import { db, schema } from "@/lib/ielts/db";
import { type ActionResult, fail, ok } from "@/lib/ielts/result";
import {
  EXTERNAL_BENCHMARK_PROVIDERS,
  type ExternalBenchmarkProvider,
} from "@/lib/ielts/schema";

export interface AddExternalBenchmarkInput {
  provider: ExternalBenchmarkProvider;
  date: string;
  readingRaw?: number | null;
  listeningRaw?: number | null;
  writingRaw?: number | null;
  speakingRaw?: number | null;
  overallRaw?: number | null;
  sectionScores?: Record<string, number> | null;
  cefr?: string | null;
  sourceUrl?: string | null;
  notes?: string | null;
}

export async function listExternalBenchmarks() {
  await requireIeltsUser();
  return db
    .select()
    .from(schema.externalBenchmark)
    .orderBy(
      desc(schema.externalBenchmark.date),
      desc(schema.externalBenchmark.id),
    );
}

export async function addExternalBenchmark(
  input: AddExternalBenchmarkInput,
): Promise<ActionResult<null>> {
  await requireIeltsUser();
  if (!EXTERNAL_BENCHMARK_PROVIDERS.includes(input.provider)) {
    return fail("Nguồn benchmark không hợp lệ.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    return fail("Ngày benchmark phải có dạng YYYY-MM-DD.");
  }
  const scores = [
    input.readingRaw,
    input.listeningRaw,
    input.writingRaw,
    input.speakingRaw,
    input.overallRaw,
  ];
  const scoreError = benchmarkScoreError({
    scores,
    sectionScores: input.sectionScores,
  });
  if (scoreError) return fail(scoreError);
  await db.insert(schema.externalBenchmark).values({
    provider: input.provider,
    date: input.date,
    readingRaw: input.readingRaw ?? null,
    listeningRaw: input.listeningRaw ?? null,
    writingRaw: input.writingRaw ?? null,
    speakingRaw: input.speakingRaw ?? null,
    overallRaw: input.overallRaw ?? null,
    sectionScoresJson: input.sectionScores ?? null,
    cefr: input.cefr?.trim() || null,
    sourceUrl: input.sourceUrl?.trim() || null,
    notes: input.notes?.trim() || null,
  });
  revalidatePath("/ielts/settings");
  return ok(null);
}
