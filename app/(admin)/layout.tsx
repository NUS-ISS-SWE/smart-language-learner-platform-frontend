"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/shared/LoadingState";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";

export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("studio");
  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") router.replace("/dashboard");
  }, [isLoading, user, router]);
  if (isLoading) return <LoadingState label={t("loading")} />;
  if (user?.role !== "ADMIN") return null;
  return (
    <WorkspaceShell admin>
      <div className="admin-surface">{children}</div>
    </WorkspaceShell>
  );
}
