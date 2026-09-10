"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LanguageToggle,
  useLanguage,
} from "@/components/custom/language-provider";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-6 py-6 md:px-12">
        <Link
          href="/"
          className="text-xl font-medium tracking-tight whitespace-nowrap"
        >
          {siteConfig.title}
        </Link>

        <nav className="hidden items-baseline gap-8 md:flex">
          {navigationConfig.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[17px] italic transition-colors hover:text-[var(--color-accent-text)]",
                isActive(item.href)
                  ? "text-[var(--color-accent-text)]"
                  : "text-foreground",
              )}
            >
              {language === "vi" ? item.title : item.titleEn}
            </Link>
          ))}
        </nav>

        {/* Two controls, not three: with four nav items and one archive page a
            header search button went unused, and a third mono word made the
            cluster read as a list rather than as controls. ⌘K still opens the
            palette — the command palette binds that itself. */}
        <div className="flex items-baseline gap-6">
          <LanguageToggle />
          <ThemeToggle />

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon className="size-4" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px] sm:w-[360px]">
              <SheetHeader>
                <SheetTitle className="eyebrow">Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col px-4">
                {navigationConfig.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className={cn(
                          "border-t border-border-soft py-3 text-lg italic transition-colors first:border-t-0 hover:text-[var(--color-accent-text)]",
                          isActive(item.href) &&
                            "text-[var(--color-accent-text)]",
                        )}
                      />
                    }
                  >
                    {language === "vi" ? item.title : item.titleEn}
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
