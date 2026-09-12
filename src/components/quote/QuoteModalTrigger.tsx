"use client";

import type { ReactNode } from "react";
import { Button, type ButtonVariant, type ButtonSize } from "@/components/ui/Button";
import { useQuoteModal } from "./QuoteModalContext";

/**
 * Drop-in replacement for `<Button href="/request-a-quote">` now that the
 * request-a-quote page has been replaced by a global modal — opens the
 * modal instead of navigating.
 */
export function QuoteModalTrigger({
  children,
  variant,
  size,
  showArrow,
  className,
  onClick,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  className?: string;
  /** Called before the modal opens — e.g. to close a mobile nav drawer first. */
  onClick?: () => void;
}) {
  const { open } = useQuoteModal();
  return (
    <Button
      type="button"
      onClick={() => {
        onClick?.();
        open();
      }}
      variant={variant}
      size={size}
      showArrow={showArrow}
      className={className}
    >
      {children}
    </Button>
  );
}
