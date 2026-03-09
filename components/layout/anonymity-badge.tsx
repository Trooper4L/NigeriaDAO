"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { useDisclosure } from "@chakra-ui/react";
import { FlowWalletConnect } from "@/components/wallet/flow-wallet-connect";
import { FlowWalletModal } from "@/components/wallet/flow-wallet-modal";

export function AnonymityBadge() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0E11]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Image
            src="/naijadao-logo.png"
            alt="NaijaDAO Logo"
            width={36}
            height={36}
            className="rounded-full object-contain"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Anonymity Layer</p>
            <p className="text-sm font-semibold text-white">Protection Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <FlowWalletConnect onOpenModal={onOpen} />
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-flow-blue/35 bg-flow-blue/10 px-3 py-1 text-xs font-semibold text-flow-blue">
            <BadgeCheck size={13} />
            Safe
          </div>
        </div>
      </div>
      <FlowWalletModal isOpen={isOpen} onClose={onClose} />
    </header>
  );
}
