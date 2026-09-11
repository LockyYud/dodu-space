import assert from "node:assert/strict";
import {
  CLUSTERS_PER_CYCLE,
  CYCLE_LENGTH,
  clustersForCycle,
  currentCycle,
  FRESH_PER_CYCLE,
  planSpin,
  type SpinRow,
} from "../../src/lib/ielts/daily";
import { compareRules, parsePolish } from "../../src/lib/ielts/daily-coach";
import {
  CLUSTER_IDS,
  type ClusterId,
  DAILY_PROMPTS,
  dailyPromptById,
  promptsInClusters,
} from "../../src/lib/ielts/daily-prompts";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

/** Ngẫu nhiên giả: luôn lấy phần tử đầu, để kết quả kiểm chứng được. */
const first = () => 0;
/** Luôn lấy phần tử cuối. */
const last = (max: number) => max - 1;

let day = 0;
function nextDate(): string {
  day++;
  return `2026-01-${String(day).padStart(2, "0")}`;
}

function written(
  base: Omit<SpinRow, "status" | "submissionId" | "date">,
  submissionId: number,
): SpinRow {
  return { ...base, date: nextDate(), status: "written", submissionId };
}

check("bank có đủ 12 cụm × 8 câu và id không trùng", () => {
  assert.equal(DAILY_PROMPTS.length, 96);
  assert.equal(new Set(DAILY_PROMPTS.map((p) => p.id)).size, 96);
  for (const id of CLUSTER_IDS) {
    assert.equal(
      DAILY_PROMPTS.filter((p) => p.cluster === id).length,
      8,
      `cụm ${id} không đủ 8 câu`,
    );
  }
});

check("mỗi gợi ý đúng ba mảnh", () => {
  // Bốn mảnh trở lên thì gợi ý thành dàn ý, và người viết chỉ điền vào chỗ
  // trống thay vì tự nghĩ — xem DAILY-WRITING-PROMPTS.md.
  for (const prompt of DAILY_PROMPTS) {
    const parts = prompt.hint.split("·").map((s) => s.trim());
    assert.equal(parts.length, 3, `${prompt.id}: ${prompt.hint}`);
    assert.ok(parts.every(Boolean), `${prompt.id} có mảnh gợi ý rỗng`);
  }
});

check("chu kỳ đầu tiên bốc đủ ba cụm chưa dùng", () => {
  const clusters = clustersForCycle([], 1, first);
  assert.equal(clusters.length, CLUSTERS_PER_CYCLE);
  assert.equal(new Set(clusters).size, CLUSTERS_PER_CYCLE);
});

check("lượt quay đầu tiên rơi vào cụm của chu kỳ", () => {
  const outcome = planSpin([], first);
  assert.equal(outcome.cycleId, 1);
  assert.equal(outcome.half, "fresh");
  assert.equal(outcome.cycleIndex, 0);
  assert.ok(outcome.cycleClusters.includes(outcome.clusterId));
  assert.ok(dailyPromptById(outcome.promptId));
});

check("nửa đầu chu kỳ không lặp câu", () => {
  let rows: SpinRow[] = [];
  const seen: string[] = [];
  for (let i = 0; i < FRESH_PER_CYCLE; i++) {
    const outcome = planSpin(rows, (max) => (i * 7) % max);
    assert.equal(outcome.half, "fresh", `bài ${i} phải là câu mới`);
    assert.ok(!seen.includes(outcome.promptId), "câu bị lặp trong nửa đầu");
    seen.push(outcome.promptId);
    rows = [...rows, written(outcome, i + 1)];
  }
  assert.equal(seen.length, FRESH_PER_CYCLE);
});

check("qua bài thứ 8 thì chuyển sang viết lại đúng bảy câu đã viết", () => {
  let rows: SpinRow[] = [];
  for (let i = 0; i < FRESH_PER_CYCLE; i++) {
    rows = [
      ...rows,
      written(
        planSpin(rows, (max) => (i * 5) % max),
        i + 1,
      ),
    ];
  }
  const freshIds = rows.map((r) => r.promptId);

  const rewritten: string[] = [];
  for (let i = 0; i < CYCLE_LENGTH - FRESH_PER_CYCLE; i++) {
    const outcome = planSpin(rows, first);
    assert.equal(outcome.half, "rewrite");
    assert.ok(
      freshIds.includes(outcome.promptId),
      "nửa sau phải bốc lại câu của nửa đầu",
    );
    assert.ok(
      !rewritten.includes(outcome.promptId),
      "một câu chỉ được viết lại một lần trong chu kỳ",
    );
    assert.ok(
      outcome.rewriteOfSubmissionId != null,
      "bài viết lại phải trỏ tới bài lần một",
    );
    rewritten.push(outcome.promptId);
    rows = [...rows, written(outcome, 100 + i)];
  }
  assert.equal(rewritten.length, FRESH_PER_CYCLE);
  assert.deepEqual([...rewritten].sort(), [...freshIds].sort());
});

