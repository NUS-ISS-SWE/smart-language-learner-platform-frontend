"use client";

import { useMemo, useSyncExternalStore } from "react";
import i18n from "./config";

const subscribe = (notify: () => void) => {
  i18n.on("languageChanged", notify);
  return () => {
    i18n.off("languageChanged", notify);
  };
};
const getLanguage = () => i18n.resolvedLanguage ?? "en";
const getServerLanguage = () => "en";

// Each streamed boundary first hydrates in the server language. It then reads
// the live preference, even when the provider changed language before it mounted.
export function useTranslation(namespace = "common") {
  const language = useSyncExternalStore(
    subscribe,
    getLanguage,
    getServerLanguage,
  );
  const t = useMemo(
    () => i18n.getFixedT(language, namespace),
    [language, namespace],
  );
  return { t, i18n, language };
}
