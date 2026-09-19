"use client";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { metricNumber } from "@/lib/metric-format";

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number | null | undefined;
  description: string;
  icon: LucideIcon;
}) {
  const { t, i18n } = useTranslation("metrics");
  return (
    <article className="min-w-0 rounded-xl border bg-card p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
      </div>
      <p className="text-3xl font-semibold tracking-tight tabular-nums text-primary">
        {metricNumber(value, i18n.language, t("unavailable"))}
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}
