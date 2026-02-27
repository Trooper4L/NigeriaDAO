import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/chakra-provider";
import { AnonymityBadge } from "@/components/layout/anonymity-badge";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"]
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  weight: ["500", "600", "700"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Nigeria DAO Parliament",
  description: "Decentralized civic portal for national opinions, proposals, and voting."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} font-[var(--font-body)]`}>
        <Providers>
          <div className="grid-noise min-h-screen">
            <AnonymityBadge />
            <main>{children}</main>
            <MobileBottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
