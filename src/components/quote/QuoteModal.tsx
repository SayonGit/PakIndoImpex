"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { useQuoteModal } from "./QuoteModalContext";

/**
 * Global "Request a Quote" modal (replaces the old /request-a-quote page).
 * Deliberately NOT dismissible by clicking the backdrop or pressing Escape —
 * only the close button toggles it, per explicit product decision.
 */
export function QuoteModal() {
  const { isOpen, close } = useQuoteModal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Request a Quote"
    >
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" aria-hidden />
      <div className="shadow-soft-lg relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4 sm:px-8">
          <h2 className="text-lg font-bold text-ink-950">Request a Quote</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="overflow-y-auto p-6 sm:p-8">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
