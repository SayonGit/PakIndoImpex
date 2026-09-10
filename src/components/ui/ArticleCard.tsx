import Image from "next/image";
import { Newspaper } from "lucide-react";
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg"
    >
      <div className="relative h-36 overflow-hidden bg-ink-900">
        <Image
          src={placeholderPhoto(`article-${slug}`, 640, 400)}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
        <span className="glass absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-full text-gold-300">
          <Newspaper className="size-4" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-primary-700 uppercase">
          <span>{category}</span>
          <span aria-hidden>&middot;</span>
          <time dateTime={publishDate.toISOString()}>
            {publishDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
        <h3 className="mt-3 text-lg font-bold text-ink-950 group-hover:text-primary-800">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
          Read Article
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
