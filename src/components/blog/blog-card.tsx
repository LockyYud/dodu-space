import Link from "next/link";

import { GradientCard } from "@/components/custom/gradient-card";
import { LocalizedText } from "@/components/custom/localized-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPost } from "@/lib/content/blog";

export function BlogCard({ post }: Readonly<{ post: BlogPost }>) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const minutes = post.readingMinutes ?? 1;
  const primaryTag = post.tags?.[0] ?? "Notes";

  return (
    <Link href={`/blog/${post.slug}`} className="group block min-w-0">
      <div className="transition-all duration-200 hover:-translate-y-0.5">
        <GradientCard className="hover:shadow-[0_12px_30px_-18px_color-mix(in_oklab,var(--color-accent-text),transparent_70%)]">
          <Card className="h-full border-0 bg-transparent">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Badge
                  variant="secondary"
                  className="tech-mono bg-[var(--color-accent-text)]/10 text-[10px] text-[var(--color-accent-text)]"
                >
                  {primaryTag}
                </Badge>
                <span className="tech-mono text-[10px] text-muted-foreground">
                  {minutes} <LocalizedText vi="phút" en="min" />
                </span>
              </div>
              <CardTitle className="text-base [overflow-wrap:anywhere] group-hover:text-[var(--color-accent-text)]">
                {post.title}
              </CardTitle>
              <p className="tech-mono text-xs text-muted-foreground">
                {formattedDate}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {post.summary ? (
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {post.summary}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {(post.tags ?? []).slice(1, 5).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="tech-mono bg-muted/50 text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </GradientCard>
      </div>
    </Link>
  );
}
