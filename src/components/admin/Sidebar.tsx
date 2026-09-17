"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Quote,
  Users,
  MessageSquareText,
  FileQuestion,
  Search,
  Settings,
} from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Blog Articles", icon: FileText },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/submissions/quotes", label: "Quote Requests", icon: FileQuestion },
  { href: "/admin/submissions/contact", label: "Contact Messages", icon: MessageSquareText },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-ink-950 lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
          PI
        </span>
        <div>
          <p className="text-sm font-bold text-white">Pakindo Impex</p>
          <p className="text-xs text-white/50">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-spring",
                isActive
                  ? "bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-soft"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 text-xs text-white/30">
        &copy; {new Date().getFullYear()} Pakindo Impex Perkasa
      </div>
    </aside>
  );
}
