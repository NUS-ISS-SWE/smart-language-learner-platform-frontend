import {
  BotMessageSquare,
  FileText,
  LayoutDashboard,
  Users,
  ListChecks,
  WalletCards,
  BarChart3,
  ScrollText,
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
    | "audit";
  readonly href: string;
  readonly icon: LucideIcon;
  readonly isActive: (pathname: string) => boolean;
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
    key: "productGuide",
    href: "/product-guide",
    icon: BotMessageSquare,
    isActive: (p) => p.startsWith("/product-guide"),
  },
];

export const adminNavigationConfig: NavItem[] = [
  {
    key: "users",
    href: "/admin/users",
    icon: Users,
    isActive: (p) => p.startsWith("/admin/users"),
  },
  {
    key: "rubrics",
    href: "/admin/rubrics",
    icon: ListChecks,
    isActive: (p) => p.startsWith("/admin/rubrics"),
  },
  {
    key: "pricing",
    href: "/admin/pricing-plans",
    icon: WalletCards,
    isActive: (p) => p.startsWith("/admin/pricing-plans"),
  },
  {
    key: "metrics",
    href: "/admin/metrics",
    icon: BarChart3,
    isActive: (p) => p.startsWith("/admin/metrics"),
  },
  {
    key: "audit",
    href: "/admin/audit-logs",
    icon: ScrollText,
    isActive: (p) => p.startsWith("/admin/audit-logs"),
  },
];
