"use server";

import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { overallOf } from "@/lib/ielts/bands";
import { db, schema } from "@/lib/ielts/db";
import type { ErrorType, Skill } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";
import { parseScreenshot, type ScreenshotResult } from "@/lib/ielts/vision";

/** Parse a Reading/Listening result screenshot (data URL) via the vision model. */
export async function parseScreenshotAction(
  dataUrl: string,
): Promise<ScreenshotResult> {
  await requireIeltsUser();
  return parseScreenshot(dataUrl);
}

export type TrackKind = "practice" | "timed" | "mock" | "baseline";

export interface SaveTrackInput {
  /** What this session was for; decides the slot and whether bands are required. */
  kind: TrackKind;
  skill: Skill; // reading | listening | vocab
  sourceUrl?: string;
  rawScore?: string;
  bandEstimate?: number;
  durationMin?: number;
  notes?: string;
  /** Mock and baseline record both skills at once. */
  bandListening?: number;
  bandReading?: number;
  cards: {
    error_type: ErrorType;
    rule?: string;
    front: string;
    back: string;
    explanation: string;
  }[];
}

const SLOT_FOR: Record<TrackKind, string> = {
  practice: "input",
  timed: "timed",
  mock: "mock",
  baseline: "mock",
};

/** Persist a Reading/Listening session, plus band rows for baseline and mock. */
export async function saveTrackSession(input: SaveTrackInput): Promise<{
  sessionId: number;
  cardsAdded: number;
}> {
  await requireIeltsUser();
  const rawScore = input.rawScore?.trim();
  const notes = input.notes?.trim();
  if (!rawScore && (!notes || notes.length < 20)) {
    throw new Error(
      "Hãy nhập điểm/kết quả hoặc ghi ít nhất một lỗi, bẫy bạn đã gặp (20 ký tự).",
    );
  }
  if (
    input.durationMin != null &&
    (!Number.isFinite(input.durationMin) || input.durationMin <= 0)
  ) {
    throw new Error("Thời lượng phải lớn hơn 0 phút.");
  }
  for (const band of [
    input.bandEstimate,
    input.bandListening,
    input.bandReading,
  ]) {
    if (band != null && (!Number.isFinite(band) || band < 0 || band > 9)) {
      throw new Error("Band phải nằm trong khoảng 0–9.");
    }
  }

  // Baseline and mock exist to produce numbers. Without them the band chart
  // and every exit criterion that depends on it stay blind.
  const needsBothBands = input.kind === "mock" || input.kind === "baseline";
  if (
    needsBothBands &&
    (input.bandListening == null || input.bandReading == null)
  ) {
    throw new Error(
      input.kind === "mock"
        ? "Mock cần cả band Listening và band Reading."
        : "Baseline cần cả band Listening và band Reading.",
    );
  }

  const today = toISODate();
  const cards = input.cards.filter((c) => c.front && c.back);

  const { sessionId } = await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(schema.studySession)
      .values({
        date: today,
        skill: input.skill,
        slot:
          input.kind === "timed"
            ? input.skill === "listening"
              ? "timed-listening"
              : "timed-reading"
            : SLOT_FOR[input.kind],
        sourceUrl: input.sourceUrl ?? null,
        rawScore: rawScore || null,
        bandEstimate: input.bandEstimate ?? null,
        durationMin: input.durationMin ?? null,
        notes: notes || null,
        status: "done",
      })
      .returning({ id: schema.studySession.id });

    if (cards.length > 0) {
      await tx.insert(schema.errorCard).values(
        cards.map((c) => ({
          sourceType: input.skill,
          sourceRef: `study_session:${session.id}`,
          errorType: c.error_type,
          rule: c.rule ?? null,
          front: c.front,
          back: c.back,
          explanation: c.explanation,
          context: input.skill,
          dueDate: today,
        })),
      );
    }

    if (needsBothBands) {
      await tx.insert(schema.bandHistory).values({
        date: today,
        listening: input.bandListening ?? null,
        reading: input.bandReading ?? null,
        overall: overallOf({
          listening: input.bandListening,
          reading: input.bandReading,
        }),
        isMock: input.kind === "mock",
        note: input.kind === "mock" ? "Mock Listening + Reading" : "Baseline",
      });
    }

    return { sessionId: session.id };
  });

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
  revalidatePath("/ielts/review");
  revalidatePath("/ielts/errors");
  return { sessionId, cardsAdded: cards.length };
}
