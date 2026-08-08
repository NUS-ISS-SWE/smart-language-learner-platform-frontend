"use client";

import Link from "next/link";
import { CreditCard, PenLine, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Badge } from "@/components/ui/Badge";
import { getApiErrorMessage } from "@/lib/api/client";
import { useCompositionList } from "@/lib/hooks/useCompositions";
import { useDocumentList } from "@/lib/hooks/useDocuments";
import { useCurrentSubscription } from "@/lib/hooks/useSubscription";
import { RecentCompositions } from "@/components/features/dashboard/RecentCompositions";
import { ScoreSummary } from "@/components/features/dashboard/ScoreSummary";
import { useAuth } from "@/context/AuthContext";
import { planBadgeLabel, planDisplayName, subscriptionStatusVariant } from "@/lib/subscription-utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data = [], isLoading, isError, error } = useCompositionList();
  const { data: documentsData } = useDocumentList();
  const { data: subscription } = useCurrentSubscription();
  const { t } = useTranslation("dashboard");

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-primary">{t("title")}</p>
            {subscription && (
              <Badge variant={subscriptionStatusVariant(subscription.status)} className="text-xs">
                {planBadgeLabel(subscription.planType)}
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            {t("welcome")}, {user?.username ?? "learner"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {isLoading ? <LoadingState label={t("title")} /> : null}
      {isError ? <ErrorState message={getApiErrorMessage(error)} /> : null}

      {!isLoading && !isError ? (
        <>
          <ScoreSummary compositions={data} documentsCount={documentsData?.total ?? 0} />

          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/compositions/new"
              className="group flex items-center gap-4 rounded-xl border p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20">
                <PenLine className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium">Write composition</p>
                <p className="text-xs text-muted-foreground">Start a new draft</p>
              </div>
            </Link>
            <Link
              href="/compositions/new?mode=upload"
              className="group flex items-center gap-4 rounded-xl border p-5 transition-colors hover:border-violet-400/50 hover:bg-violet-50"
            >
              <div className="rounded-lg bg-violet-100 p-3 text-violet-700 transition-colors group-hover:bg-violet-200">
                <Upload className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium">Upload document</p>
                <p className="text-xs text-muted-foreground">Convert to composition</p>
              </div>
            </Link>
            <Link
              href="/subscription"
              className="group flex items-center gap-4 rounded-xl border p-5 transition-colors hover:border-amber-400/50 hover:bg-amber-50"
            >
              <div className="rounded-lg bg-amber-100 p-3 text-amber-700 transition-colors group-hover:bg-amber-200">
                <CreditCard className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium">Subscription</p>
                <p className="text-xs text-muted-foreground">
                  {subscription ? planDisplayName(subscription.planType) : "Manage plan"}
                </p>
              </div>
            </Link>
          </div>

          <RecentCompositions compositions={data} />
        </>
      ) : null}
    </div>
  );
}
