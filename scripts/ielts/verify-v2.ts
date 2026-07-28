import assert from "node:assert/strict";
import { db, schema } from "../../src/lib/ielts/db";
import { computeStreak, planStatus } from "../../src/lib/ielts/plan";
import { toISODate } from "../../src/lib/ielts/srs";

async function main() {
  // --- pure logic ---
  const p = planStatus(new Date(2026, 6, 19)); // start day, Sunday
  assert.equal(p.week, 1);
  assert.equal(p.phase, 0);
  const p8 = planStatus(new Date(2026, 8, 1)); // ~week 7 → phase 1
  assert.ok(p8.week >= 3 && p8.phase === 1);
  console.log(
    `✓ planStatus: start=week${p.week}/phase${p.phase}, sep1=week${p8.week}/phase${p8.phase}`,
  );

  const today = toISODate();
  const y = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return toISODate(d);
  };
  assert.equal(computeStreak([today, y(1), y(2)]), 3);
  assert.equal(computeStreak([y(1), y(2)]), 2); // today missing, yesterday counts
  assert.equal(computeStreak([y(3)]), 0); // gap breaks streak
  console.log("✓ computeStreak: 3 / 2 / 0 as expected");

  // --- seed a bit of data for chart + session log + streak (idempotent-ish) ---
  const sessions = await db.select().from(schema.studySession);
  if (sessions.length === 0) {
    await db.insert(schema.studySession).values([
      {
        date: today,
        skill: "reading",
        rawScore: "34/40",
        bandEstimate: 7.5,
        status: "done",
      },
      {
        date: y(1),
        skill: "listening",
        rawScore: "30/40",
        bandEstimate: 7.0,
        status: "done",
      },
      { date: y(2), skill: "writing", bandEstimate: 6.0, status: "done" },
    ]);
  }
  const bandCount = (await db.select().from(schema.bandHistory)).length;
  if (bandCount < 2) {
    await db.insert(schema.bandHistory).values({
      date: today,
      listening: 7.5,
      reading: 7.5,
      writing: 6.5,
      speaking: 6.5,
      overall: 7.0,
      isMock: true,
      note: "Mock #2 (verify)",
    });
  }

  const dates = (
    await db
      .select({ date: schema.studySession.date })
      .from(schema.studySession)
  ).map((r) => r.date);
  console.log(`✓ streak from DB dates: ${computeStreak(dates)} day(s)`);
  console.log(
    `✓ band_history rows: ${(await db.select().from(schema.bandHistory)).length}`,
  );
  console.log("\n✓ v2 logic + data OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
