import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

import { MDXComponents } from "@/components/mdx/mdx-components";

export type CompileMdxResult<TFrontmatter extends Record<string, unknown>> = {
  frontmatter: TFrontmatter;
  content: React.ReactNode;
};

export async function compileMdx<TFrontmatter extends Record<string, unknown>>({
  frontmatter,
  source,
}: {
  frontmatter: TFrontmatter;
  source: string;
}): Promise<CompileMdxResult<TFrontmatter>> {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [
          [
            // pretty-code uses shiki under the hood.
            rehypePrettyCode,
            {
              theme: {
                dark: "vitesse-dark",
                light: "vitesse-light",
              },
              keepBackground: false,
            },
          ],
        ],
      },
      // MDX source is already stripped from frontmatter via gray-matter.
      parseFrontmatter: false,
    },
    components: MDXComponents,
  });

  return { frontmatter, content };
}

export const contentPaths = {
  root: path.join(process.cwd(), "content"),
  blog: path.join(process.cwd(), "content", "blog"),
  projects: path.join(process.cwd(), "content", "projects"),
} as const;
