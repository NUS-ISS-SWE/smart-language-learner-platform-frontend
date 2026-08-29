"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/shared/LoadingState";
import { Topbar } from "@/components/layout/Topbar";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const SIDEBAR_WIDTH = 240;

const adminNavItems = [
  { href: "/admin/users", icon: Users, label: "User Management" },
  { href: "/admin/metrics", icon: BarChart3, label: "Usage Metrics" },
];

export default function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <LoadingState label="Loading…" />;
  if (user?.role !== "ADMIN") return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className="hidden shrink-0 bg-primary text-primary-foreground lg:flex lg:flex-col"
        style={{ width: SIDEBAR_WIDTH, flexBasis: SIDEBAR_WIDTH }}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="rounded-lg bg-white/10 p-2 text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{APP_NAME}</p>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                pathname.startsWith(item.href) &&
                  "bg-white/10 pl-4 text-white before:absolute before:left-0 before:top-1.5 before:h-5 before:w-1 before:rounded-full before:bg-accent",
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}

          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            ← Back to App
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
