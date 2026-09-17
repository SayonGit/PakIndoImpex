import Image from "next/image";
import { Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DotGrid } from "@/components/ui/DotGrid";
import { getPublishedTeamMembers } from "@/lib/data";

export async function TeamSection() {
  const members = await getPublishedTeamMembers();
  if (members.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <DotGrid id="dot-grid-team" className="pointer-events-none absolute inset-0 h-full w-full text-ink-900/[0.035]" />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl"
        aria-hidden
      />

      <Container className="relative">
        <SectionHeading eyebrow="Our People" title="Meet the Team" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="group shadow-soft flex flex-col items-center rounded-3xl border border-ink-100 bg-white p-8 text-center transition-all duration-300 ease-spring hover:-translate-y-1.5 hover:shadow-soft-lg"
            >
              <span className="relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-[0_8px_20px_-8px_rgba(18,106,22,0.4)] transition-transform duration-300 ease-spring group-hover:scale-105">
                {member.photoUrl ? (
                  <Image src={member.photoUrl} alt={member.name} fill sizes="80px" className="object-cover" />
                ) : (
                  <Users className="size-9" strokeWidth={1.75} aria-hidden />
                )}
              </span>
              <p className="mt-5 text-sm font-bold text-ink-800">{member.name}</p>
              <p className="mt-1 text-xs font-medium tracking-wide text-ink-400 uppercase">{member.role}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
