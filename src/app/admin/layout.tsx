import type { Metadata } from "next";
import { Open_Sans, Oswald } from "next/font/google";
import "../globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin | Pakindo Impex Perkasa",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${oswald.variable} h-full`}>
      <body className="h-full bg-ink-50 font-sans text-ink-900 antialiased">{children}</body>
    </html>
  );
}
