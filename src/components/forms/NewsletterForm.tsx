"use client";

import { useId, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const emailId = useId();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          website: formData.get("website"),
          locale,
        }),
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
      <p className="flex items-center gap-2 text-sm text-gold-300">
        <CheckCircle2 className="size-4 shrink-0" aria-hidden />
        {t("newsletterSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${emailId}-website`}>Leave this field empty</label>
        <input id={`${emailId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={emailId} className="sr-only">
          {t("newsletterPlaceholder")}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          placeholder={t("newsletterPlaceholder")}
          className="min-w-0 flex-1 rounded-full border border-white/25 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-ink-400 transition-colors focus:border-gold-300 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-sheen group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-gold-300 to-gold-500 px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_8px_20px_-8px_rgba(240,173,31,0.4)] transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:scale-[1.02] hover:from-gold-400 hover:to-gold-600 hover:shadow-[0_16px_32px_-10px_rgba(240,173,31,0.55)] active:scale-100 disabled:pointer-events-none disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100"
        >
          {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {t("newsletterSubmit")}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-secondary-300" role="alert">
          {t("newsletterError")}
        </p>
      )}
    </form>
  );
}
