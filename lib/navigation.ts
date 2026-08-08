import { FileText, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  readonly key: "dashboard" | "compositions";
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
    isActive: (p) => p.startsWith("/compositions") || p.startsWith("/documents"),
  },
];
