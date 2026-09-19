"use client";

import Link from "next/link";
import { ArrowRight, PenLine, ShieldCheck, Upload } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/client";
import { useCompositionList } from "@/lib/hooks/useCompositions";
import { useDocumentList } from "@/lib/hooks/useDocuments";
import { useCurrentSubscription } from "@/lib/hooks/useSubscription";
import { useAdminUsers } from "@/lib/hooks/useAdmin";
import { RecentCompositions } from "@/components/features/dashboard/RecentCompositions";
import { ScoreSummary } from "@/components/features/dashboard/ScoreSummary";
import { useAuth } from "@/context/AuthContext";
import { WritingNextStep } from "@/components/features/dashboard/WritingNextStep";
import { compositionPreview } from "@/lib/composition-content";

function AdminOverview() {
  const { data, isError } = useAdminUsers({ size: 1 });
  const { t } = useTranslation("studio");
  return (
    <section
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"
      aria-label={t("adminOverview")}
    >
      <div>
        <h2 className="text-base font-semibold text-primary">
          {t("adminOverview")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("adminHint")}</p>
        <p className="mt-2 text-sm">
          {t("registeredUsers")}:{" "}
          <strong>
            {data?.totalElements ?? (isError ? t("unavailable") : "…")}
          </strong>
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/admin/users">
          <ShieldCheck className="h-4 w-4" />
          {t("admin")}
        </Link>
      </Button>
    </section>
  );
}

export default function DashboardPage() {
  const { t: visual } = useTranslation("visual");
  const { user } = useAuth();
  const compositions = useCompositionList();
  const documents = useDocumentList();
  const { data: subscription } = useCurrentSubscription();
  const { t } = useTranslation("studio");
  const data = compositions.data ?? [];
  const latestDraft = data
    .filter((item) => item.compositionStatus === "DRAFT")
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("welcome", { name: user?.username ?? t("learner") })}
        description={t("dashboardIntro")}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section
          className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white sm:p-8"
          aria-labelledby="writing-next"
        >
          <div className="flex h-full flex-col justify-between gap-8">
            <div className="min-w-0">
              <p className="eyebrow mb-6 text-accent">
                {visual(latestDraft ? "draftLabel" : "nextStep")}
              </p>
              <h2
                id="writing-next"
                className="break-words text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl"
              >
                {latestDraft?.title || t("startTitle")}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {t(latestDraft ? "continueHint" : "startHint")}
              </p>
              {latestDraft?.content && (
                <p className="mt-5 line-clamp-3 border-l-2 border-accent/60 pl-4 text-base leading-7 text-slate-200">
                  {compositionPreview(latestDraft.content)}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/20 pt-5">
              <Button
                asChild
                className="bg-white text-primary hover:bg-soft-teal"
              >
                <Link
                  href={
                    latestDraft
                      ? `/compositions/${latestDraft.id}/edit`
                      : "/compositions/new"
                  }
                >
                  <PenLine className="h-4 w-4" />
                  {t(latestDraft ? "continue" : "write")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {latestDraft && (
                <Button
                  variant="ghost"
                  asChild
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/compositions/new">{t("write")}</Link>
                </Button>
              )}
              <Button
                variant="ghost"
                asChild
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/compositions/new?mode=upload">
                  <Upload className="h-4 w-4" />
                  {t("upload")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <WritingNextStep compositions={data} />
      </div>

      {compositions.isLoading && <LoadingState label={t("recent")} />}
      {compositions.isError && (
        <div className="space-y-3">
          <ErrorState message={getApiErrorMessage(compositions.error)} />
          <Button variant="outline" onClick={() => compositions.refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}
      {compositions.data && <RecentCompositions compositions={data} />}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-primary">
          {visual("activity")}
        </h2>
        {compositions.data && (
          <p className="text-sm text-muted-foreground">
            {t("recentScope", { count: data.length })}
          </p>
        )}
        <ScoreSummary
          compositions={compositions.data}
          documentsCount={documents.data?.total}
        />
        {documents.isError && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-destructive">
            <span>
              {t("documents")}: {t("unavailable")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => documents.refetch()}
            >
              {t("retry")}
            </Button>
          </div>
        )}
        <Link
          href="/subscription"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-secondary underline-offset-4 hover:underline"
        >
          {subscription?.plan.displayName ?? "—"} · {t("common:subscription")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
      {user?.role === "ADMIN" && <AdminOverview />}
    </div>
  );
}
