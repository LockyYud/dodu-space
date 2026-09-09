import { getLLM, LLM_MODEL } from "./llm";
import { findTermSpan, type VocabKind } from "./vocab";

/**
 * Tra một loạt cụm từ và dựng sẵn phần còn lại của thẻ.
 *
 * Bản đầu bắt người học tự làm hết: chọn cụm, tìm câu chứa nó, dán cả hai, chọn
 * loại. Đó là việc của app. Người học chỉ nên phải đưa ra **từ mới**.
 *
 * Nguyên tắc giữ lại từ bản đầu: câu ví dụ lấy từ **bài người học vừa đọc** vẫn
 * tốt hơn câu do máy sinh, vì thứ cần nhớ là cách dùng trong ngữ cảnh đã gặp.
 * Nên `passage` là tuỳ chọn: có thì lấy câu thật trong đó, không có thì mới sinh.
 *
 * Phần thuần ở đây — dựng prompt, parse, chọn câu — tách khỏi lời gọi mạng để
 * test được mà không cần LLM.
 */

export interface EnrichedTerm {
  /** Dạng chuẩn của cụm, đã sửa chính tả và đưa về nguyên thể nếu cần. */
  term: string;
  kind: VocabKind;
  /** Nghĩa tiếng Việt, ngắn. */
  meaning: string;
  /** Câu ví dụ — lấy từ `passage` nếu tìm được, không thì do model sinh. */
  example: string;
  /** True khi câu ví dụ lấy từ chính bài người học đọc. */
  fromPassage: boolean;
  /** 2–3 cụm hay đi cùng, để thấy cách dùng thay vì nghĩa rời. */
  collocations: string[];
  /** Model không nhận ra cụm này, hoặc nó không đáng học. */
  note?: string;
}

const SYSTEM_PROMPT = `You help a Vietnamese IELTS learner turn raw vocabulary notes into study cards.

For each term the learner gives you, return:
- "term": the clean citation form. Fix spelling and spacing. Keep multi-word phrases as phrases; put verbs in base form unless the phrase only exists in an inflected form.
- "kind": "collocation" for multi-word phrases, phrasal verbs and fixed expressions; "vocab" for single words.
- "meaning": a short Vietnamese gloss, at most 12 words. No English in this field.
- "example": ONE natural sentence using the term, at IELTS academic-writing register, 12-25 words.
- "collocations": 2-3 other words or phrases this term commonly combines with. Empty array if none are worth knowing.
- "note": only when the term is misspelled beyond recognition, is not English, or is too basic to be worth a card. Otherwise omit.

Rules:
- Never invent a meaning for something you do not recognise. Say so in "note" instead.
- The example must show the term doing real work, not a definition sentence.
- Return one entry per input term, in the same order, even for terms you flag in "note".

Reply with ONLY a JSON object, no markdown fences:
{"terms":[{"term":string,"kind":string,"meaning":string,"example":string,"collocations":string[],"note":string?}]}`;

export interface EnrichInput {
  terms: string[];
  /** Đoạn văn người học vừa đọc. Có thì câu ví dụ lấy từ đây. */
  passage?: string;
  model?: string;
}

/** Tách danh sách người học dán vào: mỗi dòng, hoặc ngăn bằng dấu phẩy. */
export function parseTermList(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const piece of raw.split(/[\n,;]+/)) {
    const term = piece
      .trim()
      .replace(/^[-*•\d.)\s]+/, "")
      .trim();
    if (!term) continue;
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(term);
  }
  return out;
}

/** Số cụm tối đa nhận trong một lần, để một lần dán nhầm không thành 200 thẻ. */
export const MAX_TERMS_PER_LOOKUP = 12;

/**
 * Câu trong `passage` có chứa `term`. Trả `null` khi không tìm được, để bên gọi
 * dùng câu do model sinh thay thế.
 */
export function sentenceContaining(
  passage: string,
  term: string,
): string | null {
  // Cắt câu ở . ! ? và xuống dòng; giữ nguyên dấu để câu đọc được như thật.
  const sentences = passage
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  // Dùng chung bộ khớp với `makeVocabCard`: nếu tìm được câu bằng luật này thì
  // chắc chắn che được chỗ trống trên mặt trước thẻ.
  return sentences.find((s) => findTermSpan(s, term)) ?? null;
}

function asKind(value: unknown): VocabKind {
  return value === "vocab" ? "vocab" : "collocation";
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((x) => x.trim())
    .slice(0, 3);
}

/** Parse phòng thủ — export riêng để test được mà không cần gọi LLM. */
export function parseEnrichment(
  raw: string,
  requested: string[],
  passage?: string,
): EnrichedTerm[] {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Không đọc được kết quả tra cứu. Thử lại giúp tôi.");
  }

  const list = (parsed as { terms?: unknown })?.terms;
  if (!Array.isArray(list)) {
    throw new Error("Kết quả tra cứu thiếu danh sách cụm từ.");
  }

  return list.slice(0, requested.length).map((entry, index) => {
    const row = (entry ?? {}) as Record<string, unknown>;
    const term =
      typeof row.term === "string" && row.term.trim()
        ? row.term.trim()
        : requested[index];
    const generated = typeof row.example === "string" ? row.example.trim() : "";
    const found = passage ? sentenceContaining(passage, term) : null;

    return {
      term,
      kind: asKind(row.kind),
      meaning: typeof row.meaning === "string" ? row.meaning.trim() : "",
      example: found ?? generated,
      fromPassage: Boolean(found),
      collocations: asStringList(row.collocations),
      note:
        typeof row.note === "string" && row.note.trim()
          ? row.note.trim()
          : undefined,
    };
  });
}

export async function enrichTerms(input: EnrichInput): Promise<EnrichedTerm[]> {
  const terms = input.terms.slice(0, MAX_TERMS_PER_LOOKUP);
  if (terms.length === 0) return [];

  const client = getLLM();
  const userContent = [
    input.passage
      ? `The learner read this passage:\n${input.passage.slice(0, 4000)}\n`
      : "",
    `Terms:\n${terms.map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const completion = await client.chat.completions.create({
    model: input.model ?? LLM_MODEL(),
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
  });

  return parseEnrichment(
    completion.choices[0]?.message?.content ?? "",
    terms,
    input.passage,
  );
}

/** Mặt sau của thẻ: nghĩa cộng các cụm hay đi cùng. */
export function backOf(entry: EnrichedTerm): string {
  const parts = [entry.meaning].filter(Boolean);
  if (entry.collocations.length > 0) {
    parts.push(`Hay đi với: ${entry.collocations.join(", ")}`);
  }
  return parts.join(" · ");
}
