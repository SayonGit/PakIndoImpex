import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Phone, Mail, MapPin, Share2 } from "lucide-react";
import { getSiteSettings, getSocialLinks } from "@/lib/data";
import { FacebookIcon, InstagramIcon, TwitterXIcon, YouTubeIcon } from "@/components/ui/SocialIcons";

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterXIcon,
  youtube: YouTubeIcon,
} as const;

function Separator({ className }: { className?: string }) {
  return <span className={`h-4 w-px shrink-0 bg-black/20 ${className ?? ""}`} aria-hidden />;
}

function ContactLink({
  href,
  icon: Icon,
  children,
  external,
  className,
}: {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group flex shrink-0 items-center gap-2 truncate ${className ?? ""}`}
    >
      <Icon
        className="size-5 shrink-0 text-primary-800 transition-transform duration-200 ease-spring group-hover:scale-110 group-hover:text-primary-500"
        strokeWidth={2.5}
        aria-hidden
      />
      <span className="truncate font-bold text-ink-950 underline-offset-4 transition-colors duration-200 group-hover:text-primary-500 group-hover:underline">
        {children}
      </span>
    </a>
  );
}

// Vertical swap-reveal button, adapted from the Uiverse.io "swift-bullfrog"
// pattern: the label slides up out of the clipped button while the social
// icons slide up into its place from below, staggered per icon.
function SocialReveal({ socialLinks }: { socialLinks: ReturnType<typeof getSocialLinks> }) {
  if (socialLinks.length === 0) return null;

  return (
    <div className="group relative flex h-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full px-4 text-primary-800 transition-all duration-300 ease-spring hover:scale-105 hover:text-primary-950">
      <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide whitespace-nowrap uppercase transition-transform duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:-translate-y-8">
        Follow us
        <Share2 className="size-4 shrink-0" aria-hidden />
      </span>
      <ul className="absolute inset-0 m-0 flex list-none items-center justify-center gap-3 p-0">
        {socialLinks.map((social, i) => {
          const Icon = SOCIAL_ICONS[social.key];
          return (
            <li key={social.key} className="flex">
              <a
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                style={{ transitionDelay: `${150 + i * 50}ms` }}
                className="flex translate-y-8 items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-y-0 hover:opacity-70"
              >
                <Icon className="size-4 shrink-0" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function TopBar() {
  const settings = await getSiteSettings();
  const socialLinks = getSocialLinks(settings);

  return (
    <div className="hidden bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black shadow-[0_1px_0_rgba(0,0,0,0.08)] sm:block">
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-between gap-4 px-5 text-xs sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-5">
          <ContactLink href={`tel:${settings.phone}`} icon={Phone}>
            {settings.phone}
          </ContactLink>

          <Separator className="hidden md:block" />
          <ContactLink href={`mailto:${settings.email}`} icon={Mail} className="hidden md:flex">
            {settings.email}
          </ContactLink>

          <Separator className="hidden lg:block" />
          <ContactLink
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
            icon={MapPin}
            external
            className="hidden lg:flex"
          >
            {settings.shortAddress}
          </ContactLink>
        </div>

        <SocialReveal socialLinks={socialLinks} />
      </div>
    </div>
  );
}
