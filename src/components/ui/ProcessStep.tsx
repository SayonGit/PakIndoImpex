export function ProcessStep({
  number,
  title,
  copy,
}: {
  number: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg">
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 font-serif text-lg font-black text-primary-700 tabular-nums transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:scale-105">
        {number}
      </span>
      <h3 className="mt-4 text-base font-bold text-ink-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{copy}</p>
    </div>
  );
}
