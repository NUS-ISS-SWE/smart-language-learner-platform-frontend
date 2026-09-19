"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { i18n, language: currentLang } = useTranslation();

  function switchTo(lang: string) {
    if (currentLang === lang) return;
    void i18n.changeLanguage(lang);
    try {
      localStorage.setItem("i18nextLng", lang);
    } catch {
      /* Language switching works without persistence. */
    }
  }

  return (
    <div className="flex items-center rounded-md border p-0.5">
      {(["en", "zh"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchTo(lang)}
          aria-label={lang === "en" ? "Switch to English" : "切换到中文"}
          aria-pressed={currentLang.startsWith(lang)}
          className={cn(
            "min-h-11 min-w-11 rounded px-2.5 py-1 text-xs font-medium transition-colors sm:min-h-9",
            currentLang.startsWith(lang)
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
