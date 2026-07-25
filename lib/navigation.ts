import { FileText, FolderOpen, LayoutDashboard, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  readonly key: "dashboard" | "compositions" | "newComposition" | "documents";
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
      p === "/compositions" ||
      (p.startsWith("/compositions/") && p !== "/compositions/new"),
  },
  {
    key: "newComposition",
    href: "/compositions/new",
    icon: PenLine,
    isActive: (p) => p === "/compositions/new",
  },
  {
    key: "documents",
    href: "/documents",
    icon: FolderOpen,
    isActive: (p) => p === "/documents" || p.startsWith("/documents/"),
  },
];
