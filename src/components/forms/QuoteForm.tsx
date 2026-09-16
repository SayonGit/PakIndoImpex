"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextField, TextAreaField, SelectField, PhoneField } from "./FormField";
import { quoteRequestSchema } from "@/lib/validations";
import { QUANTITY_ESTIMATES, COUNTRY_CALLING_CODES, COMPANY } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "loading" | "success" | "error";

export function QuoteForm({ defaultProduct }: { defaultProduct?: string }) {
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // The country-code select and number input submit separately — combine
    // them into the single `phone` string the schema/API expect.
    const { phoneCountryCode, phoneNumber, ...rest } = payload;
    const phone = String(phoneNumber ?? "").trim() ? `${phoneCountryCode} ${phoneNumber}`.trim() : "";

    const parsed = quoteRequestSchema.safeParse({ ...rest, phone, locale });
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
      const response = await fetch("/api/quote", {
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
            Thank you for your inquiry. Your requirements have been submitted successfully.
          </p>
          <p className="mt-1 text-sm text-primary-800">
            Our team will review your inquiry and follow up with next steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="quote-website">Leave this field empty</label>
        <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-sm leading-relaxed text-ink-600">
        Fill in the form below and our team will respond via email to discuss pricing, specifications,
        and shipment terms.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full Name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          error={errors.name}
        />
        <TextField
          label="Company"
          name="company"
          autoComplete="organization"
          placeholder="Company name (optional)"
          error={errors.company}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          error={errors.email}
        />
        <PhoneField
          label="Phone / WhatsApp"
          countryCodeName="phoneCountryCode"
          numberName="phoneNumber"
          codes={COUNTRY_CALLING_CODES}
          autoComplete="tel"
          placeholder="8xx xxxx xxxx"
          error={errors.phone}
        />
        <TextField
          label="Destination Country"
          name="destinationCountry"
          required
          autoComplete="country-name"
          placeholder="e.g. India, Pakistan, Bangladesh"
          error={errors.destinationCountry}
        />
        <SelectField
          label="Approx. Quantity / Month"
          name="quantityEstimate"
          options={[...QUANTITY_ESTIMATES]}
          placeholder="Select estimate"
          error={errors.quantityEstimate}
        />
        <TextAreaField
          label="Inquiry Details"
          name="inquiryDetails"
          required
          className="sm:col-span-2"
          placeholder="Please include product type (whole/split/sliced), expected grade, packing, Incoterms (FOB/CIF), and preferred loading port."
          defaultValue={defaultProduct ? `Product: ${defaultProduct}\n` : undefined}
          error={errors.inquiryDetails}
        />
      </div>

      <p className="text-xs leading-relaxed text-ink-500">
        By submitting this form, you agree to be contacted by {COMPANY.shortName} regarding your
        inquiry and related commercial follow-up.
      </p>

      {status === "error" && Object.keys(errors).length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-700">
          <AlertCircle className="size-5 shrink-0" aria-hidden />
          We could not submit your inquiry. Please check the required fields and try again.
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={status === "loading"}>
        {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Send Inquiry
      </Button>
    </form>
  );
}
