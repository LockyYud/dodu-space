"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/server/ielts/auth";

const LINKS = [
  { href: "/ielts/today", label: "Hôm nay" },
  { href: "/ielts/review", label: "Ôn lỗi" },
  { href: "/ielts/journey", label: "Hành trình" },
  { href: "/ielts/analytics", label: "Phân tích" },
] as const;

const UTILITY_LINKS = [
  { href: "/ielts/errors", label: "Kho lỗi" },
  { href: "/ielts/settings", label: "Hồ sơ" },
] as const;

// Every /ielts page is force-dynamic and per-request, so prefetching it
// buys nothing — it's off across this nav.
const NAV_LINK_CLASS = (active: boolean) =>
  cn(
    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
    active
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
  );

export function IeltsNav() {
  const pathname = usePathname();
  if (pathname === "/ielts/login") return null;

  return (
    <nav className="mb-8 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
      <div className="flex min-w-0 flex-wrap gap-1">
        {LINKS.map((l) => {
          const active = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              prefetch={false}
              className={NAV_LINK_CLASS(active)}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {UTILITY_LINKS.map((l) => {
          const active = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              prefetch={false}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          );
        })}
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Đăng xuất
          </button>
        </form>
      </div>
    </nav>
  );
}
