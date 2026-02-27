"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, MessageSquareText } from "lucide-react";
import { Proposal } from "@/data/proposals";

const statusStyles: Record<Proposal["status"], string> = {
  Draft: "bg-white/10 text-white",
  "Public Discussion": "bg-flow-blue/20 text-flow-blue",
  Voting: "bg-nigeria-green/20 text-nigeria-green"
};

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-panel-elevated/80 p-4 shadow-secure">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.14em] text-ink-muted">{proposal.id}</p>
          <h3 className="text-lg font-semibold leading-tight text-white">{proposal.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[proposal.status]}`}>
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

      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="metadata" className="rounded-xl border border-white/10 bg-[#0C1219]">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between px-3 py-2 text-sm text-slate-100">
              <span>Proposal Metadata</span>
              <ChevronDown
                size={16}
                className="transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="space-y-2 border-t border-white/10 px-3 py-3 text-xs text-ink-muted">
            <p>
              CID: <span className="break-all text-slate-200">{proposal.cid}</span>
            </p>
            <p>
              Flow Hash: <span className="break-all text-slate-200">{proposal.flowHash}</span>
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </article>
  );
}
