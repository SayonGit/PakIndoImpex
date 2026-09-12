"use client";

import type { ReactNode } from "react";
import { useQuoteModal } from "./QuoteModalContext";

/** Plain-text variant of QuoteModalTrigger, for places styled as a link rather than a pill button. */
export function QuoteModalTextTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { open } = useQuoteModal();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
