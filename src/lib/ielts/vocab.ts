/**
 * Thẻ từ vựng bắt từ bài đọc hằng ngày — METHOD-REVIEW §4.
 *
 * SRS trước đây chỉ chứa thẻ lỗi, nên từ vựng nằm hoàn toàn ngoài hệ thống dù
 * lexical resource là một trong bốn tiêu chí chấm cả Writing lẫn Speaking.
 *
 * Thuần hàm, không chạm database, để luật dựng thẻ có thể test được.
 */

export type VocabKind = "vocab" | "collocation";

export interface VocabInput {
  term: string;
  /** Câu chứa cụm từ. Bắt buộc: thứ cần nhớ là cách dùng, không phải nghĩa rời. */
  context: string;
  kind: VocabKind;
}

export interface VocabCard {
  front: string;
  back: string;
  explanation: string | null;
  /** Khoá so trùng, để bắt lại cùng một cụm không sinh thẻ thứ hai. */
  key: string;
}

/** Bỏ dấu câu và khoảng trắng thừa, hạ chữ thường — chỉ để so trùng. */
export function normalizeTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Thay lần xuất hiện đầu tiên của `term` trong `context` bằng chỗ trống. */
function blankOut(context: string, term: string): string | null {
  const index = context.toLowerCase().indexOf(term.toLowerCase());
  if (index < 0) return null;
  const after = context.slice(index + term.length);
  return `${context.slice(0, index)}____${after}`;
}

/**
 * Dựng thẻ ở dạng **điền vào chỗ trống trong chính câu đã gặp**, không phải
 * dạng từ → nghĩa. Ôn kiểu đó là nhớ lại cách dùng, đúng thứ Writing và
 * Speaking cần, thay vì nhớ một nghĩa rời không biết ghép vào đâu.
 */
export function makeVocabCard(input: VocabInput): VocabCard {
  const term = input.term.trim();
  const context = input.context.trim();
  if (!term) throw new Error("Chưa nhập cụm từ.");
  if (!context)
    throw new Error("Cần câu chứa cụm từ, không nhận từ đứng một mình.");

  const blanked = blankOut(context, term);
  return {
    // Không tìm thấy nguyên dạng thì thường là do biến thể (số nhiều, thì).
    // Vẫn giữ nguyên câu làm mặt trước, chỉ mất chỗ trống.
    front: blanked ?? context,
    back: term,
    explanation: blanked ? null : "Cụm từ xuất hiện ở dạng biến thể trong câu.",
    key: normalizeTerm(term),
  };
}

/** Ghép ngữ cảnh mới vào thẻ cũ khi bắt lại đúng một cụm từ. */
export function appendContext(
  existing: string | null,
  context: string,
): string {
  const previous = (existing ?? "").trim();
  const next = context.trim();
  if (!previous) return next;
  if (previous.includes(next)) return previous;
  return `${previous}\n---\n${next}`;
}
