"use client";

import { useId, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, CheckCircle2, Mail } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${emailId}-website`}>Leave this field empty</label>
        <input id={`${emailId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-2 rounded-full bg-white/10 p-1.5 sm:flex-row sm:items-center">
        <label htmlFor={emailId} className="sr-only">
          {t("newsletterPlaceholder")}
        </label>
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/60" aria-hidden />
          <input
            id={emailId}
            name="email"
            type="email"
            required
            placeholder={t("newsletterPlaceholder")}
            className="w-full min-w-0 rounded-full bg-transparent py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/60 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-sheen group inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-white to-gold-50 px-5 py-2.5 text-[0.8rem] font-semibold uppercase text-ink-950 shadow-sm transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:scale-[1.02] hover:from-gold-50 hover:to-gold-200 hover:shadow-md active:scale-100 disabled:pointer-events-none disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100"
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
