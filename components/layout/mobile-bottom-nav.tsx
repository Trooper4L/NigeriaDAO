"use client";

import { BarChart3, Coins, Home, MessageSquare, Vote } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Parliament", icon: Vote, href: "/parliament" },
  { label: "Opinions", icon: MessageSquare, href: "/opinions" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "DAO", icon: Coins, href: "/dao" }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0B0E11]/95 px-2 py-2 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] ${
                  isActive
                    ? "bg-nigeria-green/20 text-nigeria-green"
                    : "text-ink-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
