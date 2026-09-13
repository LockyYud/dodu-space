"use server";

import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireIeltsUser } from "@/lib/auth/guard";
import { db, schema } from "@/lib/ielts/db";
import {
  type NotionPropertySchema,
  weeklyNotionPageProperties,
} from "@/lib/ielts/notion-weekly";
import { type ActionResult, fail, ok } from "@/lib/ielts/result";
import { isoWeekPeriod } from "@/lib/ielts/weekly-summary";
import { getWeeklyEnglishSummary } from "./weekly-summary";

const NOTION_VERSION = "2022-06-28";
const NOTION_API = "https://api.notion.com/v1";

function notionConfig() {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_WEEKLY_DATA_DATABASE_ID;
  if (!token || !databaseId) {
    throw new Error(
      "Chưa cấu hình NOTION_TOKEN hoặc NOTION_WEEKLY_DATA_DATABASE_ID trên Vercel.",
    );
  }
  return { token, databaseId };
}

async function notionRequest<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${NOTION_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Notion trả ${response.status}: ${await response.text()}`);
  }
  return response.json() as Promise<T>;
}

function summaryBlocks(summary: unknown) {
  const text = JSON.stringify(summary, null, 2);
  const chunks = text.match(/[\s\S]{1,1900}/g) ?? [text];
  return chunks.map((content) => ({
    object: "block",
    type: "code",
    code: {
      language: "json",
      rich_text: [{ type: "text", text: { content } }],
    },
  }));
}

async function appendBlocks(
  token: string,
  pageId: string,
  blocks: ReturnType<typeof summaryBlocks>,
) {
  for (let index = 0; index < blocks.length; index += 100) {
    await notionRequest(token, `/blocks/${pageId}/children`, {
      method: "PATCH",
      body: JSON.stringify({ children: blocks.slice(index, index + 100) }),
    });
  }
}

async function replaceBlocks(
  token: string,
  pageId: string,
  blocks: ReturnType<typeof summaryBlocks>,
) {
  let hasChildren = true;
  do {
    const children = await notionRequest<{
      results: { id: string }[];
    }>(token, `/blocks/${pageId}/children?page_size=100`);
    for (const child of children.results) {
      await notionRequest(token, `/blocks/${child.id}`, { method: "DELETE" });
    }
    hasChildren = children.results.length > 0;
  } while (hasChildren);
  await appendBlocks(token, pageId, blocks);
}

/** User-triggered, authenticated push. Notion is a mirror; Turso stays canonical. */
export async function syncWeeklyEnglishData(
  week: string,
): Promise<ActionResult<{ pageId: string; unchanged: boolean }>> {
  await requireIeltsUser();
  try {
    isoWeekPeriod(week);
    const { token, databaseId } = notionConfig();
    const summary = await getWeeklyEnglishSummary(week);
    const summaryHash = createHash("sha256")
      .update(JSON.stringify(summary))
      .digest("hex");
    const [existing] = await db
      .select()
      .from(schema.weeklyNotionSync)
      .where(eq(schema.weeklyNotionSync.week, week))
      .limit(1);
    if (existing?.summaryHash === summaryHash) {
      return ok({ pageId: existing.notionPageId, unchanged: true });
    }

    const syncedAt = new Date().toISOString();
    const database = await notionRequest<{
      properties: Record<string, NotionPropertySchema>;
    }>(token, `/databases/${databaseId}`);
    const properties = weeklyNotionPageProperties(
      database.properties,
      summary,
      syncedAt,
    );
    let pageId = existing?.notionPageId;
    if (pageId) {
      await notionRequest(token, `/pages/${pageId}`, {
        method: "PATCH",
        body: JSON.stringify({ properties }),
      });
    } else {
      const blocks = summaryBlocks(summary);
      const page = await notionRequest<{ id: string }>(token, "/pages", {
        method: "POST",
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties,
          children: blocks.slice(0, 100),
        }),
      });
      pageId = page.id;
      const remaining = blocks.slice(100);
      if (remaining.length) await appendBlocks(token, pageId, remaining);
    }
    if (existing) {
      await replaceBlocks(token, pageId, summaryBlocks(summary));
      await db
        .update(schema.weeklyNotionSync)
        .set({ syncedAt, summaryHash })
        .where(eq(schema.weeklyNotionSync.week, week));
    } else {
      await db.insert(schema.weeklyNotionSync).values({
        week,
        notionPageId: pageId,
        syncedAt,
        summaryHash,
      });
    }
    revalidatePath("/ielts/today");
    return ok({ pageId, unchanged: false });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Sync Notion thất bại.",
    );
  }
}
