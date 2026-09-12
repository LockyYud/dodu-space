/**
 * Provenance for a persisted IELTS evaluation.
 *
 * The JSON columns that use this contract intentionally keep their payload
 * versioned.  A later evaluator can add a new version without changing the
 * tables that store the result or silently reinterpreting old feedback.
 */

export const EVALUATION_METADATA_VERSION = 1 as const;

/** Rubric revision used when a human records IELTS Speaking criteria. */
export const SPEAKING_RUBRIC_VERSION = "ielts-speaking-rubric.v1";

export const EVALUATION_METHODS = ["ai", "manual", "source"] as const;
export type EvaluationMethod = (typeof EVALUATION_METHODS)[number];

/** One observable step used to produce an evaluation. */
export interface EvaluationStage {
  purpose: string;
  model?: string | null;
  prompt_version?: string | null;
  rubric_version?: string | null;
  sample_count?: number | null;
  evaluated_at: string;
}

/**
 * Versioned evaluation provenance stored in `*_evaluation_meta_json` columns.
 *
 * `source` is optional because an AI/manual evaluation may not have an
 * external source; when `method` is `source`, callers should populate it with
 * the source identifier or URL.
 */
export interface EvaluationMetadata {
  version: typeof EVALUATION_METADATA_VERSION;
  method: EvaluationMethod;
  source?: string | null;
  stages: EvaluationStage[];
}

/** Build an AI provenance payload while keeping the stage contract typed. */
export function makeAiEvaluationMetadata(
  stages: EvaluationStage[],
  source?: string | null,
): EvaluationMetadata {
  return {
    version: EVALUATION_METADATA_VERSION,
    method: "ai",
    ...(source === undefined ? {} : { source }),
    stages,
  };
}
