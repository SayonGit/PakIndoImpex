import Image from "next/image";
import { Leaf } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { placeholderPhoto } from "@/lib/placeholder-images";

export function ProductCard({
  name,
  description,
  href,
  cta,
  slug,
}: {
  name: string;
  description: string;
  href: string;
  cta: string;
  slug: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg"
    >
      <div className="relative h-40 overflow-hidden bg-primary-800">
        <Image
          src={placeholderPhoto(`product-${slug}`, 640, 480)}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
        <span className="glass absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-full text-gold-300">
          <Leaf className="size-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-ink-950">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 group-hover:text-primary-800">
          {cta}
          <span
            aria-hidden
            className="rtl-flip transition-transform duration-300 ease-spring group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
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
