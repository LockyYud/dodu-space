"use client";

import { Languages } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

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

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const next = language === "vi" ? "EN" : "VI";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-1.5 px-2 tech-mono text-xs text-muted-foreground"
      aria-label={
        language === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"
      }
      onClick={toggleLanguage}
    >
      <Languages className="size-3.5" />
      {next}
    </Button>
  );
}
