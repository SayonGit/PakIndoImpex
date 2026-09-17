import Image from "next/image";
import { ArrowRight, Newspaper } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { placeholderPhoto } from "@/lib/placeholder-images";

export function ArticleCard({
  title,
  excerpt,
  category,
  slug,
  publishDate,
}: {
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  publishDate: Date;
}) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-soft-lg"
    >
      <div className="relative h-48 overflow-hidden bg-ink-900">
        <Image
          src={placeholderPhoto(`article-${slug}`, 640, 400)}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold tracking-wide text-primary-700 uppercase shadow-soft backdrop-blur-sm">
          <Newspaper className="size-3" aria-hidden />
          {category}
        </span>
        <time
          dateTime={publishDate.toISOString()}
          className="absolute bottom-4 left-4 text-xs font-semibold text-white/90"
        >
          {publishDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-ink-950 transition-colors duration-300 ease-spring group-hover:text-primary-800">
          {title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-600">{excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
          Read Article
          <span className="flex size-7 items-center justify-center rounded-full bg-primary-50 text-primary-700 transition-all duration-300 ease-spring group-hover:bg-primary-600 group-hover:text-white">
            <ArrowRight
              className="rtl-flip size-3.5 transition-transform duration-300 ease-spring group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </span>
      </div>
    </Link>
  );
}
