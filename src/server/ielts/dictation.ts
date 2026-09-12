"use server";

import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import { errorDensity } from "@/lib/ielts/progress";
import { type ActionResult, fail, ok } from "@/lib/ielts/result";
import { DICTATION_CARD_MARKER } from "@/lib/ielts/schema";
import { toISODate, toLocalTimestamp } from "@/lib/ielts/srs";

export interface DictationInput {
  wordCount: number;
  errorCount: number;
  /** Mỗi dòng một chỗ nghe sai, dạng "nghe thành → đúng là". Có thể để trống. */
  misses?: string;
}

export interface DictationResult {
  density: number;
  cardsCreated: number;
}

/** Tách "nghe thành → đúng là" thành mặt trước / mặt sau của thẻ. */
function parseMisses(raw: string): { front: string; back: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [heard, actual] = line.split(/\s*(?:->|→|=>)\s*/, 2);
      return actual
        ? { front: heard.trim(), back: actual.trim() }
        : { front: line, back: line };
    })
    .filter((pair) => pair.front.length > 0);
}

/**
 * Ghi một buổi chép chính tả — METHOD-REVIEW §6.
 *
 * Số từ và số chỗ sai được lưu vào `study_session.raw_score` dạng "3/85", đúng
 * mục đích cột đó vốn có. Mật độ lỗi tính lại được bất cứ lúc nào bằng chính
 * `errorDensity()` mà Writing đang dùng, nên hai kỹ năng chia nhau một thước đo
 * thay vì mỗi bên một kiểu.
 */
export async function logDictation(
  input: DictationInput,
): Promise<ActionResult<DictationResult>> {
  await requireIeltsUser();
  const words = Math.round(input.wordCount);
  const errors = Math.round(input.errorCount);
  if (!Number.isFinite(words) || words <= 0) {
    return fail("Số từ phải lớn hơn 0.");
  }
  if (!Number.isFinite(errors) || errors < 0) {
    return fail("Số chỗ sai không được âm.");
  }
  if (errors > words) {
    return fail("Số chỗ sai không thể nhiều hơn số từ.");
  }

  const today = toISODate();
  const pairs = input.misses ? parseMisses(input.misses) : [];

  await db.transaction(async (tx) => {
    await tx.insert(schema.studySession).values({
      date: today,
      skill: "listening",
      slot: "dictation",
      durationMin: 10,
      rawScore: `${errors}/${words}`,
      status: "done",
      notes: "Chép chính tả",
    });

    if (pairs.length > 0) {
      await tx.insert(schema.errorCard).values(
        pairs.map((pair) => ({
          sourceType: "listening" as const,
          sourceRef: DICTATION_CARD_MARKER,
          errorType: "listening-catch" as const,
          front: pair.front,
          back: pair.back,
          explanation: "Nghe sai khi chép chính tả.",
          context: `Chép chính tả ${today}`,
          dueDate: today,
          observedOn: today,
          createdAt: toLocalTimestamp(),
        })),
      );
    }
  });

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/review");
  return ok({
    density: errorDensity(errors, words),
    cardsCreated: pairs.length,
  });
}
