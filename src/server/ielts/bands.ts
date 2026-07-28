"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/ielts/db";
import type { BandHistory } from "@/lib/ielts/schema";
import { toISODate } from "@/lib/ielts/srs";

export interface AddBandInput {
  date?: string;
  listening?: number;
  reading?: number;
  writing?: number;
  speaking?: number;
  isMock?: boolean;
  note?: string;
}

/** Overall = mean of the provided skills, rounded to nearest 0.5. */
function overallOf(v: AddBandInput): number | null {
  const vals = [v.listening, v.reading, v.writing, v.speaking].filter(
    (x): x is number => typeof x === "number",
  );
  if (vals.length === 0) return null;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(mean * 2) / 2;
}

export async function addBand(input: AddBandInput): Promise<number> {
  const [row] = await db
    .insert(schema.bandHistory)
    .values({
      date: input.date ?? toISODate(),
      listening: input.listening ?? null,
      reading: input.reading ?? null,
      writing: input.writing ?? null,
      speaking: input.speaking ?? null,
      overall: overallOf(input),
      isMock: input.isMock ?? true,
      note: input.note ?? null,
    })
    .returning({ id: schema.bandHistory.id });
  revalidatePath("/ielts");
  revalidatePath("/ielts/progress");
  return row.id;
}

export async function listBands(): Promise<BandHistory[]> {
  return db
    .select()
    .from(schema.bandHistory)
    .orderBy(desc(schema.bandHistory.date));
}
