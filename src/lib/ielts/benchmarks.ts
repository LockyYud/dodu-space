/** Validate native benchmark score payloads without imposing an IELTS scale. */
export function benchmarkScoreError(input: {
  scores: readonly (number | null | undefined)[];
  sectionScores?: Record<string, number> | null;
}): string | null {
  if (input.scores.some((score) => score != null && !Number.isFinite(score))) {
    return "Điểm benchmark phải là số hợp lệ.";
  }
  const hasSkillScore = input.scores.some(
    (score) => score != null && Number.isFinite(score),
  );
  const sectionValues = Object.values(input.sectionScores ?? {});
  const hasSectionScore =
    sectionValues.length > 0 && sectionValues.every(Number.isFinite);
  if (sectionValues.length > 0 && !hasSectionScore) {
    return "Điểm theo phần benchmark phải là số hợp lệ.";
  }
  return hasSkillScore || hasSectionScore
    ? null
    : "Nhập ít nhất một điểm benchmark.";
}
