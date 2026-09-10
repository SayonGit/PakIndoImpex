"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextField, TextAreaField, SelectField } from "./FormField";
import { quoteRequestSchema } from "@/lib/validations";
import { INCOTERMS } from "@/lib/constants";
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

    const parsed = quoteRequestSchema.safeParse({ ...payload, locale });
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
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="quote-website">Leave this field empty</label>
        <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend className="text-lg font-bold text-ink-950">Buyer Information</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField label="Name" name="name" required autoComplete="name" error={errors.name} />
          <TextField label="Company" name="company" autoComplete="organization" error={errors.company} />
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            error={errors.email}
          />
          <TextField
            label="WhatsApp / Phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            error={errors.phone}
          />
          <TextField label="Country" name="country" required autoComplete="country-name" error={errors.country} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-bold text-ink-950">Product Requirements</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField
            label="Product"
            name="product"
            required
            defaultValue={defaultProduct}
            placeholder="e.g. Areca Nut"
            error={errors.product}
          />
          <TextField label="Quantity" name="quantity" required placeholder="e.g. 1 x 20ft container" error={errors.quantity} />
          <TextField label="Quality / Grade" name="quality" error={errors.quality} />
          <TextField label="Size / Specification" name="specification" error={errors.specification} />
          <TextField label="Packaging" name="packaging" error={errors.packaging} />
          <TextField label="Destination Port" name="destinationPort" error={errors.destinationPort} />
          <SelectField
            label="Preferred Incoterm"
            name="incoterm"
            options={[...INCOTERMS, "Not sure yet"]}
            error={errors.incoterm}
          />
          <TextField
            label="Target Delivery Date"
            name="targetDeliveryDate"
            placeholder="e.g. Within 60 days"
            error={errors.targetDeliveryDate}
          />
          <TextAreaField
            label="Additional Requirements"
            name="additionalRequirements"
            className="sm:col-span-2"
            error={errors.additionalRequirements}
          />
        </div>
      </fieldset>

      {status === "error" && Object.keys(errors).length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4 text-sm text-secondary-700">
          <AlertCircle className="size-5 shrink-0" aria-hidden />
          We could not submit your inquiry. Please check the required fields and try again.
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={status === "loading"}>
        {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Request a Quote
      </Button>
    </form>
  );
}
