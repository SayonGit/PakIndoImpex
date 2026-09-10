import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="border-b border-ink-100 bg-ink-50/60">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(trail)) }}
      />
      <ol className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-1.5 px-5 py-3 text-xs text-ink-500 sm:px-8 lg:px-10">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="size-3 shrink-0 rtl-flip" aria-hidden />}
              {isLast ? (
                <span className="font-semibold text-ink-800" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-primary-700">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
