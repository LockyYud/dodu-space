export type MCQQuestion = {
  id: string;
  number: number;
  section: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
  explanation: string;
};

export type ShortAnswerQuestion = {
  id: string;
  number: number;
  section: string;
  question: string;
  referenceAnswer: string;
};

function findSection(content: string, pos: number): string {
  const before = content.slice(0, pos);
  const matches = [...before.matchAll(/^## (.+)$/gm)];
  return matches.at(-1)?.[1]?.trim() ?? "";
}

export function parseMCQ(content: string, slug: string): MCQQuestion[] {
  const questions: MCQQuestion[] = [];

  // Handle both **Câu N.** (most chapters) and ### Câu N (ch07)
  const re =
    /(?:\*\*Câu\s+(\d+)\.\*\*|###\s+Câu\s+(\d+)\b)([\s\S]*?)(?=\*\*Câu\s+\d+\.\*\*|###\s+Câu\s+\d+\b|$)/g;

  for (const match of content.matchAll(re)) {
    const num = parseInt(match[1] ?? match[2] ?? "0", 10);
    const body = match[3] ?? "";
    const section = findSection(content, match.index ?? 0);

    // Question text: everything before the first option line
    const qEnd = body.search(/\n\s*[-–]?\s*A\./);
    const questionText =
      qEnd > 0 ? body.slice(0, qEnd).trim() : (body.split("\n")[0]?.trim() ?? "");

    // Options: handle "- A. text" and bare "A. text"
    const optA = body.match(/^[\s\-–]*A\.\s*(.+)$/m)?.[1]?.trim() ?? "";
    const optB = body.match(/^[\s\-–]*B\.\s*(.+)$/m)?.[1]?.trim() ?? "";
    const optC = body.match(/^[\s\-–]*C\.\s*(.+)$/m)?.[1]?.trim() ?? "";
    const optD = body.match(/^[\s\-–]*D\.\s*(.+)$/m)?.[1]?.trim() ?? "";

    // Answer + explanation from <details> block
    const detailsMatch = body.match(
      /<details>[\s\S]*?\*\*Đáp án:\s*([A-D])\*\*\s*[—–-]\s*([\s\S]*?)\s*<\/details>/,
    );
    const answer = (detailsMatch?.[1] ?? "A") as "A" | "B" | "C" | "D";
    const explanation = detailsMatch?.[2]?.trim() ?? "";

    if (questionText && optA && optB) {
      questions.push({
        id: `${slug}-q${num}`,
        number: num,
        section,
        question: questionText,
        options: { A: optA, B: optB, C: optC, D: optD },
        answer,
        explanation,
      });
    }
  }

  return questions;
}

export function parseShortAnswer(
  content: string,
  slug: string,
): ShortAnswerQuestion[] {
  const questions: ShortAnswerQuestion[] = [];

  const re =
    /\*\*Câu\s+(\d+)\.\*\*([\s\S]*?)(?=\*\*Câu\s+\d+\.\*\*|$)/g;

  for (const match of content.matchAll(re)) {
    const num = parseInt(match[1] ?? "0", 10);
    const body = match[2] ?? "";
    const section = findSection(content, match.index ?? 0);

    const questionText = body.split("<details>")[0]?.trim() ?? "";
    const refMatch = body.match(
      /<details>[\s\S]*?<summary>[^<]*<\/summary>([\s\S]*?)<\/details>/,
    );
    const referenceAnswer = refMatch?.[1]?.trim() ?? "";

    if (questionText) {
      questions.push({
        id: `${slug}-sa${num}`,
        number: num,
        section,
        question: questionText,
        referenceAnswer,
      });
    }
  }

  return questions;
}
