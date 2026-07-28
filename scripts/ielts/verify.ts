import { asc, desc, eq, lte } from "drizzle-orm";
import { db, schema } from "../../src/lib/ielts/db";
import { dueDateAfter, schedule, toISODate } from "../../src/lib/ielts/srs";

/**
 * End-to-end smoke test of the foundation: read due cards (stubborn first),
 * review one with a "good" grade, persist the new SM-2 state + a review_log
 * row, then read back to confirm the write landed.
 */
async function main() {
  const today = toISODate();

  // 1. Due cards, stubborn (high lapses) first — the review-queue ordering.
  const due = await db
    .select()
    .from(schema.errorCard)
    .where(lte(schema.errorCard.dueDate, today))
    .orderBy(desc(schema.errorCard.lapses), asc(schema.errorCard.dueDate));
  console.log(`Due today: ${due.length} cards`);

  const card = due[0];
  if (!card) {
    console.log("No due cards — run `npm run ielts:seed` first.");
    return;
  }
  console.log(`\nReviewing #${card.id} [${card.errorType}]: ${card.front}`);

  // 2. Apply a "good" grade via the pure scheduler.
  const next = schedule(
    {
      easeFactor: card.easeFactor,
      intervalDays: card.intervalDays,
      repetitions: card.repetitions,
      lapses: card.lapses,
    },
    "good",
  );
  const dueDate = dueDateAfter(next.intervalDays);

  // 3. Persist: update card state + log the review (mirrors the real action).
  await db
    .update(schema.errorCard)
    .set({
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      repetitions: next.repetitions,
      lapses: next.lapses,
      dueDate,
      lastReviewed: today,
    })
    .where(eq(schema.errorCard.id, card.id));

  await db.insert(schema.reviewLog).values({
    cardId: card.id,
    grade: "good",
    prevInterval: card.intervalDays,
    newInterval: next.intervalDays,
  });

  // 4. Read back to confirm.
  const [updated] = await db
    .select()
    .from(schema.errorCard)
    .where(eq(schema.errorCard.id, card.id));
  const logs = await db.select().from(schema.reviewLog);

  console.log(
    `→ interval ${card.intervalDays}d → ${updated.intervalDays}d, next due ${updated.dueDate}`,
  );
  console.log(`→ review_log rows: ${logs.length}`);
  console.log("\n✓ Foundation end-to-end OK (read → schedule → write → read).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
