"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { overallOf } from "@/lib/ielts/bands";
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

export async function addBand(input: AddBandInput): Promise<number> {
  await requireIeltsUser();
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
  // id as a tiebreak so two rows on the same day stay in insertion order.
  return db
    .select()
    .from(schema.bandHistory)
    .orderBy(desc(schema.bandHistory.date), desc(schema.bandHistory.id));
}
