export interface ReadingArticle {
  title: string;
  url: string;
  source: string;
  summary: string;
  level?: string;
  date?: string;
}

const BNE_HOME = "https://breakingnewsenglish.com/";
const BBC_WORLD_RSS = "https://feeds.bbci.co.uk/news/world/rss.xml";

export async function getReadingArticles(limit = 4): Promise<ReadingArticle[]> {
  const articles = await fetchBreakingNewsEnglish(limit);
  if (articles.length > 0) return articles;
  return fetchBbcWorld(limit);
}

async function fetchBreakingNewsEnglish(
  limit: number,
): Promise<ReadingArticle[]> {
  try {
    const html = await fetchText(BNE_HOME);
    const chunks = html.split(/<article\b/i).slice(1);
    const articles: ReadingArticle[] = [];

    for (const chunk of chunks) {
      const titleMatch = chunk.match(
        /<header><h3><a\s+href="([^"]+)"[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/a><\/h3><\/header>/i,
      );
      if (!titleMatch) continue;

      const href = titleMatch[1] ?? "";
      const title = cleanText(titleMatch[3] ?? "");
      const summary = cleanText(titleMatch[2] ?? "");
      const dateLevel = cleanText(
        chunk.match(
          /<div class="smallfont"><strong>([\s\S]*?)<\/strong><\/div>/i,
        )?.[1] ?? "",
      );
      const level =
        chunk.match(/href="([^"]+-1\.html)">Level 1<\/a>/i)?.[1] ??
        chunk.match(/href="([^"]+-2\.html)">Level 2<\/a>/i)?.[1] ??
        chunk.match(/href="([^"]+-4\.html)">Level 4<\/a>/i)?.[1] ??
        href;

      if (!title || !href) continue;
      articles.push({
        title,
        url: absoluteUrl(level),
        source: "Breaking News English",
        summary,
        level: dateLevel || "Graded ESL article",
        date: dateLevel.split("-")[0]?.trim(),
      });
      if (articles.length >= limit) break;
    }

    return articles;
  } catch {
    return [];
  }
}

async function fetchBbcWorld(limit: number): Promise<ReadingArticle[]> {
  try {
    const xml = await fetchText(BBC_WORLD_RSS);
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .map((m) => m[1] ?? "")
      .map((item) => ({
        title: cleanText(tag(item, "title")),
        url: cleanText(tag(item, "link")),
        source: "BBC News",
        summary: cleanText(tag(item, "description")),
        date: cleanText(tag(item, "pubDate")),
      }))
      .filter((a) => a.title && a.url)
      .slice(0, limit);
  } catch {
    return [];
  }
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "user-agent": "dodu-space IELTS reading picker",
    },
    next: { revalidate: 60 * 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

function tag(xml: string, name: string): string {
  return (
    xml.match(
      new RegExp(
        `<${name}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${name}>`,
        "i",
      ),
    )?.[1] ??
    xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] ??
    ""
  );
}

function absoluteUrl(href: string): string {
  return new URL(href, BNE_HOME).toString();
}

function cleanText(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}
