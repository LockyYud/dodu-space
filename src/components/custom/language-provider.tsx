"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Language = "vi" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "dodu-space-language";

export function LanguageProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    const saved = globalThis.localStorage.getItem(STORAGE_KEY);
    if (saved === "vi" || saved === "en") setLanguageState(saved);
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    globalThis.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
    document.documentElement.dataset.language = next;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(language === "vi" ? "en" : "vi"),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

/**
 * Both languages, always visible, the active one lit. A translate icon plus
 * the *next* language was two puzzles at once: an unreadable glyph at 14px,
 * and a label that showed the state you were leaving.
 */
export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="meta flex items-baseline gap-1 text-muted-foreground">
      {(["vi", "en"] as const).map((code, index) => (
        <span key={code} className="flex items-baseline gap-1">
          {index > 0 ? (
            <span aria-hidden="true" className="text-muted-foreground/50">
              /
            </span>
          ) : null}
          <button
            type="button"
            aria-label={
              code === "vi" ? "Chuyển sang tiếng Việt" : "Switch to English"
            }
            aria-current={language === code}
            onClick={() => setLanguage(code)}
            className={cn(
              "transition-colors",
              language === code ? "text-foreground" : "hover:text-foreground",
            )}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
