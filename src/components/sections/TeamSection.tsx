import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { placeholderAvatar } from "@/lib/placeholder-images";

const TEAM_PLACEHOLDERS = 3;

/**
 * Placeholder-ready Team section. assets/CONTENT.md explicitly forbids
 * inventing employee/team information, and no real names, roles, or photos
 * exist yet — so every card here is an explicit [VERIFY: ...] placeholder,
 * never a fabricated name or title. The avatar photos are generic
 * placeholder portraits (see src/lib/placeholder-images.ts), not real
 * people. Swap in real people/photos once confirmed.
 */
export function TeamSection() {
  return (
    <section className="bg-white pb-16 sm:pb-24">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
            Meet the Team
          </h2>
          <p className="max-w-sm text-xs text-ink-500 italic">
            Team profiles are pending verification and will be published once confirmed.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: TEAM_PLACEHOLDERS }).map((_, index) => (
            <div
              key={index}
              className="shadow-soft flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 p-8 text-center transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="relative size-20 overflow-hidden rounded-full grayscale">
                <Image
                  src={placeholderAvatar(`team-${index}`, 160)}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <p className="mt-5 text-sm font-bold text-ink-500">[VERIFY: TEAM MEMBER NAME]</p>
              <p className="mt-1 text-xs font-medium text-ink-400 uppercase">[VERIFY: ROLE / TITLE]</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
