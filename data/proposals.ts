export type Proposal = {
  id: string;
  title: string;
  summary: string;
  status: "Draft" | "Public Discussion" | "Voting";
  support: number;
  against: number;
  comments: number;
  cid: string;
  flowHash: string;
};

export const proposals: Proposal[] = [
  {
    id: "NDP-001",
    title: "National Youth Skills Treasury",
    summary: "Allocate 1% DAO treasury inflow to state-level vocational stipends verified on-chain.",
    status: "Voting",
    support: 68,
    against: 32,
    comments: 214,
    cid: "bafybeifdpn4u4k2v7p3k6oej5an2wmqj7l6rj5d4rjfdv3",
    flowHash: "0x8a3f29dd71b2c089"
  },
  {
    id: "NDP-002",
    title: "Public Utility Inflation Watch",
    summary: "Create open monthly utility price index for all 36 states and FCT with citizen verification.",
    status: "Public Discussion",
    support: 57,
    against: 43,
    comments: 167,
    cid: "bafybeigzy4ncxk7ql2xv6avemlyrmyp5s4f2q4u6h9ncv2",
    flowHash: "0xa19c77fd2e5fa6c1"
  },
  {
    id: "NDP-003",
    title: "Open Budget Tracking for Education",
    summary: "Pin federal and state education disbursements to IPFS and surface community spending alerts.",
    status: "Draft",
    support: 76,
    against: 24,
    comments: 91,
    cid: "bafybeif4af2vewsus67m4k4q4qvfwnjbwbm2ytqw1x7cbl",
    flowHash: "0x4cb3ac669bf12a4d"
  }
];
