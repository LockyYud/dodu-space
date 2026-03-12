import Link from "next/link";

import { GradientCard } from "@/components/custom/gradient-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPost } from "@/lib/content/blog";

export function BlogCard({ post }: Readonly<{ post: BlogPost }>) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const wordCount = (post.summary ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="transition-all duration-200 hover:-translate-y-0.5">
        <GradientCard className="hover:shadow-[0_12px_30px_-18px_color-mix(in_oklab,var(--color-accent-text),transparent_70%)]">
          <Card className="h-full border-0 bg-transparent">
            <CardHeader className="space-y-2">
              <CardTitle className="text-base group-hover:text-[var(--color-accent-text)]">
                {post.title}
              </CardTitle>
              <p className="tech-mono text-xs text-muted-foreground">
                {formattedDate} • {minutes} min read
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {post.summary ? (
                <p className="text-sm text-muted-foreground">{post.summary}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {(post.tags ?? []).slice(0, 6).map((tag) => (
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
