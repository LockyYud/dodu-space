import {
  CLUSTER_IDS,
  type ClusterId,
  DAILY_PROMPTS,
  promptsInClusters,
} from "./daily-prompts";

/**
 * Luật của chu kỳ "Viết mỗi ngày". Xem docs/ielts/DAILY-WRITING.md §4.
 *
 * Toàn bộ tệp này thuần: ngẫu nhiên được **tiêm vào** qua `RandomInt`, không
 * gọi thẳng `Math.random`/`crypto`. Đây là chỗ duy nhất định nghĩa "hôm nay
 * được quay câu nào", nên nó phải kiểm chứng được mà không cần DB lẫn LLM.
 *
 * Điểm cần nhớ nhất: **chu kỳ đếm theo số bài đã viết, không theo ngày lịch**.
 * Nghỉ ba ngày thì nửa viết lại vẫn có đủ bảy câu để lặp; nếu đếm theo lịch thì
 * một tuần bận là nửa chu kỳ đó hỏng và không so sánh được gì.
 */

export const CYCLE_LENGTH = 14;
/** Số bài đầu chu kỳ dành cho câu mới; phần còn lại là viết lại. */
export const FRESH_PER_CYCLE = 7;
export const CLUSTERS_PER_CYCLE = 3;

export type SpinHalf = "fresh" | "rewrite";
export type SpinStatus = "spun" | "written" | "skipped";

/** Phần của một hàng `daily_spin` mà luật chu kỳ cần đến. */
export interface SpinRow {
  date: string;
  cycleId: number;
  cycleClusters: ClusterId[];
  cycleIndex: number;
  half: SpinHalf;
  clusterId: ClusterId;
  promptId: string;
  status: SpinStatus;
  submissionId: number | null;
}

/** `max` không bao gồm — cùng chữ ký với `crypto.randomInt(max)`. */
export type RandomInt = (max: number) => number;

export interface SpinOutcome {
  cycleId: number;
  cycleClusters: ClusterId[];
  cycleIndex: number;
  half: SpinHalf;
  clusterId: ClusterId;
  promptId: string;
  /** Chỉ ở nửa `rewrite`: bài lần một để đối chiếu sau khi chấm. */
  rewriteOfSubmissionId: number | null;
}

export function pick<T>(pool: T[], rand: RandomInt): T {
  if (pool.length === 0) throw new Error("pick(): pool rỗng");
  return pool[rand(pool.length)];
}

/** Bốc `n` phần tử khác nhau, giữ nguyên mảng đầu vào. */
export function sample<T>(pool: T[], n: number, rand: RandomInt): T[] {
  const rest = [...pool];
  const out: T[] = [];
  while (out.length < n && rest.length > 0) {
    out.push(rest.splice(rand(rest.length), 1)[0]);
  }
  return out;
}

/* ─────────────────────────────── trạng thái ─────────────────────────────── */

export interface CycleState {
  cycleId: number;
  clusters: ClusterId[];
  /** Số bài đã **viết xong** trong chu kỳ này. Lượt bỏ qua không tính. */
  written: number;
  half: SpinHalf;
  /** Các bài của nửa đầu, để nửa sau bốc lại. */
  freshDone: { promptId: string; clusterId: ClusterId; submissionId: number }[];
  /** promptId đã được viết lại trong chu kỳ này. */
  rewritten: string[];
}

/**
 * Chu kỳ đang chạy, suy ra từ lịch sử quay.
 *
 * `rows` theo thứ tự nào cũng được. Chu kỳ đã đủ `CYCLE_LENGTH` bài viết thì
 * hàm này trả về chu kỳ **kế tiếp** với danh sách cụm rỗng — người gọi bốc cụm
 * mới ở `planSpin`, vì việc bốc cần ngẫu nhiên.
 */
export function currentCycle(rows: SpinRow[]): CycleState {
  if (rows.length === 0) {
    return {
      cycleId: 1,
      clusters: [],
      written: 0,
      half: "fresh",
      freshDone: [],
      rewritten: [],
    };
  }

  const cycleId = Math.max(...rows.map((r) => r.cycleId));
  const inCycle = rows.filter((r) => r.cycleId === cycleId);
  const done = inCycle
    .filter((r) => r.status === "written")
    .sort((a, b) => a.cycleIndex - b.cycleIndex);

  if (done.length >= CYCLE_LENGTH) {
    return {
      cycleId: cycleId + 1,
      clusters: [],
      written: 0,
      half: "fresh",
      freshDone: [],
      rewritten: [],
    };
  }

  const clusters = inCycle[0]?.cycleClusters ?? [];
  return {
    cycleId,
    clusters,
    written: done.length,
    half: done.length < FRESH_PER_CYCLE ? "fresh" : "rewrite",
    freshDone: done
      .filter((r) => r.half === "fresh" && r.submissionId != null)
      .map((r) => ({
        promptId: r.promptId,
        clusterId: r.clusterId,
        submissionId: r.submissionId as number,
      })),
    rewritten: done.filter((r) => r.half === "rewrite").map((r) => r.promptId),
  };
}

