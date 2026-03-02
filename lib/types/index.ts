export type ProposalStatus = "Draft" | "Public Discussion" | "Voting" | "Accepted" | "Rejected";

export type Proposal = {
  id: string;
  title: string;
  summary: string;
  description?: string;
  status: ProposalStatus;
  support: number;
  against: number;
  comments: number;
  cid: string;
  flowHash: string;
  author: string;
  createdAt: number;
  votingEndsAt?: number;
  category?: string;
  region?: string;
};

export type Opinion = {
  id: string;
  content: string;
  mediaUrls?: string[];
  cid: string;
  flowHash: string;
  author: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  createdAt: number;
  trending?: boolean;
};

export type Vote = {
  proposalId: string;
  voter: string;
  choice: "support" | "against";
  weight: number;
  timestamp: number;
  txHash: string;
};

export type User = {
  uid: string;
  pseudonym?: string;
  flowAddress?: string;
  isAnonymous: boolean;
  createdAt: number;
  reputation?: number;
  badges?: string[];
};

export type DAOToken = {
  balance: number;
  staked: number;
  votingPower: number;
};

export type CivicAnalytics = {
  totalProposals: number;
  totalVotes: number;
  totalOpinions: number;
  activeUsers: number;
  regionalData: RegionalData[];
  sentimentScore: number;
};

export type RegionalData = {
  state: string;
  proposalCount: number;
  voteCount: number;
  sentimentScore: number;
  topIssues: string[];
};

export type NFTBadge = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: "participation" | "governance" | "contribution";
  soulbound: boolean;
  earnedAt: number;
};
