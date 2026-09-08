"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import {
  mondayOf,
  WEEK_LOAD_DEFAULT,
  WEEK_LOADS,
  type WeekLoad,
} from "@/lib/ielts/plan";
import { toISODate } from "@/lib/ielts/srs";

function isWeekLoad(value: string): value is WeekLoad {
  return (WEEK_LOADS as string[]).includes(value);
}

/**
 * How heavy the learner said the week containing `date` is.
 *
 * Stored per week rather than on the profile: a busy week is a fact about
 * that week, and the weekly counters have to still make sense when read back
 * months later. An unset week is a normal week.
 */
export async function getWeekLoad(date?: string): Promise<WeekLoad> {
  const weekStart = mondayOf(date ?? toISODate());
  const [row] = await db
    .select()
    .from(schema.weekLoad)
    .where(eq(schema.weekLoad.weekStart, weekStart))
    .limit(1);
  return row && isWeekLoad(row.load) ? row.load : WEEK_LOAD_DEFAULT;
}

export async function setWeekLoad(load: string, date?: string): Promise<void> {
  await requireIeltsUser();
  if (!isWeekLoad(load)) throw new Error(`Mức tải không hợp lệ: ${load}.`);

  const weekStart = mondayOf(date ?? toISODate());
  const updatedAt = new Date().toISOString();
  await db
    .insert(schema.weekLoad)
    .values({ weekStart, load, updatedAt })
    .onConflictDoUpdate({
      target: schema.weekLoad.weekStart,
      set: { load, updatedAt },
    });

  revalidatePath("/ielts/today");
  revalidatePath("/ielts/progress");
}
