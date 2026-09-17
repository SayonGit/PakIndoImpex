import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/constants";
import { getSiteSettings } from "@/lib/data";

export async function WhatsAppButton() {
  const settings = await getSiteSettings();

  return (
    <a
      href={buildWhatsAppLink(settings.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group relative flex size-14 items-center justify-center"
    >
      <span
        aria-hidden
        className="whatsapp-pulse-ring pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
      />
      <span className="shadow-soft-lg relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white transition-all duration-300 ease-spring group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-[0_18px_36px_-10px_rgba(37,211,102,0.6)]">
        <WhatsAppIcon className="size-7" />
      </span>
    </a>
  );
}
