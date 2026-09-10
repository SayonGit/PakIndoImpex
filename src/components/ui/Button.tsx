import { clsx } from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "outlineLight"
  | "white"
  | "gold"
  | "ghost";
type ButtonSize = "md" | "lg";

/**
 * Each variant owns its own complete color set so callers never need to pass
 * conflicting color utilities via `className` (e.g. overriding a "primary"
 * button's green with gold) — Tailwind doesn't guarantee that later classes
 * in the `className` string win over earlier ones from `variantClasses`.
 * Add a new variant instead of overriding colors from a call site.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white shadow-[0_8px_20px_-8px_rgba(18,106,22,0.5)] hover:bg-primary-700 hover:shadow-[0_16px_32px_-10px_rgba(18,106,22,0.55)] focus-visible:outline-primary-600",
  secondary:
    "bg-secondary-600 text-white shadow-[0_8px_20px_-8px_rgba(203,21,20,0.5)] hover:bg-secondary-700 hover:shadow-[0_16px_32px_-10px_rgba(203,21,20,0.55)] focus-visible:outline-secondary-600",
  outline:
    "border-2 border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white focus-visible:outline-ink-900",
  outlineLight:
    "border-2 border-white/40 text-white hover:border-white hover:bg-white/10 focus-visible:outline-white",
  white:
    "bg-white text-ink-950 shadow-soft hover:bg-gold-100 hover:shadow-soft-lg focus-visible:outline-white",
  gold:
    "bg-gold-400 text-ink-950 shadow-[0_8px_20px_-8px_rgba(240,173,31,0.55)] hover:bg-gold-300 hover:shadow-[0_16px_32px_-10px_rgba(240,173,31,0.6)] focus-visible:outline-gold-400",
  ghost:
    "text-primary-700 hover:bg-primary-50 focus-visible:outline-primary-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

const baseClasses =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 ease-spring hover:-translate-y-0.5 active:translate-y-0 active:duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:translate-y-0";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">;

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & { href?: undefined };

function Arrow() {
  return (
    <ArrowUpRight
      className="size-4 rtl-flip transition-transform duration-300 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      aria-hidden
    />
  );
}

export function Button(props: ButtonAsLink | ButtonAsButton) {
  if ("href" in props && props.href) {
    const {
      href,
      external,
      variant = "primary",
      size = "md",
      showArrow = false,
      className,
      children,
      ...rest
    } = props;
    const classes = clsx(baseClasses, variantClasses[variant], sizeClasses[size], className);

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...(rest as ComponentPropsWithoutRef<"a">)}
        >
          {children}
          {showArrow && <Arrow />}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...(rest as ComponentPropsWithoutRef<"a">)}>
        {children}
        {showArrow && <Arrow />}
      </Link>
    );
  }

  const {
    type = "button",
    variant = "primary",
    size = "md",
    showArrow = false,
    className,
    children,
    ...rest
  } = props as ButtonAsButton;
  const classes = clsx(baseClasses, variantClasses[variant], sizeClasses[size], className);

  return (
    <button type={type} className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
      {showArrow && <Arrow />}
    </button>
  );
}
