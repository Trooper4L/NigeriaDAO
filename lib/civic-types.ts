export type ProposalStatus = "Draft" | "Public Discussion" | "Voting" | "Accepted" | "Rejected";

export type VoteChoice = "support" | "against";

export type ModerationStatus = "pending" | "approved" | "flagged" | "removed";

export type Identity = {
  id: string;
  alias: string;
  createdAt: string;
};

export type Proposal = {
  id: string;
  title: string;
  summary: string;
  details: string;
  state: string;
  tags: string[];
  status: ProposalStatus;
  authorId: string;
  authorAlias: string;
  createdAt: string;
  updatedAt: string;
  voteDeadline: string;
  cid: string;
  flowHash: string;
};

export type Opinion = {
  id: string;
  body: string;
  mediaUrl?: string;
  state: string;
  tags: string[];
  moderationStatus: ModerationStatus;
  sentimentScore: number;
  authorId: string;
  authorAlias: string;
  createdAt: string;
  cid: string;
  flowHash: string;
};

export type VoteRecord = {
  proposalId: string;
  voterId: string;
  choice: VoteChoice;
  createdAt: string;
};

export type CivicStore = {
  identity: Identity;
  proposals: Proposal[];
  opinions: Opinion[];
  votes: VoteRecord[];
};

export type ProposalCreateInput = {
  title: string;
  summary: string;
  details: string;
  state: string;
  tags: string[];
  voteDeadline: string;
};

export type OpinionCreateInput = {
  body: string;
  mediaUrl?: string;
  state: string;
  tags: string[];
};
