import {
  CivicStore,
  Identity,
  ModerationStatus,
  Opinion,
  OpinionCreateInput,
  Proposal,
  ProposalCreateInput,
  ProposalStatus,
  VoteRecord
} from "@/lib/civic-types";

const POSITIVE_TERMS = ["progress", "improve", "better", "transparent", "support", "growth", "secure", "hope"];
const NEGATIVE_TERMS = ["corrupt", "failed", "broken", "fraud", "violent", "hate", "rigged", "worse"];
const FLAG_TERMS = ["kill", "attack", "bomb", "fraud scheme", "hate speech"];

const ADJECTIVES = ["Civic", "Bold", "Bright", "Steady", "Emerald", "Calm", "Solar", "United"];
const NOUNS = ["Observer", "Builder", "Voice", "Delegate", "Sentinel", "Citizen", "Anchor", "Pathfinder"];

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara"
];

function randomChunk() {
  return Math.random().toString(36).slice(2, 10);
}

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomChunk()}`;
}

export function createIdentity(): Identity {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return {
    id: createId("anon"),
    alias: `${adjective} ${noun}`,
    createdAt: new Date().toISOString()
  };
}

async function hashHex(input: string) {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return randomChunk().repeat(8);
}

export async function createProof(payload: string) {
  const hash = await hashHex(payload);
  return {
    cid: `bafy${hash.slice(0, 44)}`,
    flowHash: `0x${hash.slice(0, 16)}`
  };
}

export function scoreSentiment(text: string) {
  const normalized = text.toLowerCase();
  let score = 0;
  POSITIVE_TERMS.forEach((word) => {
    if (normalized.includes(word)) score += 1;
  });
  NEGATIVE_TERMS.forEach((word) => {
    if (normalized.includes(word)) score -= 1;
  });
  return Math.max(-5, Math.min(5, score));
}

export function moderateText(text: string): ModerationStatus {
  const normalized = text.toLowerCase();
  const flagged = FLAG_TERMS.some((term) => normalized.includes(term));
  return flagged ? "flagged" : "approved";
}

export function summarizeVotes(votes: VoteRecord[], proposalId: string) {
  const proposalVotes = votes.filter((v) => v.proposalId === proposalId);
  const support = proposalVotes.filter((v) => v.choice === "support").length;
  const against = proposalVotes.filter((v) => v.choice === "against").length;
  const total = support + against;
  const supportPct = total === 0 ? 0 : Math.round((support / total) * 100);
  return { total, support, against, supportPct };
}

export function canTransition(status: ProposalStatus, target: ProposalStatus) {
  const allowed: Record<ProposalStatus, ProposalStatus[]> = {
    Draft: ["Public Discussion"],
    "Public Discussion": ["Voting"],
    Voting: ["Accepted", "Rejected"],
    Accepted: [],
    Rejected: []
  };
  return allowed[status].includes(target);
}

export async function buildProposal(input: ProposalCreateInput, identity: Identity): Promise<Proposal> {
  const now = new Date().toISOString();
  const proof = await createProof(JSON.stringify({ ...input, identity, now }));
  return {
    id: createId("proposal"),
    title: input.title.trim(),
    summary: input.summary.trim(),
    details: input.details.trim(),
    state: input.state,
    tags: input.tags,
    status: "Draft",
    authorId: identity.id,
    authorAlias: identity.alias,
    createdAt: now,
    updatedAt: now,
    voteDeadline: input.voteDeadline,
    ...proof
  };
}

export async function buildOpinion(input: OpinionCreateInput, identity: Identity): Promise<Opinion> {
  const now = new Date().toISOString();
  const sentimentScore = scoreSentiment(input.body);
  const moderationStatus = moderateText(input.body);
  const proof = await createProof(JSON.stringify({ ...input, identity, sentimentScore, now }));
  return {
    id: createId("opinion"),
    body: input.body.trim(),
    mediaUrl: input.mediaUrl?.trim() || undefined,
    state: input.state,
    tags: input.tags,
    moderationStatus,
    sentimentScore,
    authorId: identity.id,
    authorAlias: identity.alias,
    createdAt: now,
    ...proof
  };
}

export function computeNationalSentiment(opinions: Opinion[]) {
  const approved = opinions.filter((o) => o.moderationStatus === "approved");
  if (approved.length === 0) return 0;
  const total = approved.reduce((acc, item) => acc + item.sentimentScore, 0);
  return Number((total / approved.length).toFixed(2));
}

export function computeStateSentiment(opinions: Opinion[]) {
  return NIGERIAN_STATES.map((state) => {
    const stateOpinions = opinions.filter((o) => o.state === state && o.moderationStatus === "approved");
    if (stateOpinions.length === 0) {
      return { state, sentiment: 0, count: 0 };
    }
    const total = stateOpinions.reduce((acc, item) => acc + item.sentimentScore, 0);
    return {
      state,
      sentiment: Number((total / stateOpinions.length).toFixed(2)),
      count: stateOpinions.length
    };
  });
}

export function emptyStore(identity: Identity): CivicStore {
  return {
    identity,
    proposals: [],
    opinions: [],
    votes: []
  };
}
