import { BotMessageSquare, FileText, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  readonly key: "dashboard" | "compositions" | "productGuide";
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
  {
    key: "productGuide",
    href: "/product-guide",
    icon: BotMessageSquare,
    isActive: (p) => p.startsWith("/product-guide"),
  },
];
