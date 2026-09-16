import { clsx } from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "outlineLight"
  | "white"
  | "gold"
  | "ghost";
export type ButtonSize = "md" | "lg";

/**
 * Each variant owns its own complete color set so callers never need to pass
 * conflicting color utilities via `className` (e.g. overriding a "primary"
 * button's green with gold) — Tailwind doesn't guarantee that later classes
 * in the `className` string win over earlier ones from `variantClasses`.
 * Add a new variant instead of overriding colors from a call site.
 *
 * Filled variants use a two-stop gradient (deepens on hover) plus the
 * `.btn-sheen` light-sweep; the two outline variants become real frosted
 * glass on hover instead of a flat color fill.
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-[0_8px_20px_-8px_rgba(18,106,22,0.5)] hover:from-primary-600 hover:to-primary-800 hover:shadow-[0_18px_36px_-10px_rgba(18,106,22,0.55)] focus-visible:outline-primary-600",
  secondary:
    "bg-gradient-to-br from-secondary-500 to-secondary-700 text-white shadow-[0_8px_20px_-8px_rgba(203,21,20,0.5)] hover:from-secondary-600 hover:to-secondary-800 hover:shadow-[0_18px_36px_-10px_rgba(203,21,20,0.55)] focus-visible:outline-secondary-600",
  outline:
    "border-2 border-ink-900 bg-transparent text-ink-900 hover:border-primary-600 hover:bg-primary-50/80 hover:text-primary-800 hover:shadow-soft hover:backdrop-blur-md focus-visible:outline-ink-900",
  outlineLight:
    "border-2 border-white/40 bg-transparent text-white hover:border-white hover:bg-white/15 hover:shadow-soft-lg hover:backdrop-blur-md focus-visible:outline-white",
  white:
    "bg-gradient-to-br from-white to-gold-50 text-ink-950 shadow-soft hover:from-gold-50 hover:to-gold-200 hover:shadow-soft-lg focus-visible:outline-white",
  gold:
    "bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-[0_8px_20px_-8px_rgba(240,173,31,0.55)] hover:from-gold-400 hover:to-gold-600 hover:shadow-[0_18px_36px_-10px_rgba(240,173,31,0.6)] focus-visible:outline-gold-400",
  ghost:
    "bg-transparent text-primary-700 hover:bg-primary-50/80 hover:shadow-soft hover:backdrop-blur-sm focus-visible:outline-primary-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-2.5",
  lg: "px-6 py-3.5",
};

// text-[0.8rem] lives here (not in sizeClasses) so every Button instance
// shares one font-size with no risk of two same-property utility classes
// (this plus a size's own text-* class) racing for precedence.
const baseClasses =
  "btn-sheen group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full text-[0.8rem] font-semibold uppercase transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 active:duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100";

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
