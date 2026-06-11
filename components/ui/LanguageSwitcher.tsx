"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  function switchTo(lang: string) {
    if (currentLang === lang) return;
    localStorage.setItem("i18nextLng", lang);
    void i18n.changeLanguage(lang);
  }

  return (
    <div className="flex items-center rounded-md border p-0.5">
      {(["en", "zh"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchTo(lang)}
          aria-label={lang === "en" ? "Switch to English" : "切换到中文"}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            currentLang === lang
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {lang === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}

