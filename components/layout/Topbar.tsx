"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, FileText, LayoutDashboard, LogOut, PenLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { APP_NAME } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const mobileNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Compositions", href: "/compositions", icon: FileText },
  { label: "New", href: "/compositions/new", icon: PenLine },
];

export function Topbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

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
          <p className="text-sm text-muted-foreground">Workspace</p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user?.username ?? "Learner"}</p>
            <p className="text-xs text-muted-foreground">{user?.role ?? "User"}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
            {getInitials(user?.username)}
          </div>
          <Button variant="ghost" size="icon" type="button" onClick={signOut} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
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
              pathname === item.href && "bg-secondary text-foreground",
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
