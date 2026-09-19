"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAuth } from "@/context/AuthContext";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { LoadingState } from "@/components/shared/LoadingState";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("studio");
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);
  if (isLoading) return <LoadingState label={t("loading")} />;
  if (!isAuthenticated) return null;
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
