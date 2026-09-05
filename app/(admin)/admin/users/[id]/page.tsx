"use client";

import { use, useState } from "react";
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
import { formatUsdMicros } from "@/lib/utils";

type Props = { readonly params: Promise<{ id: string }> };
type Tab = "compositions" | "documents";

export default function AdminUserDetailPage({ params }: Props) {
  const { id } = use(params);
  const numId = Number(id);

  const userQuery = useAdminUser(numId);
  const usageQuery = useAdminUserUsageMetrics(numId);
  const compositionsQuery = useAdminUserCompositions(numId);
  const documentsQuery = useAdminUserDocuments(numId);
  const statusMutation = useUpdateUserStatus();
  const roleMutation = useUpdateUserRole();

  const [activeTab, setActiveTab] = useState<Tab>("compositions");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (userQuery.isLoading) return <LoadingState label="Loading user…" />;
  if (userQuery.isError) return <ErrorState message={getApiErrorMessage(userQuery.error)} />;
  if (!userQuery.data) return <ErrorState message="User not found." />;

  const user = userQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to users
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <UserStatusBadge status={user.status} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd>{user.role}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Language</dt>
              <dd>{user.preferredLanguage}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Difficulty</dt>
              <dd>{user.difficultyLevel}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">AI tokens</dt>
              <dd>{user.aiTokenBalance ?? 0} remaining</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setStatusModalOpen(true)}>
              Change Status
            </Button>
            <Button variant="outline" onClick={() => setRoleModalOpen(true)}>
              Change Role
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete User
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage — last 30 days</CardTitle>
        </CardHeader>
        <CardContent>
          {usageQuery.isLoading && <p className="text-sm text-muted-foreground">Loading usage metrics…</p>}
          {usageQuery.isError && <p className="text-sm text-destructive">Unable to load usage metrics.</p>}
          {usageQuery.data && (
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-5">
              <div><dt className="text-muted-foreground">Active days</dt><dd>{usageQuery.data.summary.activeDays}</dd></div>
              <div><dt className="text-muted-foreground">Compositions</dt><dd>{usageQuery.data.summary.compositionsCreated}</dd></div>
              <div><dt className="text-muted-foreground">Reviews</dt><dd>{usageQuery.data.summary.successfulReviews} successful, {usageQuery.data.summary.failedReviews} failed</dd></div>
              <div><dt className="text-muted-foreground">Documents</dt><dd>{usageQuery.data.summary.documentsReady} ready, {usageQuery.data.summary.documentsFailed} failed</dd></div>
              <div><dt className="text-muted-foreground">AI usage</dt><dd>{usageQuery.data.summary.aiTokensUsed.toLocaleString()} tokens · {formatUsdMicros(usageQuery.data.summary.estimatedAiCostMicros)}</dd></div>
              <div><dt className="text-muted-foreground">Last activity</dt><dd>{usageQuery.data.summary.lastActivityAt ? new Date(usageQuery.data.summary.lastActivityAt).toLocaleString() : "No activity"}</dd></div>
            </dl>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex gap-1 border-b">
          {(["compositions", "documents"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "compositions" && <UserCompositionsList query={compositionsQuery} />}
        {activeTab === "documents" && <UserDocumentsList query={documentsQuery} />}
      </div>

      <ChangeSelectFieldModal
        key={user.status}
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Change User Status"
        label="New status"
        selectId="status-select"
        options={[...ADMIN_CHANGEABLE_STATUSES]}
        currentValue={user.status}
        onConfirm={(status) =>
          statusMutation.mutate({ id: numId, body: { status } }, { onSuccess: () => setStatusModalOpen(false) })
        }
        isPending={statusMutation.isPending}
      />
      <ChangeSelectFieldModal
        key={user.role}
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title="Change User Role"
        label="New role"
        selectId="role-select"
        options={[...ADMIN_USER_ROLES]}
        currentValue={user.role}
        onConfirm={(role) =>
          roleMutation.mutate({ id: numId, body: { role } }, { onSuccess: () => setRoleModalOpen(false) })
        }
        isPending={roleMutation.isPending}
      />
      <DeleteUserModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        userId={numId}
        username={user.username}
      />
    </div>
  );
}

