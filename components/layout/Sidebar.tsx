"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  ArrowLeft,
  BookOpenCheck,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { adminNavigationConfig, navigationConfig } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";

export function WorkspaceNavigation({
  admin = false,
  onNavigate,
}: {
  admin?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslation("studio");
  const { user } = useAuth();
  const items = admin ? adminNavigationConfig : navigationConfig;
  const linkClass =
    "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-accent";
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav aria-label={t("navigation")} className="space-y-1 px-3 py-5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={item.isActive(pathname) ? "page" : undefined}
            className={cn(
              linkClass,
              item.isActive(pathname) &&
                "bg-white/10 text-white shadow-[inset_3px_0_0_var(--color-accent)]",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <div className="mx-3 mt-auto space-y-1 border-t border-white/15 py-4">
        {admin ? (
          <Link href="/dashboard" onClick={onNavigate} className={linkClass}>
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t("backToWorkspace")}
          </Link>
        ) : (
          user?.role === "ADMIN" && (
            <Link
              href="/admin/users"
              onClick={onNavigate}
              className={linkClass}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t("admin")}
            </Link>
          )
        )}
        <Link href="/" onClick={onNavigate} className={linkClass}>
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t("publicHome")}
        </Link>
      </div>
    </div>
  );
}

export function WorkspaceBrand({ admin = false }: { admin?: boolean }) {
  const { t } = useTranslation("studio");
  return (
    <Link
      href={admin ? "/admin/users" : "/dashboard"}
      className="flex min-h-16 items-center gap-3 border-b border-white/15 px-5 py-3 text-white"
    >
      <BookOpenCheck
        className="h-6 w-6 shrink-0 text-accent"
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span
          title={APP_NAME}
          className="block truncate text-sm font-semibold leading-5"
        >
          {APP_NAME}
        </span>
        <span className="mt-1 block text-xs text-white/75">
          {t(admin ? "admin" : "workspace")}
        </span>
      </span>
    </Link>
  );
}

export function Sidebar({
  width,
  admin = false,
}: {
  width: number;
  admin?: boolean;
}) {
  return (
    <aside
      id="workspace-sidebar"
      className="sticky top-0 hidden h-dvh shrink-0 flex-col overflow-y-auto bg-primary text-primary-foreground lg:flex"
      style={{ width, flexBasis: width }}
    >
      <WorkspaceBrand admin={admin} />
      <WorkspaceNavigation admin={admin} />
    </aside>
  );
}
