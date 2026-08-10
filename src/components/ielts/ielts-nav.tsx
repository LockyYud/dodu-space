"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/server/ielts/auth";

const LINKS = [
  { href: "/ielts", label: "Tổng quan" },
  { href: "/ielts/today", label: "Hôm nay" },
  { href: "/ielts/writing", label: "Writing" },
  { href: "/ielts/track", label: "Reading/Listening" },
  { href: "/ielts/speaking", label: "Speaking" },
  { href: "/ielts/review", label: "Ôn tập (SRS)" },
  { href: "/ielts/errors", label: "Kho lỗi" },
  { href: "/ielts/progress", label: "Tiến độ" },
  { href: "/ielts/settings", label: "Hồ sơ học" },
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
      <div className="flex flex-wrap gap-1">
        {LINKS.map((l) => {
          const active =
            l.href === "/ielts"
              ? pathname === l.href
              : pathname.startsWith(l.href);
          if (l.href === "/ielts/settings") {
            // Plain <a>, not <Link>: a client-side transition into this
            // page briefly remounts the (client) profile form a few times
            // right after navigation, which can wipe out an edit typed in
            // that window before it settles. A full navigation renders
            // once and never re-mounts underneath the learner, so the
            // editable settings form gets a hard link instead of a soft
            // one.
            return (
              <a key={l.href} href={l.href} className={NAV_LINK_CLASS(active)}>
                {l.label}
              </a>
            );
          }
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
      <form action={logout}>
        <button
          type="submit"
          className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          Đăng xuất
        </button>
      </form>
    </nav>
  );
}
