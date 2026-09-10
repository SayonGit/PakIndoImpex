import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // TODO: temporary — generic placeholder images used for visual
      // preview (see src/lib/placeholder-images.ts). Remove once real
      // Pakindo photography replaces them before launch.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      // Real, freely-licensed (Pixabay Content License) areca nut / palm
      // leaf photography used on the homepage hero — see
      // src/data/stock-imagery.ts for licensing/source notes per image.
      { protocol: "https", hostname: "cdn.pixabay.com" },
      // Wikimedia Commons cross-section photo (CC BY-SA — see
      // src/data/stock-imagery.ts for the required attribution).
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
