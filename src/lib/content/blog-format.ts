export function formatBlogTitle(title: string) {
  const [prefix, ...rest] = title.split(":");
  const subtitle = prefix?.trim();
  const displayTitle = rest.join(":").trim();

  if (!subtitle || !displayTitle || !/[_-]|\d{4}/.test(subtitle)) {
    return { title, subtitle: null };
  }

  return { title: displayTitle, subtitle };
}

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractToc(source: string): TocItem[] {
  const matches = source.matchAll(/^(##|###)\s+(.+)$/gm);

  return Array.from(matches, ([, marker, text]) => {
    const cleanText = text
      .replace(/\s+#*$/, "")
      .replace(/[`*_~]/g, "")
      .trim();

    return {
      id: slugifyHeading(cleanText),
      text: cleanText,
      level: (marker === "###" ? 3 : 2) as 2 | 3,
    };
  }).filter((item) => item.id && item.text);
}

export type SourceNoteItem = {
  label: string;
  value: string;
};

/**
 * Reading notes open with a blockquote naming the paper, its authors, venue and
 * kind. That belongs beside the article as a standing reference, not buried in
 * the first screen of prose, so it is lifted out of the MDX before compiling.
 *
 * Only a LEADING blockquote carrying a "Loại:" line qualifies; every other
 * blockquote stays in the body as an ordinary quote.
 */
export function extractSourceNote(source: string): {
  items: SourceNoteItem[];
  rest: string;
} {
  const lines = source.split("\n");
  let start = 0;
  while (start < lines.length && lines[start].trim() === "") start += 1;

  let end = start;
  while (end < lines.length && lines[end].trimStart().startsWith(">")) end += 1;

  const block = lines.slice(start, end);
  if (block.length === 0) return { items: [], rest: source };

  const text = block.join("\n");
  const isCitation =
    /\*\*\s*Loại\s*\*\*\s*:/i.test(text) ||
    (/\*\*\s*Paper\s*\*\*\s*:/i.test(text) && /Venue|arXiv/i.test(text));
  if (!isCitation) return { items: [], rest: source };

  const items: SourceNoteItem[] = [];
  for (const raw of block) {
    const line = raw.trimStart().replace(/^>\s?/, "").trim();
    if (line === "") continue;

    const labelled = line.match(/^\*\*(.+?)\*\*\s*:\s*(.*)$/);
    if (labelled) {
      items.push({ label: labelled[1].trim(), value: labelled[2].trim() });
      continue;
    }

    // A wrapped continuation of the previous line.
    const previous = items.at(-1);
    if (previous) previous.value = `${previous.value} ${line}`.trim();
  }

  if (items.length === 0) return { items: [], rest: source };

  return { items, rest: lines.slice(end).join("\n").replace(/^\n+/, "") };
}
