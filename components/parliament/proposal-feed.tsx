import { ProposalCard } from "@/components/parliament/proposal-card";
import { proposals } from "@/data/proposals";

export function ProposalFeed() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6 md:pb-8">
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#0E141C]/80 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">Parliament</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Civic Proposal Feed</h2>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          Track drafts, discussions, and live voting outcomes. Proposal data is pinned to Filecoin/IPFS and verified
          on Flow.
        </p>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </section>
  );
}
