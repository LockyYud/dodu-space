"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import { isLLMConfigured } from "@/lib/ielts/llm";
import { VOCAB_DAILY_CAP } from "@/lib/ielts/plan";
import { type ActionResult, fail, ok } from "@/lib/ielts/result";
import { VOCAB_CARD_MARKER } from "@/lib/ielts/schema";
import { toISODate, toLocalTimestamp } from "@/lib/ielts/srs";
import {
  appendContext,
  makeVocabCard,
  normalizeTerm,
  type VocabKind,
} from "@/lib/ielts/vocab";
import {
  type EnrichedTerm,
  enrichTerms,
  MAX_TERMS_PER_LOOKUP,
  parseTermList,
} from "@/lib/ielts/vocab-enrich";

export interface AddVocabInput {
  term: string;
  context: string;
  kind: VocabKind;
  /** Nghĩa và các cụm hay đi cùng, do bước tra cứu dựng sẵn. */
  explanation?: string;
}

export interface AddVocabResult {
  /** True khi cụm từ này đã có thẻ và thẻ cũ được kéo về hạn hôm nay. */
  repeated: boolean;
  todayCount: number;
}

/** Số thẻ từ vựng **mới** đã tạo hôm nay, để chặn trần. */
export async function countVocabToday(): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.errorCard)
    .where(
      and(
        eq(schema.errorCard.sourceRef, VOCAB_CARD_MARKER),
        gte(schema.errorCard.createdAt, `${toISODate()} 00:00:00`),
      ),
    );
  return Number(row?.n ?? 0);
}

/**
 * Bắt một cụm từ từ bài đọc vào SRS.
 *
 * Hai luật đáng chú ý:
 *  - **Trần thẻ mới mỗi ngày.** Thẻ từ vựng dùng chung hàng đợi với thẻ lỗi,
 *    nên không chặn thì nó sẽ nhấn chìm thẻ lỗi — thứ đang gỡ trần band Writing.
 *  - **Bắt lại thì không sinh thẻ hai.** Một cụm từ gặp lại trong bài đọc sau
 *    đáng giá hơn một cụm đẹp gặp một lần, nên thẻ cũ được kéo về hạn hôm nay
 *    và ngữ cảnh mới được ghép thêm, thay vì tạo bản trùng.
 */
export async function addVocabCard(
  input: AddVocabInput,
): Promise<ActionResult<AddVocabResult>> {
  await requireIeltsUser();
  const today = toISODate();

  let card: ReturnType<typeof makeVocabCard>;
  try {
    card = makeVocabCard(input);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Không thêm được.");
  }

  const outcome = await db.transaction(async (tx) => {
    // Chỉ so trùng trong thẻ do chính ô này tạo. Thẻ lỗi từ bài viết cũng có
    // thể mang `collocation`, và sửa nhầm vào đó thì mất một thẻ lỗi thật.
    const existing = await tx
      .select()
      .from(schema.errorCard)
      .where(eq(schema.errorCard.sourceRef, VOCAB_CARD_MARKER));
    const match = existing.find((row) => normalizeTerm(row.back) === card.key);

    if (match) {
      await tx
        .update(schema.errorCard)
        .set({
          dueDate: today,
          context: appendContext(match.context, input.context.trim()),
        })
        .where(eq(schema.errorCard.id, match.id));
      return "repeated" as const;
    }

    if ((await countVocabToday()) >= VOCAB_DAILY_CAP) return "capped" as const;

    await tx.insert(schema.errorCard).values({
      sourceType: "reading",
      sourceRef: VOCAB_CARD_MARKER,
      errorType: input.kind,
      front: card.front,
      back: card.back,
      explanation: input.explanation?.trim() || card.explanation,
      context: input.context.trim(),
      dueDate: today,
      observedOn: today,
      createdAt: toLocalTimestamp(),
    });
    return "added" as const;
  });

  if (outcome === "capped") {
    return fail(
      `Hôm nay đã đủ ${VOCAB_DAILY_CAP} thẻ từ mới. Để dành cho mai — thẻ lỗi cũng cần chỗ trong hàng đợi.`,
    );
  }

  // Một dòng buổi học mỗi ngày, cộng dồn chứ không nhân bản, giống logDailyInput.
  const [session] = await db
    .select()
    .from(schema.studySession)
    .where(
      and(
        eq(schema.studySession.date, today),
        eq(schema.studySession.slot, "vocab"),
      ),
    )
    .limit(1);
  if (session) {
    await db
      .update(schema.studySession)
      .set({ durationMin: (session.durationMin ?? 0) + 1 })
      .where(eq(schema.studySession.id, session.id));
  } else {
    await db.insert(schema.studySession).values({
      date: today,
      skill: "vocab",
      slot: "vocab",
      durationMin: 1,
      status: "done",
      notes: "Bắt từ mới từ bài đọc",
    });
  }

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/review");
  return ok({
    repeated: outcome === "repeated",
    todayCount: await countVocabToday(),
  });
}

