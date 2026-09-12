"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import type { AutosaveStatus } from "@/lib/composition-session";
import { useTranslation } from "@/lib/i18n/useTranslation";

type AutosaveIndicatorProps = {
  readonly status: AutosaveStatus;
  readonly lastSavedAt?: Date;
};

export function AutosaveIndicator({
  status,
  lastSavedAt,
}: AutosaveIndicatorProps) {
  const { t, language } = useTranslation("editor");
  if (status === "idle") return null;

  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
        {t("saving")}
      </span>
    );
  }

  if (status === "saved") {
    const time = lastSavedAt?.toLocaleTimeString(
      language === "zh" ? "zh-CN" : "en-GB",
      { hour: "2-digit", minute: "2-digit" },
    );
    return (
      <span
        className="text-xs text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {time ? t("savedAt", { time }) : t("saved")}
      </span>
    );
  }

  if (status === "error") {
    return (
      <span
        className="flex items-center gap-1.5 text-xs text-destructive"
        role="alert"
      >
        <TriangleAlert className="h-3 w-3" aria-hidden="true" />
        {t("saveFailed")}
      </span>
    );
  }

  return null;
}
