import Link from "next/link";

import { CodeBlock } from "@/components/mdx/code-block";
import { slugifyHeading } from "@/lib/content/blog-format";

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: React.ReactNode };
    return getTextContent(props.children);
  }

  return "";
}

function Heading({
  as: Component,
  children,
  ...props
}: React.ComponentProps<"h2"> & { as: "h2" | "h3" }) {
  const id = slugifyHeading(getTextContent(children));

  return (
    <Component id={id} className="scroll-mt-24" {...props}>
      {children}
    </Component>
  );
}

export const MDXComponents = {
  a: ({ href, children, ...props }: React.ComponentProps<"a">) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={children == null ? href : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  pre: (props: React.ComponentProps<"pre">) => <CodeBlock {...props} />,
  h2: (props: React.ComponentProps<"h2">) => <Heading as="h2" {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <Heading as="h3" {...props} />,
  blockquote: ({ children, ...props }: React.ComponentProps<"blockquote">) => {
    // Reading notes open with a Paper/Author/Venue citation. As a quote it
    // reads as an aside; as a mono colophon it reads as the source record.
    const text = getTextContent(children);
    // Every note's citation block ends with a "Loại: <kind>" line; the
    // Paper/Venue pair is the fallback for anything written differently.
    const isCitation =
      /Loại\s*:/i.test(text) ||
      (/Paper/i.test(text) && /Venue|arXiv/i.test(text));

    return (
      <blockquote
        className={isCitation ? "paper-note not-prose" : undefined}
        {...props}
      >
        {children}
      </blockquote>
    );
  },
} satisfies Record<string, unknown>;
