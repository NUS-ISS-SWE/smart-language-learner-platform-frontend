"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BarChart3, Bot, FileText, PenLine, RefreshCw, UserCheck, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ActivityChart } from "@/components/features/admin/metrics/ActivityChart";
import { AgentMetricsTable } from "@/components/features/admin/metrics/AgentMetricsTable";
import { MetricCard } from "@/components/features/admin/metrics/MetricCard";
import { MetricsDateControls } from "@/components/features/admin/metrics/MetricsDateControls";
import { RetentionCohortTable } from "@/components/features/admin/metrics/RetentionCohortTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { getApiErrorMessage } from "@/lib/api/client";
import { useSystemUsageMetrics } from "@/lib/hooks/useAdmin";
import { normalizeMetricsDateRange, utcIsoDate } from "@/lib/metrics-date-range";
import { formatUsdMicros } from "@/lib/utils";

const numberFormatter = new Intl.NumberFormat("en-US");

function UsageMetricsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { from, to, earliestAllowedFrom } = normalizeMetricsDateRange(searchParams.get("from"), searchParams.get("to"));
  const metricsQuery = useSystemUsageMetrics({ from, to });
  const updateDate = useCallback((key: "from" | "to", value: string) => {
    const nextRange = normalizeMetricsDateRange(key === "from" ? value : from, key === "to" ? value : to);
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", nextRange.from);
    params.set("to", nextRange.to);
    router.replace(`/admin/metrics?${params.toString()}`);
  }, [from, router, searchParams, to]);
  const selectRange = useCallback((days: number) => {
    const range = normalizeMetricsDateRange(utcIsoDate(-(days - 1)), utcIsoDate());
    router.replace(`/admin/metrics?from=${range.from}&to=${range.to}`);
  }, [router]);
  const data = metricsQuery.data;

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h1 className="text-3xl font-semibold tracking-normal">System Usage Metrics</h1><p className="mt-1 text-sm text-muted-foreground">Monitor system activity across users, writing, uploads, and AI usage.</p></div><Button variant="outline" size="sm" onClick={() => void metricsQuery.refetch()} disabled={metricsQuery.isFetching}><RefreshCw className={`h-4 w-4 ${metricsQuery.isFetching ? "animate-spin" : ""}`} aria-hidden="true" />Refresh</Button></div>
    <MetricsDateControls from={from} to={to} earliestAllowedFrom={earliestAllowedFrom} today={utcIsoDate()} onDateChange={updateDate} onSelectRange={selectRange} />
    {metricsQuery.isLoading && <LoadingState label="Loading usage metrics…" />}
    {metricsQuery.isError && <ErrorState message={getApiErrorMessage(metricsQuery.error)} />}
    {data && <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><MetricCard label="Total users" value={data.summary.totalUsers} description={`${data.summary.newUsers} joined in this period`} icon={Users} /><MetricCard label="Active accounts" value={data.summary.activeUsers} description="Accounts with active status" icon={UserCheck} /><MetricCard label="Active learners" value={data.summary.activeLearners} description="Meaningful activity in this period" icon={Users} /><MetricCard label="Compositions" value={data.summary.compositionsCreated} description={`${data.summary.successfulReviews} successful reviews in this period`} icon={PenLine} /><MetricCard label="Documents uploaded" value={data.summary.documentsUploaded} description="Files uploaded in this period" icon={FileText} /></section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-base">Review reliability</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><p><span className="font-semibold tabular-nums">{data.summary.successfulReviews}</span> successful / <span className="font-semibold tabular-nums">{data.summary.failedReviews}</span> failed</p><p className="text-muted-foreground">{data.summary.reviewRequests} requests; average completion {data.summary.averageReviewLatencyMillis == null ? "not yet available" : `${Math.round(data.summary.averageReviewLatencyMillis / 1000)}s`}.</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Document processing</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><p><span className="font-semibold tabular-nums">{data.summary.documentsReady}</span> ready / <span className="font-semibold tabular-nums">{data.summary.documentsFailed}</span> failed</p><p className="text-muted-foreground">{data.summary.documentsProcessed} documents completed processing.</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">AI usage in this period</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><p><span className="font-semibold tabular-nums">{numberFormatter.format(data.summary.aiTokensUsed)}</span> tokens</p><p className="text-muted-foreground">Estimated cost: {formatUsdMicros(data.summary.estimatedAiCostMicros)}.</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Workflow reliability</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><p><span className="font-semibold tabular-nums">{data.workflowReliability.completed}</span> completed / <span className="font-semibold tabular-nums">{data.workflowReliability.failed}</span> failed</p><p className="text-muted-foreground">{data.workflowReliability.received} received; {data.workflowReliability.pending} pending.</p><p className="text-muted-foreground">Completion {data.workflowReliability.completionPercent == null ? "—" : `${data.workflowReliability.completionPercent.toFixed(2)}%`}; failure {data.workflowReliability.failurePercent == null ? "—" : `${data.workflowReliability.failurePercent.toFixed(2)}%`}.</p><p className="text-muted-foreground">Average {data.workflowReliability.averageCompletionLatencyMillis == null ? "not yet available" : `${Math.round(data.workflowReliability.averageCompletionLatencyMillis / 1000)}s`}.</p></CardContent></Card>
      </section>
      <section className="grid gap-4 lg:grid-cols-3"><Card className="lg:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4" />Daily activity</CardTitle><p className="text-sm text-muted-foreground">New users, compositions, and document uploads from {data.from} to {data.to}.</p></CardHeader><CardContent className="overflow-x-auto"><ActivityChart daily={data.daily} /></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bot className="h-4 w-4" />AI usage</CardTitle></CardHeader><CardContent><p className="text-3xl font-semibold tabular-nums">{numberFormatter.format(data.summary.totalAiTokensUsed)}</p><p className="mt-1 text-sm text-muted-foreground">Lifetime provider-reported AI tokens.</p></CardContent></Card></section>
      <AgentMetricsTable agents={data.agentMetrics} />
      <RetentionCohortTable cohorts={data.retentionCohorts} to={data.to} />
    </>}
  </div>;
}

export default function UsageMetricsPage() {
  return <Suspense><UsageMetricsContent /></Suspense>;
}
