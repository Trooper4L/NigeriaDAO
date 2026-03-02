"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, MessageSquareText, ExternalLink } from "lucide-react";
import { Proposal } from "@/data/proposals";
import { VoteButton } from "@/components/voting/vote-button";

const statusStyles: Record<Proposal["status"], string> = {
  Draft: "bg-white/10 text-white",
  "Public Discussion": "bg-flow-blue/20 text-flow-blue",
  Voting: "bg-nigeria-green/20 text-nigeria-green",
  Accepted: "bg-emerald-500/20 text-emerald-400",
  Rejected: "bg-red-500/20 text-red-400"
};

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-panel-elevated/80 p-4 shadow-secure">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.14em] text-ink-muted">{proposal.id}</p>
          <h3 className="text-lg font-semibold leading-tight text-white">{proposal.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusStyles[proposal.status]}`}>
          {proposal.status}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-slate-200">{proposal.summary}</p>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
          <span>Vote progress</span>
          <span>{proposal.support}% support</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-nigeria-green" style={{ width: `${proposal.support}%` }} />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 text-xs text-ink-muted">
        <span>Support {proposal.support}%</span>
        <span>Against {proposal.against}%</span>
        <span className="inline-flex items-center gap-1">
          <MessageSquareText size={13} />
          {proposal.comments} comments
        </span>
      </div>

      {proposal.status === "Voting" && (
        <div className="mb-4">
          <VoteButton proposalId={proposal.id} />
        </div>
      )}

      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="metadata" className="rounded-xl border border-white/10 bg-[#0C1219]">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between px-3 py-2 text-sm text-slate-100">
              <span>On-Chain Proof</span>
              <ChevronDown
                size={16}
                className="transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="space-y-2 border-t border-white/10 px-3 py-3 text-xs text-ink-muted">
            <div className="flex items-center justify-between gap-2">
              <span className="shrink-0">IPFS / Filecoin CID:</span>
              <div className="flex items-center gap-1 overflow-hidden">
                <span className="truncate font-mono text-slate-200">{proposal.cid}</span>
                <a
                  href={`https://gateway.lighthouse.storage/ipfs/${proposal.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-flow-blue hover:text-white"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="shrink-0">Flow Tx Hash:</span>
              <div className="flex items-center gap-1 overflow-hidden">
                <span className="truncate font-mono text-slate-200">{proposal.flowHash}</span>
                <a
                  href={`https://testnet.flowscan.io/tx/${proposal.flowHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-flow-blue hover:text-white"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </article>
  );
}
