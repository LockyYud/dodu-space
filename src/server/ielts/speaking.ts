"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import {
  EVALUATION_METADATA_VERSION,
  type EvaluationMetadata,
  SPEAKING_RUBRIC_VERSION,
} from "@/lib/ielts/evaluation";
import type { SpeakingSession } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";

export interface SpeakingFeedback {
  /** A short overall observation, usually the old tutorNotes field. */
  summary: string;
  fluency_coherence?: string;
  lexical_resource?: string;
  grammatical_accuracy?: string;
  pronunciation?: string;
  next_steps?: string[];
}

export interface AddSpeakingInput {
  date?: string;
  durationMin?: number;
  /** Required for new captures; old rows may still have no transcript. */
  transcript?: string;
  /** Whether the third 4/3/2 attempt fit inside two minutes, when applicable. */
  fitInTwoMinutes?: boolean;
  /** Legacy free-text field, retained as the feedback summary. */
  tutorNotes?: string;
  feedback?: Partial<SpeakingFeedback>;
  bandEstimate?: number;
  bandFluencyCoherence?: number;
  bandLexicalResource?: number;
  bandGrammaticalAccuracy?: number;
  bandPronunciation?: number;
  bandOverall?: number;
  /** Human label such as "self" or a tutor's name. */
  evaluator?: string;
  /** Mistakes noticed during self-practice, to add to the SRS. */
  cards?: { front: string; back: string; explanation?: string }[];
}

function manualEvaluationMeta(evaluator?: string): EvaluationMetadata {
  return {
    version: EVALUATION_METADATA_VERSION,
    method: "manual",
    source: evaluator?.trim() || "self",
    stages: [
      {
        purpose: "speaking_evaluation",
        rubric_version: SPEAKING_RUBRIC_VERSION,
        sample_count: 1,
        evaluated_at: new Date().toISOString(),
      },
    ],
  };
}

function validateBand(value: number | undefined, label: string): void {
  if (value != null && (!Number.isFinite(value) || value < 0 || value > 9)) {
    throw new Error(`${label} phải nằm trong khoảng 0–9.`);
  }
}

function normalizedFeedback(
  input: AddSpeakingInput,
  notes: string,
): SpeakingFeedback {
  const feedback = input.feedback ?? {};
  const nextSteps = Array.isArray(feedback.next_steps)
    ? feedback.next_steps
        .filter((step): step is string => typeof step === "string")
        .map((step) => step.trim())
        .filter(Boolean)
        .slice(0, 5)
    : undefined;
  return {
    summary: notes,
    fluency_coherence: feedback.fluency_coherence?.trim() || undefined,
    lexical_resource: feedback.lexical_resource?.trim() || undefined,
    grammatical_accuracy: feedback.grammatical_accuracy?.trim() || undefined,
    pronunciation: feedback.pronunciation?.trim() || undefined,
    next_steps: nextSteps?.length ? nextSteps : undefined,
  };
}

export async function addSpeaking(input: AddSpeakingInput): Promise<{
  sessionId: number;
  cardsAdded: number;
}> {
  await requireIeltsUser();
  const tutorNotes = input.tutorNotes?.trim() ?? "";
  const transcript = input.transcript?.trim() ?? "";
  if (!transcript) {
    throw new Error(
      "Hãy lưu transcript của buổi Speaking trước khi ghi kết quả.",
    );
  }
  if (
    input.durationMin == null ||
    !Number.isFinite(input.durationMin) ||
    input.durationMin <= 0
  ) {
    throw new Error("Hãy nhập thời lượng buổi Speaking lớn hơn 0 phút.");
  }
  if (tutorNotes.length < 20) {
    throw new Error(
      "Hãy ghi ít nhất một nhận xét cụ thể của buổi Speaking (20 ký tự).",
    );
  }
  if (
    input.bandOverall == null ||
    input.bandFluencyCoherence == null ||
    input.bandLexicalResource == null ||
    input.bandGrammaticalAccuracy == null ||
    input.bandPronunciation == null
  ) {
    throw new Error("Hãy nhập Overall và đủ band của 4 tiêu chí Speaking.");
  }
  for (const [value, label] of [
    [input.bandEstimate, "Band"],
    [input.bandFluencyCoherence, "Fluency & Coherence"],
    [input.bandLexicalResource, "Lexical Resource"],
    [input.bandGrammaticalAccuracy, "Grammatical Range & Accuracy"],
    [input.bandPronunciation, "Pronunciation"],
    [input.bandOverall, "Overall"],
  ] as const) {
    validateBand(value, label);
  }

  const today = input.date ?? toISODate();
  const durationMin = Math.max(1, Math.round(input.durationMin));
  const notes = normalizedFeedback(input, tutorNotes);
  const cards = (input.cards ?? []).filter(
    (c) => c.front?.trim() && c.back?.trim(),
  );
  const evaluationMeta = manualEvaluationMeta(input.evaluator);

  const result = await db.transaction(async (tx) => {
    // Keep the progress row and speaking detail linked in the same transaction.
    const [study] = await tx
      .insert(schema.studySession)
      .values({
        date: today,
        skill: "speaking",
        // Preserve the existing self-practice accounting slot used by the
        // tutor-removal work; standalone captures and the daily drill share it.
        slot: "speak-drill",
        durationMin,
        bandEstimate: input.bandOverall ?? input.bandEstimate ?? null,
        notes: tutorNotes,
        status: "done",
      })
      .returning({ id: schema.studySession.id });

    const [row] = await tx
      .insert(schema.speakingSession)
      .values({
        date: today,
        durationMin,
        sessionId: study.id,
        transcript,
        fitInTwoMinutes: input.fitInTwoMinutes ?? null,
        bandFluencyCoherence: input.bandFluencyCoherence ?? null,
        bandLexicalResource: input.bandLexicalResource ?? null,
        bandGrammaticalAccuracy: input.bandGrammaticalAccuracy ?? null,
        bandPronunciation: input.bandPronunciation ?? null,
        bandOverall: input.bandOverall ?? input.bandEstimate ?? null,
        feedbackJson: JSON.stringify(notes),
        evaluationMetaJson: evaluationMeta,
        // Keep legacy readers populated while they migrate to feedbackJson.
        tutorNotes,
        bandEstimate: input.bandEstimate ?? input.bandOverall ?? null,
      })
      .returning({ id: schema.speakingSession.id });

    if (cards.length > 0) {
      await tx.insert(schema.errorCard).values(
        cards.map((c) => ({
          sourceType: "speaking" as const,
          sourceRef: `speaking_session:${row.id}`,
          errorType: "grammar" as const,
          front: c.front.trim(),
          back: c.back.trim(),
          explanation: c.explanation?.trim() ?? "",
          context: "Speaking tự luyện",
          dueDate: today,
          observedOn: today,
        })),
      );
    }

    return { studySessionId: study.id, speakingSessionId: row.id };
  });

  revalidatePath("/ielts");
  revalidatePath("/ielts/speaking");
  revalidatePath("/ielts/progress");
  revalidatePath("/ielts/review");
  revalidatePath("/ielts/today");
  // `sessionId` historically referred to the speaking_session row. Preserve
  // that action response while the row now also links back to study_session.
  return { sessionId: result.speakingSessionId, cardsAdded: cards.length };
}

export async function listSpeaking(): Promise<SpeakingSession[]> {
  return db
    .select()
    .from(schema.speakingSession)
    .orderBy(
      desc(schema.speakingSession.date),
      desc(schema.speakingSession.id),
    );
}
