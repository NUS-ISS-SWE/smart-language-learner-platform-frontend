"use client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { metricNumber } from "@/lib/metric-format";
import type { DailyUsageMetric } from "@/types/admin";

const series = [
  { key: "compositionsCreated", label: "compositions", color: "bg-primary" },
  { key: "newUsers", label: "users", color: "bg-secondary" },
  { key: "successfulReviews", label: "successfulReviews", color: "bg-violet-600" },
  { key: "documentsUploaded", label: "uploads", color: "bg-amber-600" },
] as const;
export function ActivityChart({ daily }: { daily: DailyUsageMetric[] }) {
  const { t, i18n } = useTranslation("metrics");
  const max = Math.max(
    1,
    ...daily.flatMap((day) =>
      series.map((item) =>
        Number.isFinite(day[item.key]) ? day[item.key] : 0,
      ),
    ),
  );
  if (!daily.length)
    return (
      <p className="py-8 text-sm text-muted-foreground">{t("noActivity")}</p>
    );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {series.map((item) => (
          <span key={item.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-sm ${item.color}`}
            />
            {t(item.label)}
          </span>
        ))}
      </div>
      <div
        role="region"
        aria-label={t("chart")}
        tabIndex={0}
        className="overflow-x-auto pb-2"
      >
        <div className="min-w-[520px]">
          <p className="mb-2 text-xs text-muted-foreground">{t("count")}</p>
          <div className="flex gap-3">
            <div
              aria-hidden="true"
              className="flex h-44 w-9 shrink-0 flex-col justify-between text-right text-xs tabular-nums text-muted-foreground"
            >
              <span>{max}</span>
              <span>{Math.round(max / 2)}</span>
              <span>0</span>
            </div>
            <div
              role="img"
              aria-label={t("chart")}
              className="flex h-44 flex-1 items-end gap-1 border-b border-l bg-[linear-gradient(to_top,transparent_49.5%,#d7e0e3_50%,transparent_50.5%)] px-2"
            >
              {daily.map((day) => (
                <div
                  key={day.date}
                  className="flex h-full min-w-0 flex-1 items-end justify-center gap-px"
                >
                  {series.map((item) => (
                    <div
                      key={item.key}
                      className={`w-1/4 max-w-5 rounded-t-sm ${item.color}`}
                      style={{
                        height: `${Number.isFinite(day[item.key]) ? (Math.max(0, day[item.key]) / max) * 100 : 0}%`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="ml-12 mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{daily[0].date}</span>
            <span>{daily[daily.length - 1].date}</span>
          </div>
        </div>
      </div>
      <details className="border-t pt-2">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-secondary">
          {t("table")}
        </summary>
        <div
          role="region"
          aria-label={t("table")}
          tabIndex={0}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">{t("daily")}</caption>
            <thead className="border-b">
              <tr>
                <th scope="col" className="px-3 py-3">
                  {t("date")}
                </th>
                {series.map((item) => (
                  <th
                    scope="col"
                    key={item.key}
                    className="px-3 py-3 text-right"
                  >
                    {t(item.label)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daily.map((day) => (
                <tr key={day.date} className="border-b">
                  <th scope="row" className="px-3 font-normal">
                    {day.date}
                  </th>
                  {series.map((item) => (
                    <td key={item.key} className="px-3 text-right tabular-nums">
                      {metricNumber(
                        day[item.key],
                        i18n.language,
                        t("unavailable"),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
