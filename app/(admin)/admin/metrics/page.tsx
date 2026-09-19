"use client";
import { Suspense, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bot,
  FileText,
  PenLine,
  RefreshCw,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { ActivityChart } from "@/components/features/admin/metrics/ActivityChart";
import { AgentMetricsTable } from "@/components/features/admin/metrics/AgentMetricsTable";
import { MetricCard } from "@/components/features/admin/metrics/MetricCard";
import { MetricsDateControls } from "@/components/features/admin/metrics/MetricsDateControls";
import { RetentionCohortTable } from "@/components/features/admin/metrics/RetentionCohortTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useSystemUsageMetrics } from "@/lib/hooks/useAdmin";
import { adminKeys } from "@/lib/hooks/adminKeys";
import {
  normalizeMetricsDateRange,
  utcIsoDate,
} from "@/lib/metrics-date-range";
import { metricNumber, metricPercent, metricCost } from "@/lib/metric-format";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { SystemUsageMetrics } from "@/types/admin";

function MetricBreakdown({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) {
  return (
    <article className="rounded-xl border bg-card p-5">
      <h3 className="mb-5 text-base font-semibold text-primary">{title}</h3>
      <dl className="space-y-3">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-2 text-sm last:border-0"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold tabular-nums text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
function UsageMetricsContent() {
  const { t, i18n } = useTranslation("metrics");
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { from, to, earliestAllowedFrom } = normalizeMetricsDateRange(
    searchParams.get("from"),
    searchParams.get("to"),
  );
  const query = useSystemUsageMetrics({ from, to });
  const updateDate = useCallback(
    (key: "from" | "to", value: string) => {
      const range = normalizeMetricsDateRange(
        key === "from" ? value : from,
        key === "to" ? value : to,
      );
      const params = new URLSearchParams(searchParams.toString());
      params.set("from", range.from);
      params.set("to", range.to);
      router.replace(`/admin/metrics?${params.toString()}`, { scroll: false });
    },
    [from, to, router, searchParams],
  );
  const selectRange = useCallback(
    (days: number) => {
      const range = normalizeMetricsDateRange(
        utcIsoDate(-(days - 1)),
        utcIsoDate(),
      );
      router.replace(`/admin/metrics?from=${range.from}&to=${range.to}`, {
        scroll: false,
      });
    },
    [router],
  );
  // Placeholder data ends when the next request fails. The query cache keeps
  // every successful period, so derive the latest real result without another
  // state synchronization cycle.
  const lastResult = queryClient
    .getQueryCache()
    .findAll({ queryKey: [...adminKeys.all, "metrics"] })
    .reduce<{ data: SystemUsageMetrics; updatedAt: number } | null>(
      (latest, cached) => {
        const data = cached.state.data as SystemUsageMetrics | undefined;
        if (!data || cached.state.dataUpdatedAt <= (latest?.updatedAt ?? 0))
          return latest;
        return { data, updatedAt: cached.state.dataUpdatedAt };
      },
      null,
    );
  const data = query.data ?? lastResult?.data;
  const s = data?.summary;
  const w = data?.workflowReliability;
  const n = (value: number | null | undefined) =>
    metricNumber(value, i18n.language, t("unavailable"));
  const latency = (value: number | null | undefined) =>
    value == null || !Number.isFinite(value)
      ? t("unavailable")
      : t("seconds", { count: Math.round(value / 1000) });
  return (
    <div className="space-y-8">
      <PageHeader
        title={t("title")}
        description={t("intro")}
        actions={
          <Button
            variant="outline"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {t("refresh")}
          </Button>
        }
      />
      <MetricsDateControls
        from={from}
        to={to}
        earliestAllowedFrom={earliestAllowedFrom}
        today={utcIsoDate()}
        onDateChange={updateDate}
        onSelectRange={selectRange}
      />
      {query.isLoading && <LoadingState />}
      {query.isError && (
        <ErrorState message={getApiErrorMessage(query.error)} />
      )}
      {query.isError && data && (
        <p role="status" className="text-sm text-muted-foreground">
          {t("previousResults", { from: data.from, to: data.to })}
        </p>
      )}
      {query.isPlaceholderData && (
        <p role="status" className="text-sm text-secondary">
          {t("updating")}
        </p>
      )}
      {data && (
        <div className="space-y-8" aria-busy={query.isFetching}>
          <section className="space-y-4" aria-labelledby="metrics-activity">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2
                id="metrics-activity"
                className="text-xl font-semibold text-primary"
              >
                {t("activity")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {data.from} — {data.to}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard
                label={t("totalUsers")}
                value={s?.totalUsers}
                description={t("joined", { value: n(s?.newUsers) })}
                icon={Users}
              />
              <MetricCard
                label={t("activeAccounts")}
                value={s?.activeUsers}
                description={t("accountsHint")}
                icon={UserCheck}
              />
              <MetricCard
                label={t("activeLearners")}
                value={s?.activeLearners}
                description={t("period")}
                icon={Users}
              />
              <MetricCard
                label={t("compositions")}
                value={s?.compositionsCreated}
                description={t("reviewCount", {
                  value: n(s?.successfulReviews),
                })}
                icon={PenLine}
              />
              <MetricCard
                label={t("uploads")}
                value={s?.documentsUploaded}
                description={t("period")}
                icon={FileText}
              />
            </div>
            <article className="rounded-2xl border bg-card p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-primary">
                {t("daily")}
              </h3>
              <p className="mb-6 mt-2 text-sm text-muted-foreground">
                {t("dailyHint")}
              </p>
              {data.daily ? (
                <ActivityChart daily={data.daily} />
              ) : (
                <p>{t("unavailable")}</p>
              )}
            </article>
          </section>
          <section className="space-y-4" aria-labelledby="metrics-reliability">
            <h2
              id="metrics-reliability"
              className="text-xl font-semibold text-primary"
            >
              {t("reliability")}
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              <MetricBreakdown
                title={t("reviews")}
                rows={[
                  [t("successful"), n(s?.successfulReviews)],
                  [t("failed"), n(s?.failedReviews)],
                  [t("requests"), n(s?.reviewRequests)],
                  [t("average"), latency(s?.averageReviewLatencyMillis)],
                ]}
              />
              <MetricBreakdown
                title={t("documents")}
                rows={[
                  [t("ready"), n(s?.documentsReady)],
                  [t("failed"), n(s?.documentsFailed)],
                  [t("processed"), n(s?.documentsProcessed)],
                ]}
              />
              <MetricBreakdown
                title={t("workflow")}
                rows={[
                  [t("received"), n(w?.received)],
                  [t("completed"), n(w?.completed)],
                  [t("failed"), n(w?.failed)],
                  [t("pending"), n(w?.pending)],
                  [
                    t("completionRate"),
                    metricPercent(w?.completionPercent, t("unavailable")),
                  ],
                  [
                    t("failureRate"),
                    metricPercent(w?.failurePercent, t("unavailable")),
                  ],
                  [t("average"), latency(w?.averageCompletionLatencyMillis)],
                ]}
              />
            </div>
          </section>
          <section className="space-y-4" aria-labelledby="metrics-ai">
            <h2 id="metrics-ai" className="text-xl font-semibold text-primary">
              {t("ai")}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <MetricBreakdown
                title={t("period")}
                rows={[
                  [t("tokens"), n(s?.aiTokensUsed)],
                  [
                    t("cost"),
                    metricCost(s?.estimatedAiCostMicros, t("unavailable")),
                  ],
                ]}
              />
              <article className="rounded-xl bg-primary p-6 text-white">
                <Bot className="mb-4 h-6 w-6 text-accent" aria-hidden="true" />
                <p className="text-3xl font-semibold tabular-nums">
                  {n(s?.totalAiTokensUsed)}
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  {t("lifetimeTokens")}
                </p>
              </article>
            </div>
            {data.agentMetrics ? (
              <AgentMetricsTable agents={data.agentMetrics} />
            ) : (
              <p>{t("unavailable")}</p>
            )}
          </section>
          {data.retentionCohorts ? (
            <RetentionCohortTable
              cohorts={data.retentionCohorts}
              to={data.to}
            />
          ) : (
            <p>{t("unavailable")}</p>
          )}
        </div>
      )}
    </div>
  );
}
export default function UsageMetricsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <UsageMetricsContent />
    </Suspense>
  );
}
