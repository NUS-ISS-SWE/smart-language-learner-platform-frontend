"use client";

import Link from "next/link";
import { CreditCard, PenLine, ShieldCheck, Upload, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { getApiErrorMessage } from "@/lib/api/client";
import { useCompositionList } from "@/lib/hooks/useCompositions";
import { useDocumentList } from "@/lib/hooks/useDocuments";
import { useCurrentSubscription } from "@/lib/hooks/useSubscription";
import { useAdminUsers } from "@/lib/hooks/useAdmin";
import { RecentCompositions } from "@/components/features/dashboard/RecentCompositions";
import { ScoreSummary } from "@/components/features/dashboard/ScoreSummary";
import { useAuth } from "@/context/AuthContext";
import { planBadgeLabel, subscriptionStatusVariant } from "@/lib/subscription-utils";

/** Renders only for ADMIN users — safe to call admin hooks unconditionally here */
function AdminOverview() {
  const { data: usersPage } = useAdminUsers({ size: 1 });

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-amber-800">Platform Overview</p>
          <p className="text-xs text-muted-foreground">You are logged in as an administrator.</p>
        </div>
        <Link
          href="/admin/users"
          className="flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-200 self-start sm:self-auto"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Admin Panel
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{usersPage?.totalElements ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Registered users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium">Manage all user accounts, roles,</p>
              <p className="text-xs text-muted-foreground">compositions and documents from the admin panel.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
                {planBadgeLabel(subscription.plan.code)}
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
          {user?.role === "ADMIN" ? <AdminOverview /> : null}
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
                  {subscription ? subscription.plan.displayName : "Manage plan"}
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
