"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n/config";

interface I18nProviderProps {
  readonly children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // The translation hook preserves the server snapshot while each streamed
  // boundary hydrates, then observes this stored preference.
  useEffect(() => {
    const updateDocumentLanguage = (language: string) => {
      document.documentElement.lang = language.startsWith("zh") ? "zh" : "en";
    };
    i18n.on("languageChanged", updateDocumentLanguage);
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("i18nextLng");
    } catch {
      /* Use English when storage is unavailable. */
    }
    if (stored && stored !== i18n.language) {
      void i18n.changeLanguage(stored);
    }
    updateDocumentLanguage(i18n.language);
    return () => {
      i18n.off("languageChanged", updateDocumentLanguage);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
