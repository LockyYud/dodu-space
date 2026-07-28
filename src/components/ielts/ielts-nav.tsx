"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/ielts", label: "Tổng quan" },
  { href: "/ielts/today", label: "Hôm nay" },
  { href: "/ielts/writing", label: "Writing" },
  { href: "/ielts/track", label: "Reading/Listening" },
  { href: "/ielts/speaking", label: "Speaking" },
  { href: "/ielts/review", label: "Ôn tập (SRS)" },
  { href: "/ielts/errors", label: "Kho lỗi" },
  { href: "/ielts/progress", label: "Tiến độ" },
] as const;

export function IeltsNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-8 flex flex-wrap gap-1 border-b pb-2">
      {LINKS.map((l) => {
        const active =
          l.href === "/ielts"
            ? pathname === l.href
            : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
