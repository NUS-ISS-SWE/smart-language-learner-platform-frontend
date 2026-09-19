"use client";

import { Suspense, use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  useAdminUser,
  useAdminUserUsageMetrics,
  useAdminUserCompositions,
  useAdminUserDocuments,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "@/lib/hooks/useAdmin";
import { ChangeSelectFieldModal } from "@/components/features/admin/ChangeSelectFieldModal";
import { DeleteUserModal } from "@/components/features/admin/DeleteUserModal";
import { UserStatusBadge } from "@/components/features/admin/UserStatusBadge";
import { UserCompositionsList } from "@/components/features/admin/UserCompositionsList";
import { UserDocumentsList } from "@/components/features/admin/UserDocumentsList";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import { ADMIN_CHANGEABLE_STATUSES, ADMIN_USER_ROLES } from "@/lib/constants";
import { metricCost, metricNumber } from "@/lib/metric-format";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Props = { readonly params: Promise<{ id: string }> };
type Tab = "compositions" | "documents";

function AdminUserDetailContent({ params }: Props) {
  const { t, language } = useTranslation("visual");
  const n = (value: number | null | undefined) =>
    metricNumber(value, language, t("unavailable"));
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedReturn = searchParams.get("returnTo") ?? "";
  const returnTo = /^\/admin\/users(?:\?|$)/.test(requestedReturn)
    ? requestedReturn
    : "/admin/users";
  const { id } = use(params);
  const numericId = Number(id);
  const numId =
    Number.isSafeInteger(numericId) && numericId > 0 ? numericId : NaN;

  const userQuery = useAdminUser(numId);
  const usageQuery = useAdminUserUsageMetrics(numId);
  const compositionsQuery = useAdminUserCompositions(numId);
  const documentsQuery = useAdminUserDocuments(numId);
  const statusMutation = useUpdateUserStatus();
  const roleMutation = useUpdateUserRole();

  const activeTab: Tab =
    searchParams.get("tab") === "documents" ? "documents" : "compositions";
  const accountReturn = `/admin/users/${id}?${searchParams.toString()}`;
  function setActiveTab(tab: Tab) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/admin/users/${id}?${params.toString()}`, {
      scroll: false,
    });
  }
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (userQuery.isLoading) return <LoadingState label={t("loading")} />;
  if (userQuery.isError && !userQuery.data)
    return (
      <div className="space-y-3">
        <ErrorState message={getApiErrorMessage(userQuery.error)} />
        <Button variant="outline" onClick={() => void userQuery.refetch()}>
          {t("retry")}
        </Button>
      </div>
    );
  if (!userQuery.data) return <ErrorState message={t("userMissing")} />;

  const user = userQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={returnTo}
          className="flex min-h-11 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("backUsers")}
        </Link>
      </div>

      <PageHeader title={user.username} description={user.email} />
      {userQuery.isError && (
        <ErrorState message={getApiErrorMessage(userQuery.error)} />
      )}

      <Card className="overflow-hidden rounded-2xl border-t-4 border-t-secondary">
        <CardHeader>
          <CardTitle>{t("accountAccess")}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-6 text-sm [overflow-wrap:anywhere] sm:grid-cols-2 xl:grid-cols-3 [&_dd]:mt-2 [&_dd]:font-medium">
            <div>
              <dt className="text-muted-foreground">{t("email")}</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("status")}</dt>
              <dd>
                <UserStatusBadge status={user.status} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("role")}</dt>
              <dd>{t(`role_${user.role}`, { defaultValue: user.role })}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("language")}</dt>
              <dd>
                {t(`studio:${user.preferredLanguage.toLowerCase()}`, {
                  defaultValue: user.preferredLanguage,
                })}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("difficulty")}</dt>
              <dd>
                {t(`common:${user.difficultyLevel.toLowerCase()}`, {
                  defaultValue: user.difficultyLevel,
                })}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("aiTokens")}</dt>
              <dd>
                {user.aiTokenBalance == null
                  ? t("unavailable")
                  : t("remaining", { value: n(user.aiTokenBalance) })}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("created")}</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString(language)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
            <Button
              variant="outline"
              onClick={() => {
                statusMutation.reset();
                setStatusModalOpen(true);
              }}
            >
              {t("changeStatus")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                roleMutation.reset();
                setRoleModalOpen(true);
              }}
            >
              {t("changeRole")}
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteModalOpen(true)}
            >
              {t("deleteUser")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>{t("usage30")}</CardTitle>
        </CardHeader>
        <CardContent>
          {usageQuery.isLoading && (
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          )}
          {usageQuery.isError && (
            <div className="space-y-3">
              <ErrorState message={getApiErrorMessage(usageQuery.error)} />
              <Button
                variant="outline"
                onClick={() => void usageQuery.refetch()}
              >
                {t("retry")}
              </Button>
            </div>
          )}
          {usageQuery.data && (
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm sm:grid-cols-3 [&_dd]:mt-2 [&_dd]:font-semibold">
              <div>
                <dt className="text-muted-foreground">{t("activeDays")}</dt>
                <dd>{n(usageQuery.data.summary.activeDays)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("compositions")}</dt>
                <dd>{n(usageQuery.data.summary.compositionsCreated)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("reviews")}</dt>
                <dd>
                  {t("reviewOutcome", {
                    success: n(usageQuery.data.summary.successfulReviews),
                    failed: n(usageQuery.data.summary.failedReviews),
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("documents")}</dt>
                <dd>
                  {t("documentOutcome", {
                    ready: n(usageQuery.data.summary.documentsReady),
                    failed: n(usageQuery.data.summary.documentsFailed),
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("aiUsage")}</dt>
                <dd>
                  {t("tokensCost", {
                    tokens: n(usageQuery.data.summary.aiTokensUsed),
                    cost: metricCost(
                      usageQuery.data.summary.estimatedAiCostMicros,
                      t("unavailable"),
                    ),
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("lastActivity")}</dt>
                <dd>
                  {usageQuery.data.summary.lastActivityAt
                    ? new Date(
                        usageQuery.data.summary.lastActivityAt,
                      ).toLocaleString(language)
                    : t("noActivity")}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex gap-1 border-b">
          {(["compositions", "documents"] as Tab[]).map((tab) => (
            <button
              key={t(tab)}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={`min-h-11 px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        {activeTab === "compositions" && (
          <UserCompositionsList
            query={compositionsQuery}
            returnTo={accountReturn}
          />
        )}
        {activeTab === "documents" && (
          <UserDocumentsList query={documentsQuery} returnTo={accountReturn} />
        )}
      </div>

      <ChangeSelectFieldModal
        key={user.status}
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={t("changeStatus")}
        label={t("newStatus")}
        selectId="status-select"
        options={[...ADMIN_CHANGEABLE_STATUSES]}
        currentValue={user.status}
        onConfirm={(status) =>
          statusMutation.mutate(
            { id: numId, body: { status } },
            { onSuccess: () => setStatusModalOpen(false) },
          )
        }
        isPending={statusMutation.isPending}
        error={statusMutation.error}
      />
      <ChangeSelectFieldModal
        key={user.role}
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title={t("changeRole")}
        label={t("newRole")}
        selectId="role-select"
        options={[...ADMIN_USER_ROLES]}
        currentValue={user.role}
        onConfirm={(role) =>
          roleMutation.mutate(
            { id: numId, body: { role } },
            { onSuccess: () => setRoleModalOpen(false) },
          )
        }
        isPending={roleMutation.isPending}
        error={roleMutation.error}
      />
      <DeleteUserModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        userId={numId}
        username={user.username}
        returnTo={returnTo}
      />
    </div>
  );
}

export default function AdminUserDetailPage(props: Props) {
  return (
    <Suspense fallback={<LoadingState />}>
      <AdminUserDetailContent {...props} />
    </Suspense>
  );
}
