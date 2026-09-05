"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BarChart3, Bot, FileText, PenLine, RefreshCw, UserCheck, Users, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useSystemUsageMetrics } from "@/lib/hooks/useAdmin";
import { formatUsdMicros } from "@/lib/utils";
import type { DailyUsageMetric, RetentionCohortMetric } from "@/types/admin";

const DATE_FORMATTER = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" });
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
const MAXIMUM_RANGE_DAYS = 366;

function isoDate(offsetDays = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function shiftIsoDate(value: string, offsetDays: number) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function isIsoDate(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeDateRange(fromValue: string | null, toValue: string | null) {
  const today = isoDate();
  const to = isIsoDate(toValue) && toValue <= today ? toValue : today;
  const earliestAllowedFrom = shiftIsoDate(to, -(MAXIMUM_RANGE_DAYS - 1));
  const requestedFrom = isIsoDate(fromValue) ? fromValue : shiftIsoDate(to, -29);
  const from = requestedFrom > to ? to : requestedFrom < earliestAllowedFrom ? earliestAllowedFrom : requestedFrom;
  return { from, to, earliestAllowedFrom };
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  readonly label: string;
  readonly value: number;
  readonly description: string;
  readonly icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{NUMBER_FORMATTER.format(value)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityChart({ daily }: { readonly daily: DailyUsageMetric[] }) {
  const maxValue = useMemo(
    () => Math.max(1, ...daily.flatMap((day) => [day.newUsers, day.compositionsCreated, day.successfulReviews, day.documentsUploaded])),
    [daily],
  );

  if (daily.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity was recorded for this period.</p>;
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-primary" aria-hidden="true" />Compositions</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-emerald-500" aria-hidden="true" />Users</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-violet-500" aria-hidden="true" />Reviews</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-amber-500" aria-hidden="true" />Uploads</span>
      </div>
      <div className="flex h-48 min-w-[520px] items-end gap-1 border-b border-l px-2 pt-3" role="img" aria-label="Daily new users, compositions, successful reviews, and document uploads">
        {daily.map((day) => (
          <div key={day.date} className="group flex h-full min-w-0 flex-1 items-end justify-center gap-px" title={`${day.date}: ${day.compositionsCreated} compositions, ${day.newUsers} users, ${day.successfulReviews} successful reviews, ${day.documentsUploaded} uploads`}>
            <div className="w-1/4 rounded-t-sm bg-primary transition-opacity group-hover:opacity-70" style={{ height: `${(day.compositionsCreated / maxValue) * 100}%` }} />
            <div className="w-1/4 rounded-t-sm bg-emerald-500 transition-opacity group-hover:opacity-70" style={{ height: `${(day.newUsers / maxValue) * 100}%` }} />
            <div className="w-1/4 rounded-t-sm bg-violet-500 transition-opacity group-hover:opacity-70" style={{ height: `${(day.successfulReviews / maxValue) * 100}%` }} />
            <div className="w-1/4 rounded-t-sm bg-amber-500 transition-opacity group-hover:opacity-70" style={{ height: `${(day.documentsUploaded / maxValue) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex min-w-[520px] justify-between text-xs text-muted-foreground">
        <span>{DATE_FORMATTER.format(new Date(`${daily[0].date}T00:00:00Z`))}</span>
        <span>{DATE_FORMATTER.format(new Date(`${daily[daily.length - 1].date}T00:00:00Z`))}</span>
      </div>
      <table className="sr-only">
        <caption>Daily system activity</caption>
        <thead><tr><th>Date</th><th>New users</th><th>Compositions</th><th>Successful reviews</th><th>Uploads</th></tr></thead>
        <tbody>{daily.map((day) => <tr key={day.date}><td>{day.date}</td><td>{day.newUsers}</td><td>{day.compositionsCreated}</td><td>{day.successfulReviews}</td><td>{day.documentsUploaded}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function RetentionCohortTable({ cohorts }: { readonly cohorts: RetentionCohortMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weekly retention cohorts</CardTitle>
        <p className="text-sm text-muted-foreground">Learners who returned for a meaningful activity after registering.</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b text-muted-foreground"><tr><th className="pb-2 font-medium">Cohort week</th><th className="pb-2 font-medium">Users</th><th className="pb-2 font-medium">Week 0</th><th className="pb-2 font-medium">Week 1</th><th className="pb-2 font-medium">Week 2</th><th className="pb-2 font-medium">Week 3</th><th className="pb-2 font-medium">Week 4</th></tr></thead>
          <tbody>{cohorts.map((cohort) => <tr key={cohort.cohortStart} className="border-b last:border-0"><td className="py-2">{cohort.cohortStart}</td><td>{cohort.cohortSize}</td><td>{cohort.week0Retained}</td><td>{cohort.week1Retained}</td><td>{cohort.week2Retained}</td><td>{cohort.week3Retained}</td><td>{cohort.week4Retained}</td></tr>)}</tbody>
        </table>
        {cohorts.length === 0 && <p className="text-sm text-muted-foreground">No registrations in this period.</p>}
      </CardContent>
    </Card>
  );
}

function UsageMetricsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { from, to, earliestAllowedFrom } = normalizeDateRange(searchParams.get("from"), searchParams.get("to"));
  const metricsQuery = useSystemUsageMetrics({ from, to });

  const updateDate = useCallback((key: "from" | "to", value: string) => {
    const nextRange = normalizeDateRange(key === "from" ? value : from, key === "to" ? value : to);
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", nextRange.from);
    params.set("to", nextRange.to);
    router.replace(`/admin/metrics?${params.toString()}`);
  }, [from, router, searchParams, to]);

  const selectRange = useCallback((days: number) => {
    const params = new URLSearchParams();
    const range = normalizeDateRange(isoDate(-(days - 1)), isoDate());
    params.set("from", range.from);
    params.set("to", range.to);
    router.replace(`/admin/metrics?${params.toString()}`);
  }, [router]);

  const data = metricsQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">System Usage Metrics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor system activity across users, writing, uploads, and AI usage.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void metricsQuery.refetch()} disabled={metricsQuery.isFetching}>
          <RefreshCw className={`h-4 w-4 ${metricsQuery.isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
        <label className="grid gap-1.5 text-sm font-medium">From
          <Input type="date" value={from} min={earliestAllowedFrom} max={to} onChange={(event) => updateDate("from", event.target.value)} />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">To
          <Input type="date" value={to} min={from} max={isoDate()} onChange={(event) => updateDate("to", event.target.value)} />
        </label>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => selectRange(7)}>Last 7 days</Button>
          <Button variant="outline" size="sm" onClick={() => selectRange(30)}>Last 30 days</Button>
        </div>
      </div>

      {metricsQuery.isLoading && <LoadingState label="Loading usage metrics…" />}
      {metricsQuery.isError && <ErrorState message={getApiErrorMessage(metricsQuery.error)} />}

      {data && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total users" value={data.summary.totalUsers} description={`${data.summary.newUsers} joined in this period`} icon={Users} />
            <MetricCard label="Active users" value={data.summary.activeUsers} description="Accounts with active status" icon={UserCheck} />
            <MetricCard label="Compositions" value={data.summary.compositionsCreated} description={`${data.summary.successfulReviews} successful reviews in this period`} icon={PenLine} />
            <MetricCard label="Documents uploaded" value={data.summary.documentsUploaded} description="Files uploaded in this period" icon={FileText} />
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle className="text-base">Review reliability</CardTitle></CardHeader><CardContent className="space-y-1 text-sm">
              <p><span className="font-semibold tabular-nums">{data.summary.successfulReviews}</span> successful / <span className="font-semibold tabular-nums">{data.summary.failedReviews}</span> failed</p>
              <p className="text-muted-foreground">{data.summary.reviewRequests} requests; average completion {data.summary.averageReviewLatencyMillis === null ? "not yet available" : `${Math.round(data.summary.averageReviewLatencyMillis / 1000)}s`}.</p>
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Document processing</CardTitle></CardHeader><CardContent className="space-y-1 text-sm">
              <p><span className="font-semibold tabular-nums">{data.summary.documentsReady}</span> ready / <span className="font-semibold tabular-nums">{data.summary.documentsFailed}</span> failed</p>
              <p className="text-muted-foreground">{data.summary.documentsProcessed} documents completed processing.</p>
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">AI usage in this period</CardTitle></CardHeader><CardContent className="space-y-1 text-sm">
              <p><span className="font-semibold tabular-nums">{NUMBER_FORMATTER.format(data.summary.aiTokensUsed)}</span> tokens</p>
              <p className="text-muted-foreground">Estimated cost: {formatUsdMicros(data.summary.estimatedAiCostMicros)}.</p>
            </CardContent></Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4" />Daily activity</CardTitle>
                <p className="text-sm text-muted-foreground">New users, compositions, and document uploads from {data.from} to {data.to}.</p>
              </CardHeader>
              <CardContent className="overflow-x-auto"><ActivityChart daily={data.daily} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bot className="h-4 w-4" />AI usage</CardTitle></CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">{NUMBER_FORMATTER.format(data.summary.totalAiTokensUsed)}</p>
                <p className="mt-1 text-sm text-muted-foreground">Lifetime provider-reported AI tokens.</p>
              </CardContent>
            </Card>
          </section>

          <RetentionCohortTable cohorts={data.retentionCohorts} />
        </>
      )}
    </div>
  );
}

export default function UsageMetricsPage() {
  return <Suspense><UsageMetricsContent /></Suspense>;
}
