"use client";

import { BarChart3, FileText, Home, Vote } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, active: true },
  { label: "Parliament", icon: Vote, active: false },
  { label: "Proposals", icon: FileText, active: false },
  { label: "Analytics", icon: BarChart3, active: false }
];

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0B0E11]/95 px-2 py-2 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {navItems.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] ${
                item.active
                  ? "bg-nigeria-green/20 text-nigeria-green"
                  : "text-ink-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={15} />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