/**
 * Tra một loạt cụm từ: người học chỉ đưa từ mới, app dựng phần còn lại.
 *
 * Không ghi gì vào database — đây là bước xem trước, để người học bỏ bớt những
 * cụm không đáng học trước khi chúng thành thẻ.
 */
export async function lookupVocab(
  raw: string,
  passage?: string,
): Promise<ActionResult<EnrichedTerm[]>> {
  await requireIeltsUser();
  if (!isLLMConfigured()) {
    return fail("Chưa cấu hình LLM_API_KEY nên không tra cứu được.");
  }

  const terms = parseTermList(raw);
  if (terms.length === 0) return fail("Chưa nhập cụm từ nào.");
  if (terms.length > MAX_TERMS_PER_LOOKUP) {
    return fail(
      `Mỗi lần tra tối đa ${MAX_TERMS_PER_LOOKUP} cụm. Bạn vừa dán ${terms.length}.`,
    );
  }

  try {
    return ok(
      await enrichTerms({ terms, passage: passage?.trim() || undefined }),
    );
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Tra cứu thất bại.");
  }
}

export interface SaveVocabResult {
  added: number;
  repeated: number;
  /** Số cụm bị bỏ vì đã chạm trần thẻ mới trong ngày. */
  capped: number;
  todayCount: number;
}

/**
 * Lưu nhiều thẻ một lượt.
 *
 * Trần thẻ mỗi ngày phải tính **trên cả lô**, không phải từng cụm một: một lần
 * dán 12 cụm mà mỗi cụm tự kiểm tra riêng thì trần thành vô nghĩa.
 */
export async function addVocabCards(
  inputs: AddVocabInput[],
): Promise<ActionResult<SaveVocabResult>> {
  await requireIeltsUser();
  if (inputs.length === 0) return fail("Chưa chọn cụm nào để lưu.");

  const today = toISODate();
  let added = 0;
  let repeated = 0;
  let capped = 0;

  await db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(schema.errorCard)
      .where(eq(schema.errorCard.sourceRef, VOCAB_CARD_MARKER));
    const byKey = new Map(
      existing.map((row) => [normalizeTerm(row.back), row] as const),
    );
    let room =
      VOCAB_DAILY_CAP -
      existing.filter((row) => (row.createdAt ?? "").startsWith(today)).length;

    for (const input of inputs) {
      let card: ReturnType<typeof makeVocabCard>;
      try {
        card = makeVocabCard(input);
      } catch {
        continue; // cụm thiếu ngữ cảnh: bỏ qua, đừng làm hỏng cả lô
      }

      const match = byKey.get(card.key);
      if (match) {
        await tx
          .update(schema.errorCard)
          .set({
            dueDate: today,
            context: appendContext(match.context, input.context.trim()),
          })
          .where(eq(schema.errorCard.id, match.id));
        repeated++;
        continue;
      }

      if (room <= 0) {
        capped++;
        continue;
      }

      await tx.insert(schema.errorCard).values({
        sourceType: "reading",
        sourceRef: VOCAB_CARD_MARKER,
        errorType: input.kind,
        front: card.front,
        back: card.back,
        explanation: input.explanation?.trim() || card.explanation,
        context: input.context.trim(),
        dueDate: today,
        observedOn: today,
        createdAt: toLocalTimestamp(),
      });
      room--;
      added++;
    }
  });

  if (added > 0 || repeated > 0) await touchVocabSession(added + repeated);

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/review");
  return ok({ added, repeated, capped, todayCount: await countVocabToday() });
}

/** Một dòng buổi học mỗi ngày cho ô từ vựng, cộng dồn chứ không nhân bản. */
async function touchVocabSession(count: number): Promise<void> {
  const today = toISODate();
  const [session] = await db
    .select()
    .from(schema.studySession)
    .where(
      and(
        eq(schema.studySession.date, today),
        eq(schema.studySession.slot, "vocab"),
      ),
    )
    .limit(1);

  if (session) {
    await db
      .update(schema.studySession)
      .set({ durationMin: (session.durationMin ?? 0) + count })
      .where(eq(schema.studySession.id, session.id));
    return;
  }
  await db.insert(schema.studySession).values({
    date: today,
    skill: "vocab",
    slot: "vocab",
    durationMin: count,
    status: "done",
    notes: "Bắt từ mới từ bài đọc",
  });
}
