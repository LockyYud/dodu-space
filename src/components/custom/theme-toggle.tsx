"use client";

import { useTheme } from "next-themes";

/**
 * A word, not a sun. Both labels render and CSS picks one off the `dark` class
 * that next-themes sets before paint, so there is no hydration mismatch and no
 * mounted-state flicker — the same trick the icon version used.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Switch color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="meta text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="hidden dark:inline">light</span>
      <span className="inline dark:hidden">dark</span>
    </button>
  );
}
