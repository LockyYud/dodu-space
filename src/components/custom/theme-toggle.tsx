"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Render cả 2 icon, ẩn bằng CSS để tránh layout shift và hydration mismatch */}
      <Sun
        className={`size-4 ${isDark ? "block" : "hidden"}`}
        aria-hidden={!isDark}
      />
      <Moon
        className={`size-4 ${isDark ? "hidden" : "block"}`}
        aria-hidden={isDark}
      />
    </Button>
  );
}
