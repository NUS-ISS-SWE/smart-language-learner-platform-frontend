"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { UserTable } from "@/components/features/admin/UserTable";
import { useAdminUsers } from "@/lib/hooks/useAdmin";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";

const USER_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_EMAIL_VERIFICATION"];
const USER_ROLES = ["ADMIN", "USER_FREE_TRIAL", "USER_BASIC", "USER_PREMIUM"];
const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const userRole = searchParams.get("userRole") ?? "";
  const page = Number(searchParams.get("page") ?? "0");

  const { data, isLoading, isError, error } = useAdminUsers({ search, status, userRole, page, size: PAGE_SIZE });

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {data ? `${data.totalElements} users` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search username or email…"
          value={search}
          onChange={(e) => updateParam("search", e.target.value)}
          aria-label="Search users"
        />
        <Select
          value={status}
          onChange={(e) => updateParam("status", e.target.value)}
          aria-label="Filter by status"
          className="w-48"
        >
          <option value="">All statuses</option>
          {USER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select
          value={userRole}
          onChange={(e) => updateParam("userRole", e.target.value)}
          aria-label="Filter by role"
          className="w-48"
        >
          <option value="">All roles</option>
          {USER_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </div>

      {isLoading && <LoadingState label="Loading users…" />}
      {isError && <ErrorState message={getApiErrorMessage(error)} />}

      {data && (
        <>
          <UserTable users={data.content} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page + 1} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page + 1 >= data.totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
