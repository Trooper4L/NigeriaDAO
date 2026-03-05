import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/chakra-provider";
import { CivicProvider } from "@/components/providers/civic-provider";
import { AnonymityBadge } from "@/components/layout/anonymity-badge";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { Box } from "@chakra-ui/react";

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
  description: "Decentralized civic portal for anonymous opinions, proposals, and transparent governance voting."
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
          <CivicProvider>
            <div className="grid-noise min-h-screen">
              <AnonymityBadge />
              <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6 }} py={{ base: 4, lg: 6 }} pb={{ base: 24, md: 10 }}>
                <Box display="flex" gap={{ base: 0, lg: 6 }} alignItems="flex-start">
                  <DesktopSidebar />
                  <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
                </Box>
              </Box>
              <MobileBottomNav />
            </div>
          </CivicProvider>
        </Providers>
      </body>
    </html>
  );
}
