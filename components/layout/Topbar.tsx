"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BookOpenCheck, CreditCard, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import { Badge } from "@/components/ui/Badge";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { APP_NAME } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCurrentSubscription } from "@/lib/hooks/useSubscription";
import { planBadgeLabel } from "@/lib/subscription-utils";
import { navigationConfig } from "@/lib/navigation";

function planBadgeVariant(planType: string): "default" | "secondary" | "warning" {
  if (planType === "PREMIUM") return "warning";
  if (planType === "BASIC") return "default";
  return "secondary";
}

const MENU_ITEM = "flex items-center gap-2.5 px-4 py-2 text-sm";

export function Topbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { data: subscription } = useCurrentSubscription();
  const { t } = useTranslation("common");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const mobileNavigation = navigationConfig
    .filter((item) => item.key !== "productGuide" || user?.role !== "ADMIN")
    .map((item) => ({
      ...item,
      label: t(item.key),
    }));

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3 lg:hidden">
          <div className="rounded-lg bg-primary p-2 text-primary-foreground">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="max-w-[190px] truncate text-sm font-semibold">{APP_NAME}</span>
        </Link>

        <div className="hidden lg:block">
          <p className="text-sm text-muted-foreground">{t("workspace")}</p>
        </div>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="User menu"
            className="flex items-center gap-2 rounded-lg border bg-background px-2 py-1.5 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
              {getInitials(user?.username)}
            </span>
            <span className="hidden max-w-[120px] truncate text-sm font-medium sm:block">
              {user?.username ?? "Learner"}
            </span>
            {subscription && (
              <Badge
                variant={planBadgeVariant(subscription.plan.code)}
                className="hidden text-xs sm:inline-flex"
              >
                {planBadgeLabel(subscription.plan.code)}
              </Badge>
            )}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-11 z-50 min-w-[200px] rounded-lg border bg-popover py-1 shadow-soft"
            >
              <div className="px-4 py-2.5">
                <p className="text-sm font-medium leading-none">{user?.username ?? "Learner"}</p>
                {subscription && (
                  <Badge
                    variant={subscription.plan.code === "PREMIUM" ? "default" : "secondary"}
                    className="mt-2 text-[10px]"
                  >
                    {planBadgeLabel(subscription.plan.code)}
                  </Badge>
                )}
              </div>

              <Separator />

              <Link
                href="/subscription"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className={cn(MENU_ITEM, "hover:bg-muted")}
              >
                <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {t("subscription")}
              </Link>

              <Separator />

              <div className="px-4 py-2.5">
                <p className="mb-2 text-xs text-muted-foreground">{t("language")}</p>
                <LanguageSwitcher />
              </div>

              <Separator />

              <button
                type="button"
                role="menuitem"
                onClick={() => { setMenuOpen(false); signOut(); }}
                className={cn(MENU_ITEM, "w-full text-destructive hover:bg-destructive/10")}
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>

      <Separator className="lg:hidden" />

      <nav className="grid grid-cols-3 gap-1 px-2 py-2 lg:hidden">
        {mobileNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-muted-foreground",
              item.isActive(pathname) && "bg-secondary text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
