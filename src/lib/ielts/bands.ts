export interface SkillBands {
  listening?: number | null;
  reading?: number | null;
  writing?: number | null;
  speaking?: number | null;
}

/**
 * Overall = mean of the skills actually provided, rounded to the nearest 0.5.
 * Returns null when nothing was provided, so partial rows (a single-skill
 * baseline, say) never draw a misleading point on the overall chart.
 */
export function overallOf(input: SkillBands): number | null {
  const values = [
    input.listening,
    input.reading,
    input.writing,
    input.speaking,
  ].filter((v): v is number => typeof v === "number");
  if (values.length === 0) return null;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(mean * 2) / 2;
}
