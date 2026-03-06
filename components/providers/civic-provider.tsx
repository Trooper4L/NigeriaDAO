"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  buildOpinion,
  buildProposal,
  canTransition,
  computeNationalSentiment,
  computeStateSentiment,
  createIdentity,
  emptyStore,
  summarizeVotes
} from "@/lib/civic-engine";
import {
  CivicStore,
  ModerationStatus,
  OpinionCreateInput,
  ProposalCreateInput,
  ProposalStatus,
  VoteChoice
} from "@/lib/civic-types";

const STORAGE_KEY = "nigeria_dao_store_v1";

type CivicContextValue = {
  store: CivicStore;
  hydrated: boolean;
  createProposal: (input: ProposalCreateInput) => Promise<void>;
  createOpinion: (input: OpinionCreateInput) => Promise<void>;
  castVote: (proposalId: string, choice: VoteChoice) => { ok: boolean; message: string };
  transitionProposal: (proposalId: string, target: ProposalStatus) => { ok: boolean; message: string };
  finalizeVote: (proposalId: string) => { ok: boolean; message: string };
  moderateOpinion: (opinionId: string, status: ModerationStatus) => void;
  refreshIdentity: () => void;
  analytics: {
    nationalSentiment: number;
    stateSentiment: { state: string; sentiment: number; count: number }[];
    moderationQueue: number;
    openVoting: number;
  };
  getProposalMetrics: (proposalId: string) => {
    total: number;
    support: number;
    against: number;
    supportPct: number;
  };
};

const CivicContext = createContext<CivicContextValue | null>(null);

function parseStored(raw: string | null): CivicStore | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CivicStore>;
    if (!parsed.identity || !Array.isArray(parsed.proposals) || !Array.isArray(parsed.opinions)) {
      return null;
    }
    return {
      identity: parsed.identity,
      proposals: parsed.proposals,
      opinions: parsed.opinions,
      votes: Array.isArray(parsed.votes) ? parsed.votes : []
    };
  } catch {
    return null;
  }
}

export function CivicProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<CivicStore>(() => emptyStore(createIdentity()));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = parseStored(window.localStorage.getItem(STORAGE_KEY));
    if (stored) setStore(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store, hydrated]);

  const createProposalHandler = async (input: ProposalCreateInput) => {
    const proposal = await buildProposal(input, store.identity);
    setStore((prev) => ({ ...prev, proposals: [proposal, ...prev.proposals] }));
  };

  const createOpinionHandler = async (input: OpinionCreateInput) => {
    const opinion = await buildOpinion(input, store.identity);
    setStore((prev) => ({ ...prev, opinions: [opinion, ...prev.opinions] }));
  };

  const castVoteHandler = (proposalId: string, choice: VoteChoice) => {
    const proposal = store.proposals.find((item) => item.id === proposalId);
    if (!proposal) return { ok: false, message: "Proposal not found." };
    if (proposal.status !== "Voting") return { ok: false, message: "Proposal is not in voting stage." };
    const existing = store.votes.find((vote) => vote.proposalId === proposalId && vote.voterId === store.identity.id);
    if (existing) return { ok: false, message: "One-person-one-vote enforced: vote already cast." };

    setStore((prev) => ({
      ...prev,
      votes: [{ proposalId, voterId: prev.identity.id, choice, createdAt: new Date().toISOString() }, ...prev.votes]
    }));

    return { ok: true, message: "Vote recorded successfully." };
  };

  const transitionProposalHandler = (proposalId: string, target: ProposalStatus) => {
    const proposal = store.proposals.find((item) => item.id === proposalId);
    if (!proposal) return { ok: false, message: "Proposal not found." };
    if (!canTransition(proposal.status, target)) return { ok: false, message: "Invalid status transition." };

    setStore((prev) => ({
      ...prev,
      proposals: prev.proposals.map((item) =>
        item.id === proposalId ? { ...item, status: target, updatedAt: new Date().toISOString() } : item
      )
    }));

    return { ok: true, message: `Proposal moved to ${target}.` };
  };

  const finalizeVoteHandler = (proposalId: string) => {
    const proposal = store.proposals.find((item) => item.id === proposalId);
    if (!proposal) return { ok: false, message: "Proposal not found." };
    if (proposal.status !== "Voting") return { ok: false, message: "Proposal is not in voting stage." };

    const metrics = summarizeVotes(store.votes, proposalId);
    const result: ProposalStatus = metrics.supportPct >= 50 ? "Accepted" : "Rejected";

    setStore((prev) => ({
      ...prev,
      proposals: prev.proposals.map((item) =>
        item.id === proposalId ? { ...item, status: result, updatedAt: new Date().toISOString() } : item
      )
    }));

    return { ok: true, message: `Voting finalized. Proposal ${result.toLowerCase()}.` };
  };

  const moderateOpinionHandler = (opinionId: string, status: ModerationStatus) => {
    setStore((prev) => ({
      ...prev,
      opinions: prev.opinions.map((item) => (item.id === opinionId ? { ...item, moderationStatus: status } : item))
    }));
  };

  const refreshIdentityHandler = () => {
    setStore((prev) => ({ ...prev, identity: createIdentity() }));
  };

  const analytics = useMemo(() => {
    const openVoting = store.proposals.filter((p) => p.status === "Voting").length;
    const moderationQueue = store.opinions.filter((o) => o.moderationStatus === "flagged").length;
    return {
      nationalSentiment: computeNationalSentiment(store.opinions),
      stateSentiment: computeStateSentiment(store.opinions).filter((entry) => entry.count > 0),
      moderationQueue,
      openVoting
    };
  }, [store.opinions, store.proposals]);

  const getProposalMetrics = (proposalId: string) => summarizeVotes(store.votes, proposalId);

  const value: CivicContextValue = {
    store,
    hydrated,
    createProposal: createProposalHandler,
    createOpinion: createOpinionHandler,
    castVote: castVoteHandler,
    transitionProposal: transitionProposalHandler,
    finalizeVote: finalizeVoteHandler,
    moderateOpinion: moderateOpinionHandler,
    refreshIdentity: refreshIdentityHandler,
    analytics,
    getProposalMetrics
  };

  return <CivicContext.Provider value={value}>{children}</CivicContext.Provider>;
}

export function useCivic() {
  const context = useContext(CivicContext);
  if (!context) throw new Error("useCivic must be used inside CivicProvider.");
  return context;
}
