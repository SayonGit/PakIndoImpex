import Image from "next/image";
import { Check, Leaf } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { placeholderPhoto } from "@/lib/placeholder-images";

export function ProductCard({
  name,
  description,
  href,
  cta,
  slug,
  image,
  features,
  titleClassName = "text-lg",
  external = false,
}: {
  name: string;
  description: string;
  href: string;
  cta: string;
  slug: string;
  /** Real product photo. Falls back to a generic placeholder when not yet available. */
  image?: string;
  /** Short honest attribute tags (e.g. "Natural Dry", "Export Ready") — not grades or claims. */
  features?: string[];
  /** Font-size utility class for the title, e.g. "text-3xl". Defaults to the original compact size. */
  titleClassName?: string;
  /** Set when href is an external URL (e.g. a wa.me link) — opens in a new tab instead of the i18n router. */
  external?: boolean;
}) {
  return (
    <div className="btn-sheen group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg">
      <div className="relative h-60 overflow-hidden bg-primary-800 sm:h-40">
        <Image
          src={image ?? placeholderPhoto(`product-${slug}`, 640, 480)}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
        <div className="glass pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-spring group-hover:opacity-100">
          <Leaf
            className="size-10 scale-75 text-white transition-transform duration-500 ease-spring group-hover:scale-100"
            aria-hidden
          />
        </div>
        <span className="glass absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-full text-gold-300 transition-transform duration-500 ease-spring group-hover:scale-110">
          <Leaf className="size-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className={`${titleClassName} font-bold leading-tight text-ink-950`}>{name}</h3>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">{description}</p>
        {features && features.length > 0 && (
          <ul className="mt-6 flex flex-col gap-x-3 gap-y-1.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-1 text-xs font-medium text-primary-800">
                <Check className="size-3.5 shrink-0 text-primary-600" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        )}
        <Button href={href} external={external} variant="gold" size="md" className="mt-6 w-fit">
          {cta}
        </Button>
      </div>
    </div>
  );
}

export function FeaturedProductCard({
  name,
  badge,
  description,
  features,
  href,
  cta,
  image,
  external = false,
}: {
  name: string;
  badge: string;
  description: string;
  features: string[];
  href: string;
  cta: string;
  image: string;
  /** Set when href is an external URL (e.g. a wa.me link) — opens in a new tab instead of the i18n router. */
  external?: boolean;
}) {
  const ctaClassName =
    "btn-sheen group/btn shadow-[0_8px_20px_-8px_rgba(18,106,22,0.5)] mt-10 inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-primary-700 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:from-primary-600 hover:to-primary-800 hover:shadow-[0_18px_36px_-10px_rgba(18,106,22,0.55)]";
  const ctaArrow = (
    <span
      aria-hidden
      className="rtl-flip transition-transform duration-300 ease-spring group-hover/btn:translate-x-1"
    >
      →
    </span>
  );
  return (
    <div className="btn-sheen group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg">
      <div className="relative h-70 overflow-hidden bg-primary-800 sm:h-110">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority={false}
          className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        <div className="glass pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-spring group-hover:opacity-100">
          <Leaf
            className="size-16 scale-75 text-white transition-transform duration-500 ease-spring group-hover:scale-100"
            aria-hidden
          />
        </div>
        <span className="glass absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-full text-gold-300 transition-transform duration-500 ease-spring group-hover:scale-110">
          <Leaf className="size-5" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <span className="inline-flex w-fit rounded-full bg-gold-400 px-3.5 py-1.5 text-xs font-bold tracking-[0.2em] text-black uppercase">
          {badge}
        </span>
        <h3 className="mt-4 text-5xl font-bold leading-tight text-ink-950">{name}</h3>
        <p className="mt-5 text-base leading-relaxed text-ink-700">{description}</p>
        <ul className="mt-10 flex flex-col gap-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-1.5 text-lg font-medium text-primary-800">
              <Check className="size-4 shrink-0 text-primary-600" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
        {external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={ctaClassName}>
            {cta}
            {ctaArrow}
          </a>
        ) : (
          <Link href={href} className={ctaClassName}>
            {cta}
            {ctaArrow}
          </Link>
        )}
      </div>
    </div>
  );
}

export function ComingSoonProductCard({ name, note }: { name: string; note: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-dashed border-ink-200 bg-ink-50/60">
      <div className="relative flex h-40 items-center justify-center bg-ink-100">
        <Leaf className="relative size-12 text-ink-300" aria-hidden />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-ink-500">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-400 italic">{note}</p>
      </div>
    </div>
  );
}
