export interface ParsedRawScore {
  correct: number;
  total: number;
}

/** Parse a human-entered `correct/total` score without trusting the client. */
export function parseRawScore(
  raw: string | undefined,
): ParsedRawScore | null {
  const value = raw?.trim();
  if (!value) return null;
  const match = value.match(/(?:^|\D)(\d+)\s*\/\s*(\d+)(?:\D|$)/);
  if (!match) return null;
  return { correct: Number(match[1]), total: Number(match[2]) };
}
