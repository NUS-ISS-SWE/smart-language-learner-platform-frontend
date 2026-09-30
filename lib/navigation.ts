import {
  BotMessageSquare,
  FileText,
  LayoutDashboard,
  Users,
  ListChecks,
  WalletCards,
  BarChart3,
  ScrollText,
  ShieldAlert,
  Target,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  readonly key:
    | "dashboard"
    | "compositions"
    | "productGuide"
    | "users"
    | "rubrics"
    | "pricing"
    | "metrics"
    | "audit"
    | "moderation"
    | "goals"
    | "challenges"
    | "challengeTemplates"
    | "achievementDefinitions";
  readonly href: string;
  readonly icon: LucideIcon;
  readonly isActive: (pathname: string) => boolean;
  readonly group?: "learningContent" | "operations" | "administration";
};

export const navigationConfig: NavItem[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    isActive: (p) => p === "/dashboard",
  },
  {
    key: "compositions",
    href: "/compositions",
    icon: FileText,
    isActive: (p) =>
      p.startsWith("/compositions") || p.startsWith("/documents"),
  },
  {
    key: "challenges",
    href: "/challenges",
    icon: Trophy,
    isActive: (p) => p.startsWith("/challenges"),
  },
  {
    key: "goals",
    href: "/goals",
    icon: Target,
    isActive: (p) => p.startsWith("/goals"),
  },
  {
    key: "productGuide",
    href: "/product-guide",
    icon: BotMessageSquare,
    isActive: (p) => p.startsWith("/product-guide"),
  },
];

export const adminNavigationConfig: NavItem[] = [
  {
    key: "achievementDefinitions",
    group: "learningContent",
    href: "/admin/achievements",
    icon: Trophy,
    isActive: (p) => p.startsWith("/admin/achievements"),
  },
  {
    key: "challengeTemplates",
    group: "learningContent",
    href: "/admin/challenges",
    icon: Trophy,
    isActive: (p) => p.startsWith("/admin/challenges"),
  },
  {
    key: "moderation",
    group: "operations",
    href: "/admin/moderation",
    icon: ShieldAlert,
    isActive: (p) => p.startsWith("/admin/moderation"),
  },
  {
    key: "users",
    group: "administration",
    href: "/admin/users",
    icon: Users,
    isActive: (p) => p.startsWith("/admin/users"),
  },
  {
    key: "rubrics",
    group: "learningContent",
    href: "/admin/rubrics",
    icon: ListChecks,
    isActive: (p) => p.startsWith("/admin/rubrics"),
  },
  {
    key: "pricing",
    group: "administration",
    href: "/admin/pricing-plans",
    icon: WalletCards,
    isActive: (p) => p.startsWith("/admin/pricing-plans"),
  },
  {
    key: "metrics",
    group: "operations",
    href: "/admin/metrics",
    icon: BarChart3,
    isActive: (p) => p.startsWith("/admin/metrics"),
  },
  {
    key: "audit",
    group: "operations",
    href: "/admin/audit-logs",
    icon: ScrollText,
    isActive: (p) => p.startsWith("/admin/audit-logs"),
  },
];
