import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { gradeWriting, isBandResult } from "../../src/lib/ielts/grading";

/**
 * Measures the grader instead of guessing at it.
 *
 * Without this, every prompt tweak is a hunch: "the feedback reads better" is
 * not evidence. Two modes:
 *
 *   --consistency  grade the same essay N times and report the spread.
 *                  Needs no ground truth, so it runs on any essay you have.
 *   --accuracy     compare against fixtures that carry an examiner band.
 *                  Reports mean absolute error per criterion.
 *
 * Usage:
 *   npm run ielts:eval -- --consistency --runs 3
 *   npm run ielts:eval -- --accuracy
 */

interface Fixture {
  id: string;
  taskType: "task1" | "task2";
  prompt: string;
  essay: string;
  /** Examiner bands, when the source published them. Omit if unknown. */
  bands?: {
    task_response?: number;
    coherence?: number;
    lexical?: number;
    grammar?: number;
    overall: number;
  };
  source?: string;
}

const FIXTURE_DIR = path.join(process.cwd(), "scripts/ielts/fixtures");
const CRITERIA = ["task_response", "coherence", "lexical", "grammar"] as const;

/** Accepted error against an examiner band, per TECH-DESIGN §10g. */
const MAE_THRESHOLD = 0.5;
const BIG_MISS = 1.0;

async function loadFixtures(): Promise<Fixture[]> {
  let files: string[];
  try {
    files = await readdir(FIXTURE_DIR);
  } catch {
    return [];
  }
  const fixtures: Fixture[] = [];
  for (const file of files.filter((f) => f.endsWith(".json"))) {
    const raw = await readFile(path.join(FIXTURE_DIR, file), "utf8");
    fixtures.push({ id: file.replace(/\.json$/, ""), ...JSON.parse(raw) });
  }
  return fixtures;
}

async function gradeOnce(fixture: Fixture) {
  const result = await gradeWriting({
    mode: "band",
    taskType: fixture.taskType,
    prompt: fixture.prompt,
    essay: fixture.essay,
    targetBand: 6,
  });
  if (!isBandResult(result)) throw new Error("expected a band result");
  return result;
}

async function consistency(runs: number) {
  const fixtures = await loadFixtures();
  if (fixtures.length === 0) return noFixtures();

  console.log(`Consistency: ${fixtures.length} fixture(s) × ${runs} run(s)\n`);
  let worst = 0;
  for (const fixture of fixtures) {
    const overalls: number[] = [];
    for (let i = 0; i < runs; i++) {
      const result = await gradeOnce(fixture);
      overalls.push(result.bands.overall);
    }
    const spread = Math.max(...overalls) - Math.min(...overalls);
    worst = Math.max(worst, spread);
    console.log(
      `  ${fixture.id.padEnd(24)} ${overalls.map((o) => o.toFixed(1)).join(" ")}  spread ${spread.toFixed(1)}`,
    );
  }
  console.log(`\nWorst spread across runs: ${worst.toFixed(1)} band`);
  console.log(
    worst <= MAE_THRESHOLD
      ? "PASS — repeated grades of the same essay agree."
      : `FAIL — a learner regrading the same essay would see it move ${worst.toFixed(1)} band.`,
  );
  return worst <= MAE_THRESHOLD;
}

async function accuracy() {
  const fixtures = (await loadFixtures()).filter((f) => f.bands);
  if (fixtures.length === 0) {
    console.log(
      "No fixtures with examiner bands yet — accuracy cannot be measured.",
    );
    console.log(`Add them to ${FIXTURE_DIR}; see the README there.`);
    return false;
  }

  console.log(`Accuracy: ${fixtures.length} graded fixture(s)\n`);
  const errors: Record<string, number[]> = { overall: [] };
  for (const key of CRITERIA) errors[key] = [];
  let bigMisses = 0;

  for (const fixture of fixtures) {
    const result = await gradeOnce(fixture);
    const expected = fixture.bands as NonNullable<Fixture["bands"]>;
    const diff = result.bands.overall - expected.overall;
    errors.overall.push(Math.abs(diff));
    if (Math.abs(diff) >= BIG_MISS) bigMisses++;
    for (const key of CRITERIA) {
      const target = expected[key];
      if (typeof target === "number") {
        errors[key].push(Math.abs(result.bands[key] - target));
      }
    }
    console.log(
      `  ${fixture.id.padEnd(24)} expected ${expected.overall.toFixed(1)}  got ${result.bands.overall.toFixed(1)}  diff ${diff > 0 ? "+" : ""}${diff.toFixed(1)}`,
    );
  }

  console.log("");
  for (const [key, values] of Object.entries(errors)) {
    if (values.length === 0) continue;
    const mae = values.reduce((a, b) => a + b, 0) / values.length;
    console.log(`  MAE ${key.padEnd(14)} ${mae.toFixed(2)}`);
  }
  const overallMae =
    errors.overall.reduce((a, b) => a + b, 0) / errors.overall.length;
  const ok = overallMae <= MAE_THRESHOLD && bigMisses === 0;
  console.log(
    `\n${ok ? "PASS" : "FAIL"} — MAE ${overallMae.toFixed(2)} (threshold ${MAE_THRESHOLD}), ${bigMisses} miss(es) of ${BIG_MISS}+ band`,
  );
  return ok;
}

function noFixtures() {
  console.log(`No fixtures found in ${FIXTURE_DIR}.`);
  console.log("See the README there for what to add and where to get it.");
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const runsFlag = args.indexOf("--runs");
  const runs = runsFlag >= 0 ? Number(args[runsFlag + 1]) || 3 : 3;

  if (!process.env.LLM_API_KEY) {
    console.error("LLM_API_KEY is not set — nothing to evaluate.");
    process.exit(1);
  }

  const ok = args.includes("--accuracy")
    ? await accuracy()
    : await consistency(runs);
  process.exit(ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
