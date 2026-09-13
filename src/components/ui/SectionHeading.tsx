import { clsx } from "clsx";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  maxWidthClassName = "max-w-2xl",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  /** Overrides the default max-width utility (e.g. "max-w-3xl"). */
  maxWidthClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        maxWidthClassName,
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold-400 px-3.5 py-1.5 text-xs font-bold tracking-[0.2em] text-black uppercase">
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx(
          "text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]",
          tone === "dark" ? "text-ink-950" : "text-white"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={clsx(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-ink-600" : "text-ink-100"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
