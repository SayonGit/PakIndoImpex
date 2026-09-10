"use client";

import { useId, useState } from "react";
import { clsx } from "clsx";
import { Plus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

export function FaqAccordion({
  items,
  defaultOpenIndex = null,
}: {
  items: FaqItem[];
  /** Index to expand initially, or null (default) to start with everything collapsed. */
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const baseId = useId();

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div
            key={item.question}
            className={clsx(
              "rounded-2xl border transition-colors duration-300 ease-spring",
              isOpen ? "border-primary-200 bg-primary-50/40" : "border-ink-100 bg-white"
            )}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span className="text-base font-semibold text-ink-950 sm:text-lg">
                  {item.question}
                </span>
                <span
                  className={clsx(
                    "flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-spring",
                    isOpen ? "rotate-45 bg-primary-600 text-white" : "bg-primary-50 text-primary-700"
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 sm:px-6"
            >
              <p className="max-w-3xl text-sm leading-relaxed text-ink-600 sm:text-base">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
