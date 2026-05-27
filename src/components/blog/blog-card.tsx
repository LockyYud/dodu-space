import { ArrowRight } from "lucide-react";
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
      <div className="transition-all duration-200 hover:-translate-y-1">
        <GradientCard className="hover:border-[var(--color-accent-text)]/40 hover:shadow-[0_16px_32px_-16px_color-mix(in_oklab,var(--color-accent-text),transparent_60%)]">
          <Card className="flex h-full flex-col border-0 bg-transparent">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Badge
                  variant="secondary"
                  className="bg-[var(--color-accent-text)]/10 text-xs text-[var(--color-accent-text)]"
                >
                  {primaryTag}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {minutes} <LocalizedText vi="phút" en="min" />
                </span>
              </div>
              <CardTitle className="text-base leading-snug [overflow-wrap:anywhere] group-hover:text-[var(--color-accent-text)]">
                {post.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-3">
              {post.summary ? (
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {post.summary}
                </p>
              ) : null}
              <div className="flex items-end justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {(post.tags ?? []).slice(1, 4).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-muted/50 text-xs text-muted-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {/* Click affordance */}
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground/60 transition-colors group-hover:text-[var(--color-accent-text)]">
                  <LocalizedText vi="Đọc" en="Read" />
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        </GradientCard>
      </div>
    </Link>
  );
}
