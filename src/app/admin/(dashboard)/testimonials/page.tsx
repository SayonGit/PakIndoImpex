import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllTestimonialsForAdmin } from "@/lib/admin-data";
import { TestimonialListClient } from "@/components/admin/TestimonialListClient";

export const metadata: Metadata = { title: "Testimonials | Admin" };

export default async function AdminTestimonialsPage() {
  const items = await getAllTestimonialsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Testimonials</h1>
          <p className="mt-1 text-sm text-ink-500">Shown on the Home and About pages.</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 ease-spring hover:-translate-y-0.5"
        >
          <Plus className="size-4" aria-hidden />
          Add Testimonial
        </Link>
      </div>

      <div className="mt-8">
        <TestimonialListClient initialItems={items} />
      </div>
    </div>
  );
}
