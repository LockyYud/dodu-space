import type { ErrorType } from "./schema";

/**
 * Closed list of grammar/usage rules the extraction pass may tag an error with.
 *
 * Why a closed list: the old grader returned free-form cards, so four missing
 * plural endings in one paragraph became four separate flashcards while a
 * single card bundled four unrelated mistakes. Tagging by rule lets the app
 * merge duplicates within a submission and count repeat offences across
 * submissions — which is what "lỗi cứng đầu" should actually mean.
 */

export const ERROR_RULES = {
  "plural-s": {
    label: "Danh từ số nhiều thiếu -s",
    errorType: "grammar",
  },
  sva: {
    label: "Hoà hợp chủ ngữ và động từ",
    errorType: "grammar",
  },
  "tense-consistency": {
    label: "Thì không nhất quán",
    errorType: "grammar",
  },
  "tense-choice": {
    label: "Chọn sai thì",
    errorType: "grammar",
  },
  article: {
    label: "Mạo từ a / an / the",
    errorType: "grammar",
  },
  "prep-time": {
    label: "Giới từ thời gian",
    errorType: "grammar",
  },
  "prep-place": {
    label: "Giới từ nơi chốn",
    errorType: "grammar",
  },
  "prep-verb": {
    label: "Giới từ đi với động từ",
    errorType: "grammar",
  },
  "word-form": {
    label: "Sai từ loại",
    errorType: "grammar",
  },
  "adverb-position": {
    label: "Vị trí trạng từ",
    errorType: "grammar",
  },
  "run-on": {
    label: "Câu dính, thiếu liên kết",
    errorType: "grammar",
  },
  fragment: {
    label: "Câu thiếu thành phần",
    errorType: "grammar",
  },
  countable: {
    label: "Đếm được và không đếm được",
    errorType: "grammar",
  },
  "word-choice": {
    label: "Chọn sai từ",
    errorType: "vocab",
  },
  collocation: {
    label: "Cụm từ không tự nhiên",
    errorType: "collocation",
  },
  register: {
    label: "Văn phong quá thân mật",
    errorType: "vocab",
  },
  repetition: {
    label: "Lặp từ",
    errorType: "vocab",
  },
  linking: {
    label: "Từ nối dùng sai hoặc nhồi",
    errorType: "coherence",
  },
  paragraphing: {
    label: "Chia đoạn và câu chủ đề",
    errorType: "coherence",
  },
  reference: {
    label: "Đại từ tham chiếu không rõ",
    errorType: "coherence",
  },
  punctuation: {
    label: "Dấu câu và viết hoa",
    errorType: "grammar",
  },
  spelling: {
    label: "Chính tả",
    errorType: "spelling",
  },
  // Fallback so an error tagged with an unknown rule is still kept rather
  // than silently dropped.
  other: {
    label: "Khác",
    errorType: "grammar",
  },
} satisfies Record<string, { label: string; errorType: ErrorType }>;

export type ErrorRule = keyof typeof ERROR_RULES;

export const ERROR_RULE_IDS = Object.keys(ERROR_RULES) as ErrorRule[];

export function isErrorRule(value: unknown): value is ErrorRule {
  return typeof value === "string" && value in ERROR_RULES;
}

export function ruleLabel(rule: string): string {
  return isErrorRule(rule) ? ERROR_RULES[rule].label : rule;
}

export function ruleErrorType(rule: string): ErrorType {
  return isErrorRule(rule) ? ERROR_RULES[rule].errorType : "grammar";
}

/**
 * The five rule groups the return phase exists to eliminate, taken from the
 * learner's own first free-write (ROADMAP v3 §2).
 */
export const FOUNDATION_RULES: ErrorRule[] = [
  "plural-s",
  "sva",
  "tense-consistency",
  "prep-time",
  "punctuation",
];
