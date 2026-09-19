"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { UserTable } from "@/components/features/admin/UserTable";
import { useAdminUsers } from "@/lib/hooks/useAdmin";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { getApiErrorMessage } from "@/lib/api/client";
import { ADMIN_USER_STATUSES, ADMIN_USER_ROLES } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n/useTranslation";

function UserSearch({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (key: string, value: string) => void;
}) {
  const [text, setText] = useState(value);
  const [urlValue, setUrlValue] = useState(value);
  const [submitted, setSubmitted] = useState(value);
  const { t } = useTranslation("visual");
  // URL navigation updates the draft; our own debounced acknowledgement must
  // neither remount the input nor overwrite newer keystrokes.
  useEffect(() => {
    if (urlValue === value) return;
    setUrlValue(value);
    if (value !== submitted) setText(value);
  }, [submitted, urlValue, value]);
  useEffect(() => {
    if (text === value) return;
    const timer = setTimeout(() => {
      setSubmitted(text);
      onCommit("search", text);
    }, 300);
    return () => clearTimeout(timer);
  }, [text, value, onCommit]);
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id="user-search"
        className="pl-10"
        placeholder={t("searchHint")}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </div>
  );
}
function AdminUsersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation("visual");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const userRole = searchParams.get("userRole") ?? "";
  const rawPage = Number(searchParams.get("page") ?? "0");
  const page = Number.isSafeInteger(rawPage) && rawPage >= 0 ? rawPage : 0;
  const query = useAdminUsers({ search, status, userRole, page, size: 20 });
  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      if (key !== "page") params.delete("page");
      const href = `/admin/users?${params.toString()}`;
      if (key === "search") router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    },
    [searchParams, router],
  );
  const returnTo = `/admin/users${searchParams.size ? `?${searchParams.toString()}` : ""}`;
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("users")}
        description={t("usersHint")}
        actions={
          <div className="flex items-center gap-3 rounded-full border bg-card px-4 py-2 text-sm">
            <Users className="h-4 w-4 text-secondary" />
            {query.data
              ? t("userCount", { count: query.data.totalElements })
              : t("loading")}
          </div>
        }
      />
      <section
        className="rounded-2xl border bg-card p-5"
        aria-label={t("search")}
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <Label htmlFor="user-search">{t("search")}</Label>
            <UserSearch value={search} onCommit={updateParam} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-status">{t("status")}</Label>
            <Select
              id="user-status"
              value={status}
              onChange={(e) => updateParam("status", e.target.value)}
            >
              <option value="">{t("allStatuses")}</option>
              {ADMIN_USER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`status_${s}`, {
                    defaultValue: s.replaceAll("_", " ").toLowerCase(),
                  })}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-role">{t("role")}</Label>
            <Select
              id="user-role"
              value={userRole}
              onChange={(e) => updateParam("userRole", e.target.value)}
            >
              <option value="">{t("allRoles")}</option>
              {ADMIN_USER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {t(`role_${r}`, { defaultValue: r.toLowerCase() })}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {(search || status || userRole) && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => router.push("/admin/users", { scroll: false })}
          >
            {t("clear")}
          </Button>
        )}
      </section>
      {query.isLoading && <LoadingState label={t("loading")} />}
      {query.isError && (
        <div className="space-y-3">
          <ErrorState message={getApiErrorMessage(query.error)} />
          <Button variant="outline" onClick={() => void query.refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}
      {query.data && (
        <>
          <UserTable users={query.data.content} returnTo={returnTo} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {t("page", {
                page: page + 1,
                total: Math.max(1, query.data.totalPages),
              })}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 0 || query.isFetching}
                onClick={() => updateParam("page", String(page - 1))}
              >
                {t("previous")}
              </Button>
              <Button
                variant="outline"
                disabled={page + 1 >= query.data.totalPages || query.isFetching}
                onClick={() => updateParam("page", String(page + 1))}
              >
                {t("next")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default function AdminUsersPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AdminUsersContent />
    </Suspense>
  );
}
