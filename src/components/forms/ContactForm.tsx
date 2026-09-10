"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextField, TextAreaField } from "./FormField";
import { contactMessageSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const parsed = contactMessageSchema.safeParse({ ...payload, locale });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-primary-200 bg-primary-50 p-6">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary-700" aria-hidden />
        <div>
          <p className="font-semibold text-primary-900">
            Thank you for reaching out. Your message has been sent successfully.
          </p>
          <p className="mt-1 text-sm text-primary-800">
            Our team will review your inquiry and get back to you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" name="name" required autoComplete="name" error={errors.name} />
        <TextField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
        <TextField label="Phone" name="phone" type="tel" autoComplete="tel" error={errors.phone} />
        <TextField label="Country" name="country" autoComplete="country-name" error={errors.country} />
      </div>
      <TextField label="Subject" name="subject" error={errors.subject} />
      <TextAreaField label="Message" name="message" required error={errors.message} />

      {status === "error" && Object.keys(errors).length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-700">
          <AlertCircle className="size-5 shrink-0" aria-hidden />
          We could not send your message. Please check the required fields and try again.
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={status === "loading"}>
        {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Send Message
      </Button>
    </form>
  );
}
