"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type UserRole = 'learner' | 'instructor' | 'admin';

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: string;
  readonly roles?: string[];
}

const learnerItems: readonly NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/courses", label: "Courses", icon: "📚" },
  { href: "/vocabulary", label: "Vocabulary", icon: "🔤" },
  { href: "/compositions", label: "Compositions", icon: "✍️" },
  { href: "/evaluations", label: "Evaluations", icon: "📊" },
  { href: "/progress", label: "Progress", icon: "📈" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

const adminItems: readonly NavItem[] = [
  { href: "/admin/dashboard", label: "Admin Dashboard", icon: "⚙️" },
  { href: "/admin/rubrics", label: "Rubrics", icon: "📋" },
  { href: "/admin/content", label: "Content", icon: "📝" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/analytics", label: "Analytics", icon: "📊" },
];

interface SidebarProps {
  readonly userRole?: UserRole;
}

export function Sidebar({ userRole = 'learner' }: SidebarProps) {
  const pathname = usePathname();

  // Determine which items to show based on role
  const items = (userRole === 'admin' || userRole === 'instructor') 
    ? [...learnerItems.slice(0, 5), ...adminItems]
    : learnerItems;

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen border-r border-gray-200 bg-gray-50 pt-6 pb-4 px-3 overflow-y-auto">
      <nav className="flex flex-col gap-1">
        {items.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