check("đủ 14 bài thì sang chu kỳ mới với ba cụm khác", () => {
  let rows: SpinRow[] = [];
  for (let i = 0; i < CYCLE_LENGTH; i++) {
    rows = [...rows, written(planSpin(rows, first), i + 1)];
  }
  const state = currentCycle(rows);
  assert.equal(state.cycleId, 2);
  assert.equal(state.written, 0);

  const outcome = planSpin(rows, first);
  assert.equal(outcome.cycleId, 2);
  const before = new Set(rows[0].cycleClusters);
  assert.ok(
    outcome.cycleClusters.every((c) => !before.has(c)),
    "chu kỳ mới không được dùng lại cụm của chu kỳ trước",
  );
});

check("sau bốn chu kỳ, vòng xoay cụm mở lại", () => {
  // 12 cụm ÷ 3 = 4 chu kỳ là hết một vòng. Chu kỳ thứ năm phải bốc được, và chỉ
  // bị cấm đúng ba cụm của chu kỳ liền trước.
  const rows: SpinRow[] = [];
  const used: ClusterId[][] = [];
  for (let cycle = 1; cycle <= 4; cycle++) {
    const clusters = clustersForCycle(rows, cycle, first);
    used.push(clusters);
    rows.push({
      date: `2026-0${cycle}-01`,
      cycleId: cycle,
      cycleClusters: clusters,
      cycleIndex: 0,
      half: "fresh",
      clusterId: clusters[0],
      promptId: promptsInClusters(clusters)[0].id,
      status: "written",
      submissionId: cycle,
    });
  }
  assert.equal(new Set(used.flat()).size, CLUSTER_IDS.length);

  const fifth = clustersForCycle(rows, 5, first);
  assert.equal(fifth.length, CLUSTERS_PER_CYCLE);
  const previous = new Set(used[3]);
  assert.ok(fifth.every((c) => !previous.has(c)));
});

check("lượt bỏ qua không đẩy chu kỳ và trả câu về pool", () => {
  const first_ = planSpin([], first);
  const skipped: SpinRow = {
    ...first_,
    date: "2026-02-01",
    status: "skipped",
    submissionId: null,
  };
  const next = planSpin([skipped], first);
  assert.equal(next.cycleIndex, 0, "bỏ qua thì không tính là một bài");
  assert.equal(
    next.promptId,
    first_.promptId,
    "câu bị bỏ qua phải quay lại pool",
  );
});

check("cùng lịch sử, hai lần quay khác nhau cho kết quả khác nhau", () => {
  // Ngẫu nhiên là thật: cùng đầu vào mà đổi nguồn ngẫu nhiên thì đổi kết quả.
  // Nếu đề được tính sẵn theo ngày thì khẳng định này sai.
  const a = planSpin([], first);
  const b = planSpin([], last);
  assert.notEqual(a.promptId, b.promptId);
});

check("parsePolish rơi về bài gốc khi model trả rác", () => {
  const essay = "I go to work by bike.";
  const result = parsePolish("không phải json", essay);
  assert.equal(result.rewrite, essay);
  assert.deepEqual(result.phrases, []);
});

check("parsePolish đọc được json có rào markdown và bỏ cụm thiếu", () => {
  const raw = `\`\`\`json
{"strength":"Câu ngắn, rõ ý.","rewrite":"I cycle to work.","phrases":[
  {"instead_of":"go to work by bike","say":"cycle to work","note":"Nói hằng ngày."},
  {"instead_of":"x","note":"thiếu say"}
]}
\`\`\``;
  const result = parsePolish(raw, "fallback");
  assert.equal(result.rewrite, "I cycle to work.");
  assert.equal(result.phrases.length, 1);
  assert.equal(result.phrases[0].say, "cycle to work");
});

check("so hai lần viết tách được lỗi đã hết và lỗi còn lại", () => {
  const { rulesFixed, rulesRemaining } = compareRules(
    ["article", "plural-s", "article"],
    ["plural-s", "prep-verb"],
  );
  assert.deepEqual(rulesFixed, ["article"]);
  assert.deepEqual(rulesRemaining, ["plural-s"]);
});

console.log(`\n${passed} kiểm tra daily đã qua.`);
