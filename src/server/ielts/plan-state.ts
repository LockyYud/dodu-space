"use server";

import { desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import {
  FIRST_PHASE,
  nextPhaseId,
  type PhaseId,
  phaseById,
} from "@/lib/ielts/plan";
import type { PhaseState } from "@/lib/ielts/progress";
import { toISODate } from "@/lib/ielts/srs";

const PHASE_IDS: PhaseId[] = ["return", "format", "build", "taper"];

function isPhaseId(value: string): value is PhaseId {
  return (PHASE_IDS as string[]).includes(value);
}

/**
 * The phase the learner is in, creating the first one on first read.
 * Phases advance only on explicit confirmation (see `advancePhase`), never on
 * a date — roadmap v3 moves on competence, not on the calendar.
 */
export async function currentPhase(): Promise<PhaseState> {
  const [open] = await db
    .select()
    .from(schema.phaseState)
    .where(isNull(schema.phaseState.completedOn))
    .orderBy(desc(schema.phaseState.id))
    .limit(1);

  if (open && isPhaseId(open.phase)) {
    return { phase: open.phase, startedOn: open.startedOn };
  }

  // Re-check inside the write transaction: several loaders call this on the
  // same request, and without the re-check each of them opened its own row.
  const startedOn = toISODate();
  return db.transaction(async (tx) => {
    const [again] = await tx
      .select()
      .from(schema.phaseState)
      .where(isNull(schema.phaseState.completedOn))
      .orderBy(desc(schema.phaseState.id))
      .limit(1);
    if (again && isPhaseId(again.phase)) {
      return { phase: again.phase, startedOn: again.startedOn };
    }
    await tx
      .insert(schema.phaseState)
      .values({ phase: FIRST_PHASE, startedOn });
    return { phase: FIRST_PHASE, startedOn };
  });
}

/**
 * The date the roadmap itself started: when the very first phase opened.
 *
 * This is the only plan anchor that is actually persisted. `learner_profile`
 * is created lazily by the profile form, so until it is saved `plan_start`
 * resolves to `toISODate()` — today, recomputed on every request — and
 * anything measured from it (reduced-load mode) can never come due.
 */
export async function planAnchorDate(): Promise<string | null> {
  const [first] = await db
    .select({ startedOn: schema.phaseState.startedOn })
    .from(schema.phaseState)
    .orderBy(schema.phaseState.id)
    .limit(1);
  return first?.startedOn ?? null;
}

export interface PhaseHistoryRow {
  phase: PhaseId;
  label: string;
  startedOn: string;
  completedOn: string | null;
}

export async function listPhaseHistory(): Promise<PhaseHistoryRow[]> {
  const rows = await db
    .select()
    .from(schema.phaseState)
    .orderBy(schema.phaseState.id);
  return rows
    .filter((row) => isPhaseId(row.phase))
    .map((row) => ({
      phase: row.phase as PhaseId,
      label: phaseById(row.phase as PhaseId).label,
      startedOn: row.startedOn,
      completedOn: row.completedOn,
    }));
}

/**
 * Close the current phase and open the next one. Callers must have checked
 * `canAdvance`; this re-checks nothing on purpose, because the learner is
 * allowed to move on deliberately with the criteria shown unmet.
 */
export async function advancePhase(): Promise<PhaseId | null> {
  await requireIeltsUser();
  const today = toISODate();

  const next = await db.transaction(async (tx) => {
    const [open] = await tx
      .select()
      .from(schema.phaseState)
      .where(isNull(schema.phaseState.completedOn))
      .orderBy(desc(schema.phaseState.id))
      .limit(1);
    if (!open || !isPhaseId(open.phase)) {
      throw new Error("Chưa có giai đoạn nào đang mở.");
    }

    const nextId = nextPhaseId(open.phase);
    if (!nextId) return null;

    await tx
      .update(schema.phaseState)
      .set({ completedOn: today })
      .where(eq(schema.phaseState.id, open.id));
    await tx
      .insert(schema.phaseState)
      .values({ phase: nextId, startedOn: today });
    return nextId;
  });

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
  return next;
}
