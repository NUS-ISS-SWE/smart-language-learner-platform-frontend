"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BookOpenCheck, ShieldCheck } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { navigationConfig } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";

type SidebarProps = {
  readonly width: number;
};

export function Sidebar({ width }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const { user } = useAuth();

  return (
    <aside
      className="hidden shrink-0 bg-primary text-primary-foreground lg:flex lg:flex-col"
      style={{ width, flexBasis: width }}
    >
      <Link href="/dashboard" className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="rounded-lg bg-white/10 p-2 text-white">
          <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{APP_NAME}</p>
          <p className="text-xs text-white/60">{t("workspace")}</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationConfig.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white",
              item.isActive(pathname) &&
                "bg-white/10 pl-4 text-white before:absolute before:left-0 before:top-1.5 before:h-5 before:w-1 before:rounded-full before:bg-accent",
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {t(item.key)}
          </Link>
        ))}

        {user?.role === "ADMIN" && (
          <Link
            href="/admin/users"
            className={cn(
              "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white",
              pathname.startsWith("/admin") &&
                "bg-white/10 pl-4 text-white before:absolute before:left-0 before:top-1.5 before:h-5 before:w-1 before:rounded-full before:bg-accent",
            )}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Admin Panel
          </Link>
        )}
      </nav>
    </aside>
  );
}
