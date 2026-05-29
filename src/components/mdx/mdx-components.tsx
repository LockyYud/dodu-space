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
  code: (props: React.ComponentProps<"code">) => (
    <code className="rounded bg-muted px-1 py-0.5 text-[0.875em]" {...props} />
  ),
} satisfies Record<string, unknown>;
