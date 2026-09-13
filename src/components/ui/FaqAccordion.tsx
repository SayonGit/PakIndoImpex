"use client";

import { useId, useState } from "react";
import { clsx } from "clsx";
import { Plus } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
  /** Follow-up questions nested under this one — mirrors a <ul> nested under this item's <li>. */
  children?: FaqItem[];
};

export function FaqAccordion({
  items,
  defaultOpenIndex = null,
  level = 0,
}: {
  items: FaqItem[];
  /** Index to expand initially, or null (default) to start with everything collapsed. */
  defaultOpenIndex?: number | null;
  /** Nesting depth — 0 for the top-level list, incremented for each chained sub-list. */
  level?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const baseId = useId();

  return (
    <div className={clsx("space-y-2", level > 0 && "mt-3 border-l-2 border-primary-200 pl-4 sm:pl-6")}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div
            key={item.question}
            className={clsx(
              "rounded-2xl border transition-colors duration-300 ease-spring",
              isOpen ? "border-primary-200 bg-primary-50/40" : "border-ink-100 bg-white",
              level > 0 && "rounded-xl"
            )}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={clsx(
                  "flex w-full items-center justify-between gap-4 text-left",
                  level === 0 ? "px-5 py-3 sm:px-6 sm:py-3.5" : "px-4 py-2.5 sm:px-5 sm:py-3"
                )}
              >
                <span
                  className={clsx(
                    "font-semibold text-ink-950",
                    level === 0 ? "text-sm sm:text-base" : "text-sm"
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={clsx(
                    "flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-spring",
                    level === 0 ? "size-6" : "size-5",
                    isOpen ? "rotate-45 bg-primary-600 text-white" : "bg-primary-50 text-primary-700"
                  )}
                >
                  <Plus className={level === 0 ? "size-3.5" : "size-3"} aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={level === 0 ? "px-5 pb-4 sm:px-6" : "px-4 pb-3 sm:px-5"}
            >
              <p
                className={clsx(
                  "max-w-3xl leading-relaxed text-ink-600",
                  level === 0 ? "text-sm sm:text-base" : "text-sm"
                )}
              >
                {item.answer}
              </p>
              {item.children && item.children.length > 0 && (
                <FaqAccordion items={item.children} level={level + 1} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
