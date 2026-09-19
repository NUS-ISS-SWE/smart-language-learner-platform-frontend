"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function MetricsDateControls({
  from,
  to,
  earliestAllowedFrom,
  today,
  onDateChange,
  onSelectRange,
}: {
  from: string;
  to: string;
  earliestAllowedFrom: string;
  today: string;
  onDateChange: (key: "from" | "to", value: string) => void;
  onSelectRange: (days: number) => void;
}) {
  const { t } = useTranslation("metrics");
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-2xl border bg-card p-5">
      <label className="grid min-w-0 gap-2 text-sm font-medium">
        {t("from")}
        <Input
          type="date"
          value={from}
          min={earliestAllowedFrom}
          max={to}
          onChange={(event) => onDateChange("from", event.target.value)}
        />
      </label>
      <label className="grid min-w-0 gap-2 text-sm font-medium">
        {t("to")}
        <Input
          type="date"
          value={to}
          min={from}
          max={today}
          onChange={(event) => onDateChange("to", event.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => onSelectRange(7)}>
          {t("lastDays", { count: 7 })}
        </Button>
        <Button variant="outline" onClick={() => onSelectRange(30)}>
          {t("lastDays", { count: 30 })}
        </Button>
      </div>
    </div>
  );
}
