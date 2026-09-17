import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata: Metadata = { title: "Add Testimonial | Admin" };

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Add Testimonial</h1>
      <div className="mt-8">
        <TestimonialForm />
      </div>
    </div>
  );
}
