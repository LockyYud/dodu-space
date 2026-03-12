import Link from "next/link";

import { CodeBlock } from "@/components/mdx/code-block";

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
  code: (props: React.ComponentProps<"code">) => (
    <code className="rounded bg-muted px-1 py-0.5 text-[0.875em]" {...props} />
  ),
} satisfies Record<string, unknown>;
