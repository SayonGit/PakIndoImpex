import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Image as ImageIcon, Quote, Users, FileQuestion, MessageSquareText, Search, Settings } from "lucide-react";
import { getDashboardStats } from "@/lib/admin-data";
import { StatCard } from "@/components/admin/StatCard";

export const metadata: Metadata = { title: "Dashboard | Admin" };

const QUICK_LINKS = [
  { href: "/admin/articles", label: "Blog Articles", description: "Write and publish buyer guides", icon: FileText },
  { href: "/admin/gallery", label: "Gallery", description: "Bulk-upload photos and videos", icon: ImageIcon },
  { href: "/admin/team", label: "Team", description: "Manage \"Our People\" on the About page", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", description: "Manage buyer testimonials", icon: Quote },
  { href: "/admin/submissions/quotes", label: "Quote Requests", description: "Review RFQ submissions", icon: FileQuestion },
  { href: "/admin/submissions/contact", label: "Contact Messages", description: "Review contact submissions", icon: MessageSquareText },
  { href: "/admin/seo", label: "SEO", description: "Edit per-page meta titles/descriptions", icon: Search },
  { href: "/admin/settings", label: "Settings", description: "Company info, social links, logo", icon: Settings },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const newSubmissions = stats.newQuotes + stats.newMessages;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">Welcome back. Here&apos;s what you can manage.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="New Submissions" value={newSubmissions} icon={FileQuestion} tone="highlight" />
        <StatCard label="Published Articles" value={stats.articles} icon={FileText} />
        <StatCard label="Gallery Items" value={stats.galleryItems} icon={ImageIcon} />
        <StatCard label="Team Members" value={stats.teamMembers} icon={Users} />
        <StatCard label="Testimonials" value={stats.testimonials} icon={Quote} />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group shadow-soft flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors duration-300 ease-spring group-hover:bg-primary-600 group-hover:text-white">
              <link.icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-ink-950">{link.label}</p>
              <p className="mt-0.5 text-sm text-ink-500">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
