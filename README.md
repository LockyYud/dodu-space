# dodu-space

Personal site: portfolio, RAG/LLM engineering notes, and a private IELTS
tracker. Next.js App Router, Tailwind v4, MDX content on the filesystem.

## Getting started

```bash
npm run dev      # webpack dev server (dev:turbo for turbopack)
npm run build
npm run lint     # biome check
npx tsc --noEmit # typecheck (no test runner for the site)
```

Content lives in `content/blog/**` and `content/projects/*.mdx` as MDX with
gray-matter frontmatter. Note that YAML turns an unquoted `date: 2026-05-16`
into a Date object, which is why `src/lib/content/schema.ts` accepts both a
string and a Date.

## Design system

The site is **editorial**: it reads like a technical journal, not a dashboard.
Serif carries the argument, mono carries the evidence. Keep it that way — the
previous look drifted into the generic dark-card-and-chip template.

**Type.** Two families only, both loaded in `src/app/layout.tsx`:
Newsreader (serif, weights 300–500 plus italic) for body, headings and nav;
IBM Plex Mono for metadata, slugs, counters and code. Both include the
`vietnamese` subset — do not drop it. Headings are weight 300–400, never bold.

**Color.** Tokens live in `src/app/globals.css` as oklch. Light is a warm cream
ground (`--background`) with near-black warm text; dark is a warm charcoal with
ivory text. One accent, `--accent-text`, an earth orange — used for links,
counters and the active state, never for filling areas. Variable names stay
shadcn-compatible so the IELTS and quiz sub-apps keep rendering.

**Rules over boxes.** There are no cards. Sections separate with a hairline:
`border-border` for a structural rule, `border-border-soft` between rows.
`--radius` is 0.125rem, so nothing reads as a rounded panel. No shadows, no
rings, no translucent surfaces, no backdrop blur, and no background grid.

**Utilities** (`globals.css`): `.eyebrow` for the small mono section label
(`.eyebrow-accent` to tint it), `.meta` for mono metadata, `.link-action` for
the italic accent link ending in `→`, `.prose-post` for long-form article
typography, `.paper-note` for the citation colophon that opens reading notes.

**Layout.** `max-w-6xl` with a 12-column grid on desktop: a 3-column label
rail on the left, 9 columns of content. Index pages are rows
(`components/blog/post-row.tsx`, `components/project/project-row.tsx`), never
grids of cards.

**Icons.** Lucide is for controls only — theme toggle, mobile menu, search.
Content sections use numerals (I/II/III, 01/02/03) instead of decorative icons.

**Code blocks** keep a dark ground in both themes, so `rehype-pretty-code` uses
a single shiki theme (`vitesse-dark`) in `src/lib/content/mdx.ts`.

**Watch out for two things.** The `[data-i18n]` rule at the bottom of
`globals.css` is what hides the inactive language in `LocalizedText`; losing it
duplicates every bilingual string. And when a mono list can wrap into a narrow
column, join it with commas rather than ` · ` — a separator that lands at the
start of a line looks like a typo.
