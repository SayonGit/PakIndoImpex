import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTestimonialForAdmin } from "@/lib/admin-data";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata: Metadata = { title: "Edit Testimonial | Admin" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getTestimonialForAdmin(id);
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Edit Testimonial</h1>
      <div className="mt-8">
        <TestimonialForm initial={item} />
      </div>
    </div>
  );
}
