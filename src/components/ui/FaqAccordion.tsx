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
    <div className={clsx("space-y-3", level > 0 && "mt-4 border-l-2 border-primary-200 pl-4 sm:pl-6")}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div
            key={item.question}
            className={clsx(
              "group overflow-hidden rounded-2xl border transition-all duration-300 ease-spring",
              level === 0 && "rounded-3xl",
              isOpen
                ? "border-primary-300 bg-white shadow-soft-lg"
                : "border-ink-100 bg-white shadow-soft hover:border-primary-200 hover:shadow-soft-lg"
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
                  "flex w-full items-center gap-4 text-left",
                  level === 0 ? "px-5 py-4 sm:px-7 sm:py-5" : "px-4 py-3 sm:px-5 sm:py-3.5"
                )}
              >
                {level === 0 && (
                  <span
                    className={clsx(
                      "hidden shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors duration-300 ease-spring sm:flex sm:size-9",
                      isOpen
                        ? "bg-gradient-to-br from-primary-600 to-primary-800 text-white"
                        : "bg-primary-50 text-primary-700 group-hover:bg-primary-100"
                    )}
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <span
                  className={clsx(
                    "flex-1 font-semibold text-ink-950",
                    level === 0 ? "text-sm sm:text-base" : "text-sm"
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={clsx(
                    "flex shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-spring",
                    level === 0 ? "size-8" : "size-6",
                    isOpen
                      ? "rotate-45 border-primary-600 bg-primary-600 text-white"
                      : "border-ink-200 bg-white text-ink-500 group-hover:border-primary-300 group-hover:text-primary-700"
                  )}
                >
                  <Plus className={level === 0 ? "size-4" : "size-3"} aria-hidden />
                </span>
              </button>
            </h3>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-spring"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                inert={!isOpen || undefined}
                className="overflow-hidden"
              >
                <div className={level === 0 ? "px-5 pb-5 sm:px-7" : "px-4 pb-3.5 sm:px-5"}>
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
