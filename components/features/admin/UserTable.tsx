"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { UserStatusBadge } from "./UserStatusBadge";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getInitials } from "@/lib/utils";
import type { AdminUser } from "@/types/admin";

export function UserTable({
  users,
  returnTo = "/admin/users",
}: {
  users: AdminUser[];
  returnTo?: string;
}) {
  const { t, i18n } = useTranslation("visual");
  if (!users.length)
    return (
      <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center text-muted-foreground">
        {t("noUsers")}
      </div>
    );
  return (
    <div
      role="region"
      aria-label={t("users")}
      tabIndex={0}
      className="overflow-x-auto rounded-2xl border bg-card"
    >
      <table className="w-full min-w-[760px] text-sm">
        <thead className="border-b bg-muted/60">
          <tr>
            {["username", "email", "role", "status", "created", "actions"].map(
              (key) => (
                <th
                  scope="col"
                  key={key}
                  className="px-5 py-4 text-left font-medium text-muted-foreground"
                >
                  {t(key)}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-5">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft-teal text-xs font-semibold text-secondary"
                  >
                    {getInitials(user.username)}
                  </span>
                  <span className="max-w-48 break-words font-semibold text-primary">
                    {user.username}
                  </span>
                </div>
              </td>
              <td className="max-w-64 break-words px-5 text-muted-foreground">
                {user.email}
              </td>
              <td className="px-5">
                {t(`role_${user.role}`, {
                  defaultValue: user.role.toLowerCase(),
                })}
              </td>
              <td className="px-5">
                <UserStatusBadge status={user.status} />
              </td>
              <td className="whitespace-nowrap px-5 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString(i18n.language)}
              </td>
              <td className="px-5">
                <Link
                  href={`/admin/users/${user.id}?returnTo=${encodeURIComponent(returnTo)}`}
                  className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-medium text-secondary hover:underline"
                >
                  {t("view")}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
