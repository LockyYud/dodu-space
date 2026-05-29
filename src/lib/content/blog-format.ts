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