/**
 * Ba cụm cho một chu kỳ mới: bốc trong số cụm chưa dùng ở vòng xoay hiện tại.
 *
 * 12 cụm ÷ 3 = 4 chu kỳ thì hết một vòng, lúc đó mở lại toàn bộ nhưng trừ cụm
 * của chu kỳ vừa xong — để hai chu kỳ liền nhau không đụng cụm giống nhau.
 */
export function clustersForCycle(
  rows: SpinRow[],
  cycleId: number,
  rand: RandomInt,
): ClusterId[] {
  const previous = new Map<number, ClusterId[]>();
  for (const row of rows) {
    if (row.cycleId < cycleId) previous.set(row.cycleId, row.cycleClusters);
  }
  const recentFirst = [...previous.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, clusters]) => clusters);

  const used = new Set<ClusterId>();
  for (const clusters of recentFirst) {
    for (const id of clusters) used.add(id);
    if (used.size >= CLUSTER_IDS.length - CLUSTERS_PER_CYCLE) break;
  }

  let available = CLUSTER_IDS.filter((id) => !used.has(id));
  if (available.length < CLUSTERS_PER_CYCLE) {
    const last = new Set(recentFirst[0] ?? []);
    available = CLUSTER_IDS.filter((id) => !last.has(id));
  }
  return sample(available, CLUSTERS_PER_CYCLE, rand);
}

/* ──────────────────────────────── quay ──────────────────────────────── */

/**
 * Quay một lượt chính thức: chọn thật sự ngẫu nhiên trong pool hợp lệ của
 * chu kỳ. Người gọi chịu trách nhiệm ép "một lượt mỗi ngày" — ở đây không có
 * khái niệm ngày.
 */
export function planSpin(rows: SpinRow[], rand: RandomInt): SpinOutcome {
  const state = currentCycle(rows);
  const clusters =
    state.clusters.length > 0
      ? state.clusters
      : clustersForCycle(rows, state.cycleId, rand);

  if (state.half === "rewrite") {
    const pending = state.freshDone.filter(
      (f) => !state.rewritten.includes(f.promptId),
    );
    // Pool cạn chỉ xảy ra khi dữ liệu nửa đầu bị thiếu (bài bị xoá tay chẳng
    // hạn) — rơi về câu mới còn hơn là chặn người học lại.
    if (pending.length > 0) {
      const chosen = pick(pending, rand);
      return {
        cycleId: state.cycleId,
        cycleClusters: clusters,
        cycleIndex: state.written,
        half: "rewrite",
        clusterId: chosen.clusterId,
        promptId: chosen.promptId,
        rewriteOfSubmissionId: chosen.submissionId,
      };
    }
  }

  const usedInCycle = new Set(
    rows
      .filter((r) => r.cycleId === state.cycleId && r.status !== "skipped")
      .map((r) => r.promptId),
  );
  let pool = promptsInClusters(clusters).filter((p) => !usedInCycle.has(p.id));
  if (pool.length === 0) pool = promptsInClusters(clusters);

  const chosen = pick(pool, rand);
  return {
    cycleId: state.cycleId,
    cycleClusters: clusters,
    cycleIndex: state.written,
    half: "fresh",
    clusterId: chosen.cluster,
    promptId: chosen.id,
    rewriteOfSubmissionId: null,
  };
}

/**
 * Quay tự do sau khi đã nộp bài chính thức: cả 96 câu, trừ câu của hôm nay.
 * Không đụng chu kỳ, không đụng chuỗi ngày — đây là chỗ xả, không phải thước đo.
 */
export function planFreeSpin(
  excludePromptIds: string[],
  rand: RandomInt,
): string {
  const exclude = new Set(excludePromptIds);
  const pool = DAILY_PROMPTS.filter((p) => !exclude.has(p.id));
  return pick(pool.length > 0 ? pool : DAILY_PROMPTS, rand).id;
}
