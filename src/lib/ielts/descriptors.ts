/**
 * Band criteria used by the grading prompt.
 *
 * These are operational PARAPHRASES written for this app, not the official
 * IELTS public band descriptors reproduced verbatim. They exist because the
 * previous prompt compressed the whole rubric into two sentences and left the
 * model to recall the rest, which is why repeated grades of the same essay
 * drifted by a whole band.
 *
 * Keep them concrete and observable: what a marker can point at in the text.
 */

export type CriterionKey =
  | "task_response"
  | "coherence"
  | "lexical"
  | "grammar";

export const CRITERION_LABEL: Record<CriterionKey, string> = {
  task_response: "Task Response",
  coherence: "Coherence & Cohesion",
  lexical: "Lexical Resource",
  grammar: "Grammatical Range & Accuracy",
};

type BandLevels = { 5: string; 6: string; 7: string };

const TASK2_CRITERIA: Record<CriterionKey, BandLevels> = {
  task_response: {
    5: "Addresses the question only partly, or answers a different question than the one asked. A position may be present but is unclear or shifts. Ideas are limited, repeated, or not developed. Key parts of the prompt are ignored.",
    6: "Addresses all parts of the prompt, though some parts more fully than others. A clear position is present throughout. Ideas are relevant but developed generically, with examples that are vague or asserted rather than explained.",
    7: "Addresses all parts of the prompt with a clear, consistent position. Main ideas are extended and supported with specific, concrete reasoning or examples. No irrelevant material and no unanswered part of the question.",
  },
  coherence: {
    5: "Organisation is present but not logical, or paragraphing is missing or arbitrary. Cohesive devices are used inaccurately, over-used, or mechanically repeated. The reader has to work to follow the argument.",
    6: "Information is arranged coherently and there is clear overall progression. Paragraphing is used but not always logically. Cohesive devices are used effectively at times, but can be mechanical, over-used, or faulty. Referencing may be unclear or repetitive.",
    7: "Ideas are logically sequenced with clear progression throughout. Each paragraph has a clear central topic. Cohesive devices are used flexibly and mostly appropriately, without over-use. Referencing is clear.",
  },
  lexical: {
    5: "Limited range, only just adequate for the task. Noticeable repetition. Errors in word choice, word form, or spelling occur often enough to cause difficulty for the reader.",
    6: "Adequate range for the task. Some attempt at less common vocabulary, though with inaccuracy. Errors in word choice, form, or spelling occur but do not impede communication.",
    7: "Sufficient range to allow some flexibility and precision. Uses less common items with some awareness of style and collocation. Occasional errors in word choice or collocation only.",
  },
  grammar: {
    5: "Limited range of structures, mostly simple sentences. Attempts at complex sentences are usually faulty. Grammatical errors are frequent and can make meaning unclear. Punctuation is often faulty.",
    6: "A mix of simple and complex sentence forms. Errors in grammar and punctuation occur, and a few may reduce clarity, but meaning is generally clear. Roughly one error every 2-3 sentences is typical at this level.",
    7: "A variety of complex structures used with control. The majority of sentences are error-free. Errors in grammar and punctuation are few and do not obscure meaning. Roughly one error every 5-6 sentences or fewer.",
  },
};

const TASK1_CRITERIA: Record<CriterionKey, BandLevels> = {
  ...TASK2_CRITERIA,
  task_response: {
    5: "Reports some detail but the overview is missing or unclear. Data may be listed mechanically without comparison, or key features are left out. May include irrelevant detail or personal opinion, which Task 1 does not ask for.",
    6: "Gives an overview with information appropriately selected. Key features are covered but detail may be mechanical, incomplete, or occasionally inaccurate. Comparisons are made but not always the most relevant ones.",
    7: "Gives a clear overview of the main trends or stages. Selects and highlights the key features and supports them with accurate figures. No irrelevant detail and no opinion.",
  },
};

export function criteriaFor(taskType: "task1" | "task2") {
  return taskType === "task1" ? TASK1_CRITERIA : TASK2_CRITERIA;
}

/** Rendered into the system prompt so the model compares, rather than recalls. */
export function renderCriteria(taskType: "task1" | "task2"): string {
  const table = criteriaFor(taskType);
  return (Object.keys(table) as CriterionKey[])
    .map((key) => {
      const levels = table[key];
      return [
        `## ${CRITERION_LABEL[key]} (${key})`,
        `- Band 5: ${levels[5]}`,
        `- Band 6: ${levels[6]}`,
        `- Band 7: ${levels[7]}`,
      ].join("\n");
    })
    .join("\n\n");
}

/**
 * Calibration anchors. Hand-written for this app to pin the two ends of the
 * range the learner is moving through; they are illustrative examples, not
 * official samples.
 */
export const ANCHORS = `### Anchor A — grammar/lexis around band 5
"Nowadays many people prefers to work from home. In my opinion, this trend have both advantage and disadvantage. Firstly, worker can save time. Moreover, they can spend time with family. But company will lose control of staff, and some employee is lazy at home."
Why band 5: frequent subject-verb and plural errors (prefers/have/advantage/employee is), mechanical linkers, simple sentences only, ideas asserted without development.

### Anchor B — grammar/lexis around band 7
"Remote work has reshaped how companies measure productivity. Where managers once relied on visible presence, many now assess output against agreed targets, which suits roles with measurable deliverables. The shift is less comfortable for junior staff, who lose the informal coaching that happens in an office."
Why band 7: varied complex structures with control, mostly error-free, precise collocation (measurable deliverables, informal coaching), ideas extended with reasoning rather than listed.`;
