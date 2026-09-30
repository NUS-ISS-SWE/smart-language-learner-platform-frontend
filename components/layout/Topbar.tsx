"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ChevronDown, CreditCard, LogOut, Menu, Target } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCurrentSubscription } from "@/lib/hooks/useSubscription";
import { planBadgeLabel } from "@/lib/subscription-utils";
import { adminNavigationConfig, navigationConfig } from "@/lib/navigation";
import { useLearningGoals } from "@/lib/hooks/useLearning";

export function Topbar({
  admin = false,
  onOpenNavigation,
}: {
  admin?: boolean;
  onOpenNavigation?: () => void;
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { data: subscription } = useCurrentSubscription();
  const { data: goals } = useLearningGoals();
  const { t } = useTranslation("common");
  const { t: s } = useTranslation("studio");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const current = (admin ? adminNavigationConfig : navigationConfig).find(
    (item) => item.isActive(pathname),
  );
  const focusedGoal = !admin
    ? goals?.find((goal) => goal.focused && goal.status === "ACTIVE")
    : undefined;
  const focusedProgress = focusedGoal
    ? Math.min(
        100,
        Math.round((focusedGoal.progress / focusedGoal.target) * 100),
      )
    : 0;
  const focusedLabel = focusedGoal
    ? {
        DAILY_CHALLENGE_COMPLETIONS: "Daily challenges",
        WEEKLY_CHALLENGE_COMPLETIONS: "Weekly challenges",
        CATEGORY_CHALLENGE_COMPLETIONS: `${focusedGoal.category?.toLowerCase().replaceAll("_", " ")} challenges`,
        CURRENT_STREAK_DAYS: "Practice streak",
        REVIEWED_COMPOSITIONS: "Reviewed compositions",
        OVERALL_ASSESSMENT_SCORE: "Overall writing score",
        VOCABULARY_RUBRIC_SCORE: "Vocabulary score",
      }[focusedGoal.metric]
    : "";
  useEffect(() => {
    if (!menuOpen) return;
    firstLink.current?.focus();
    function outside(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={onOpenNavigation}
            aria-label={s("openNavigation")}
            aria-haspopup="dialog"
            aria-controls="workspace-drawer"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
          <p className="min-w-0 text-sm font-medium text-primary">
            <span className="hidden text-muted-foreground xl:inline">
              {s(admin ? "admin" : "workspace")}{" "}
              <span className="mx-2" aria-hidden="true">
                /
              </span>
            </span>
            {current ? s(current.key) : t("subscription")}
          </p>
        </div>
        {focusedGoal && (
          <Link
            href="/goals"
            title={`${focusedLabel}: ${focusedGoal.progress} of ${focusedGoal.target}. Open goals to change focus.`}
            className="ml-auto hidden min-h-11 max-w-48 items-center gap-2 rounded-lg border border-secondary/40 bg-soft-teal/50 px-2.5 py-1.5 text-sm shadow-sm transition hover:bg-soft-teal lg:flex"
            aria-label={`View focused goal: ${focusedLabel}, ${focusedGoal.progress} of ${focusedGoal.target}`}
          >
            <span className="rounded-lg bg-secondary p-1.5 text-white">
              <Target className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <p className="truncate font-semibold text-primary">
                {focusedLabel}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Focused · {focusedGoal.progress} / {focusedGoal.target} (
                {focusedProgress}%)
              </p>
            </span>
          </Link>
        )}
        <div
          className="relative shrink-0"
          ref={menuRef}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setMenuOpen(false);
          }}
        >
          <button
            ref={trigger}
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="account-options"
            aria-label={s("account")}
            className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 hover:bg-muted"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-soft-teal text-xs font-semibold text-secondary">
              {getInitials(user?.username)}
            </span>
            <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
              {user?.username ?? s("learner")}
            </span>
            {subscription && (
              <Badge variant="secondary" className="hidden md:inline-flex">
                {planBadgeLabel(subscription.plan.code)}
              </Badge>
            )}
            <ChevronDown
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </button>
          {menuOpen && (
            <div
              id="account-options"
              className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card py-2 shadow-soft"
            >
              <div className="border-b px-4 pb-3 pt-2">
                <p className="break-words text-sm font-semibold">
                  {user?.username ?? s("learner")}
                </p>
                {subscription && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {planBadgeLabel(subscription.plan.code)}
                  </p>
                )}
              </div>
              <Link
                ref={firstLink}
                href="/subscription"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center gap-3 px-4 py-3 text-sm hover:bg-muted"
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                {t("subscription")}
              </Link>
              <div className="border-y px-4 py-3">
                <p className="mb-2 text-sm text-muted-foreground">
                  {t("language")}
                </p>
                <LanguageSwitcher />
              </div>
              <button
                type="button"
                data-leaves-editor
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                }}
                className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/5"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
