import assert from "node:assert/strict";
import { weeklyNotionPageProperties } from "../../src/lib/ielts/notion-weekly";
import { aggregateWeeklyEnglishSummary } from "../../src/lib/ielts/weekly-summary";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
}

const actualEnglishWeeklyDataSchema = {
  Week: { type: "title" },
  Status: { type: "status" },
  "Week Start": { type: "date" },
  "Week End": { type: "date" },
  "Total Sessions": { type: "number" },
  "Total Minutes": { type: "number" },
  Source: { type: "select" },
  "Synced At": { type: "date" },
  "Data Version": { type: "rich_text" },
};

check("maps the real English Weekly Data properties with Week as Title", () => {
  const summary = aggregateWeeklyEnglishSummary(
    {
      studySessions: [
        { id: 1, date: "2026-09-07", durationMin: 45, skill: "writing" },
      ],
    },
    "2026-W37",
  );
  const properties = weeklyNotionPageProperties(
    actualEnglishWeeklyDataSchema,
    summary,
    "2026-09-13T12:00:00.000Z",
  );
  assert.deepEqual(properties, {
    Week: { title: [{ type: "text", text: { content: "2026-W37" } }] },
    Status: { status: { name: "Ready" } },
    "Week Start": { date: { start: "2026-09-07" } },
    "Week End": { date: { start: "2026-09-13" } },
    "Total Sessions": { number: 1 },
    "Total Minutes": { number: 45 },
    Source: { select: { name: "dodu-space" } },
    "Synced At": { date: { start: "2026-09-13T12:00:00.000Z" } },
    "Data Version": {
      rich_text: [
        { type: "text", text: { content: "weekly-english-summary.v3" } },
      ],
    },
  });
});

check("fails closed when a required Notion property is missing", () => {
  const summary = aggregateWeeklyEnglishSummary({}, "2026-W37");
  const missing = { ...actualEnglishWeeklyDataSchema };
  delete (missing as Record<string, unknown>).Source;
  assert.throws(
    () => weeklyNotionPageProperties(missing, summary, "2026-09-13T12:00:00Z"),
    /Source/,
  );
});

console.log(`\n✓ Notion weekly mapping: ${passed}/${passed} checks passed`);
