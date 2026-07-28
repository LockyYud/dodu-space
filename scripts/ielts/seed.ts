import { db, schema } from "../../src/lib/ielts/db";
import { toISODate } from "../../src/lib/ielts/srs";

/**
 * Seed a few sample error cards + a baseline band snapshot so the SRS review
 * screen has something to show before any real grading happens.
 * Idempotent-ish: skips if error_card already has rows.
 */
async function main() {
  const existing = await db.select().from(schema.errorCard).limit(1);
  if (existing.length > 0) {
    console.log("• error_card already has data — skipping seed.");
    return;
  }

  const today = toISODate();

  await db.insert(schema.errorCard).values([
    {
      sourceType: "writing",
      errorType: "grammar",
      front: "Nowadays, many people prefers to work from home.",
      back: "Nowadays, many people prefer to work from home.",
      explanation: "Subject–verb agreement: 'people' is plural → 'prefer'.",
      context: "Task 2 — Work/Technology",
      dueDate: today,
    },
    {
      sourceType: "writing",
      errorType: "collocation",
      front: "The government should do more efforts to reduce pollution.",
      back: "The government should make more efforts to reduce pollution.",
      explanation: "Collocation: 'make an effort', not 'do an effort'.",
      context: "Task 2 — Environment",
      dueDate: today,
    },
    {
      sourceType: "writing",
      errorType: "coherence",
      front:
        "Firstly. Moreover. In addition. Furthermore. (nhồi linking words)",
      back: "Dùng liên kết theo ý, không xếp chồng: 'One reason is… A further factor…'.",
      explanation:
        "Band 7 CC cần liên kết tự nhiên, không nhồi từ nối máy móc.",
      context: "Task 2 — chung",
      dueDate: today,
    },
    {
      sourceType: "reading",
      errorType: "reading-trap",
      front: "Chọn True vì câu văn 'nghe giống' đề — nhưng thiếu 1 điều kiện.",
      back: "Đọc kỹ định lượng/điều kiện (all/some/only) trước khi chọn True/False/NG.",
      explanation: "Bẫy paraphrase: đúng chủ đề nhưng sai phạm vi.",
      context: "Reading — T/F/NG",
      dueDate: today,
    },
    {
      sourceType: "listening",
      errorType: "listening-catch",
      front: "Nghe '15' nhưng đáp án là '50' (fifteen vs fifty).",
      back: "Chú ý trọng âm: FIF-teen (cuối) vs FIF-ty (đầu).",
      explanation: "Lỗi nghe số phổ biến ở Section 1.",
      context: "Listening — Section 1 form completion",
      dueDate: today,
    },
  ]);

  await db.insert(schema.bandHistory).values({
    date: today,
    listening: 6.0,
    reading: 6.0,
    writing: 5.5,
    speaking: 5.5,
    overall: 5.5,
    isMock: true,
    note: "Baseline khởi điểm (Phase 0).",
  });

  const cards = await db.select().from(schema.errorCard);
  console.log(
    `✓ Seeded ${cards.length} error cards + 1 baseline band snapshot.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
