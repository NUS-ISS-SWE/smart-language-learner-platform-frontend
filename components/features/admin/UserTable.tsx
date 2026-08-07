"use client";

import Link from "next/link";
import { UserStatusBadge } from "./UserStatusBadge";
import type { AdminUser } from "@/types/admin";

type UserTableProps = {
  readonly users: AdminUser[];
};

export function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Username</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{user.username}</td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3">
                <UserStatusBadge status={user.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
