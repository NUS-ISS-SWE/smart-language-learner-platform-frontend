"use client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { metricNumber } from "@/lib/metric-format";
import type { RetentionCohortMetric } from "@/types/admin";

export function RetentionCohortTable({
  cohorts,
  to,
}: {
  cohorts: RetentionCohortMetric[];
  to: string;
}) {
  const { t, i18n } = useTranslation("metrics");
  const endExclusive = new Date(`${to}T00:00:00Z`);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  const weeks = [
    "week0Retained",
    "week1Retained",
    "week2Retained",
    "week3Retained",
    "week4Retained",
  ] as const;
  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-primary">{t("cohorts")}</h2>
      <p className="mb-5 mt-2 text-sm text-muted-foreground">
        {t("cohortHint")}
      </p>
      <div
        role="region"
        aria-label={t("cohorts")}
        tabIndex={0}
        className="overflow-x-auto"
      >
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 pb-3">
                {t("cohortWeek")}
              </th>
              <th scope="col" className="px-3 pb-3">
                {t("cohortSize")}
              </th>
              {weeks.map((key, index) => (
                <th scope="col" key={key} className="px-3 pb-3">
                  {t("week", { count: index })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.cohortStart} className="border-b last:border-0">
                <th scope="row" className="px-3 font-medium">
                  {cohort.cohortStart}
                </th>
                <td className="px-3 tabular-nums">
                  {metricNumber(cohort.cohortSize, i18n.language)}
                </td>
                {weeks.map((key, index) => {
                  const weekEnd = new Date(`${cohort.cohortStart}T00:00:00Z`);
                  weekEnd.setUTCDate(weekEnd.getUTCDate() + (index + 1) * 7);
                  const value = weekEnd <= endExclusive ? cohort[key] : null;
                  const ratio =
                    value != null && cohort.cohortSize > 0
                      ? Math.min(1, Math.max(0, value / cohort.cohortSize))
                      : 0;
                  return (
                    <td key={key} className="px-3 tabular-nums">
                      <span
                        className="inline-block min-w-12 rounded-md px-3 py-2 text-center text-primary"
                        style={
                          value == null
                            ? undefined
                            : {
                                backgroundColor: `rgba(15, 118, 110, ${0.04 + ratio * 0.22})`,
                              }
                        }
                      >
                        {metricNumber(value, i18n.language)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!cohorts.length && (
        <p className="py-6 text-sm text-muted-foreground">{t("noCohorts")}</p>
      )}
    </section>
  );
}
