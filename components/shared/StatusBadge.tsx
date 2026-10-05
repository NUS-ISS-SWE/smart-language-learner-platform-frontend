"use client";

import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { CompositionStatus } from "@/types/composition";

type StatusBadgeProps = {
  status?: CompositionStatus | null;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation("studio");
  const value = status ?? "DRAFT";

  if (value === "REVIEWED") {
    return <Badge variant="success">{t(value)}</Badge>;
  }

  if (value === "REVIEWING" || value === "GENERATING") {
    return <Badge variant="warning">{t(value)}</Badge>;
  }

  if (value === "GENERATION_FAILED") {
    return <Badge variant="destructive">{t(value, { defaultValue: "Assessment needs attention" })}</Badge>;
  }

  return <Badge variant="secondary">{t(value)}</Badge>;
}
