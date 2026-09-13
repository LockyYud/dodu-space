import type { WeeklyEnglishSummary } from "./weekly-summary";

export type NotionPropertySchema = { type: string; [key: string]: unknown };
export type NotionPageProperties = Record<string, unknown>;

function textProperty(type: "title" | "rich_text", content: string) {
  return { [type]: [{ type: "text", text: { content } }] };
}

function required(
  properties: Record<string, NotionPropertySchema>,
  name: string,
  types: readonly string[],
) {
  const property = properties[name];
  if (!property || !types.includes(property.type)) {
    throw new Error(
      `Notion property "${name}" phải có kiểu ${types.join(" hoặc ")}.`,
    );
  }
  return property;
}

function namedProperty(property: NotionPropertySchema, value: string) {
  if (property.type === "rich_text") return textProperty("rich_text", value);
  if (property.type === "select" || property.type === "status") {
    return { [property.type]: { name: value } };
  }
  throw new Error(`Notion property có kiểu ${property.type} không nhận text.`);
}

/**
 * Pure mapping for the actual English Weekly Data schema. `Week` is its Title,
 * not a second rich-text field.
 */
export function weeklyNotionPageProperties(
  properties: Record<string, NotionPropertySchema>,
  summary: WeeklyEnglishSummary,
  syncedAt: string,
): NotionPageProperties {
  required(properties, "Week", ["title"]);
  const status = required(properties, "Status", ["select", "status"]);
  required(properties, "Week Start", ["date"]);
  required(properties, "Week End", ["date"]);
  required(properties, "Total Sessions", ["number"]);
  required(properties, "Total Minutes", ["number"]);
  const source = required(properties, "Source", [
    "rich_text",
    "select",
    "status",
  ]);
  required(properties, "Synced At", ["date"]);
  const version = required(properties, "Data Version", [
    "rich_text",
    "select",
    "status",
  ]);

  return {
    Week: textProperty("title", summary.week),
    Status: { [status.type]: { name: "Ready" } },
    "Week Start": { date: { start: summary.period.start_date } },
    "Week End": { date: { start: summary.period.end_date } },
    "Total Sessions": { number: summary.study.total_sessions },
    "Total Minutes": { number: summary.study.total_minutes },
    Source: namedProperty(source, "dodu-space"),
    "Synced At": { date: { start: syncedAt } },
    "Data Version": namedProperty(version, summary.schema_version),
  };
}
