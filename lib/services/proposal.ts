import { api } from '@/lib/api/client';
import { Proposal, ProposalStatus } from '@/lib/types';

export class ProposalService {
  static async createProposal(
    title: string,
    summary: string,
    description: string,
    author: string,
    category?: string,
    region?: string
  ): Promise<Proposal> {
    return api.post<Proposal>('/api/proposals', { title, summary, description, author, category, region });
  }

  static async getProposals(_limitCount: number = 50): Promise<Proposal[]> {
    return api.get<Proposal[]>('/api/proposals');
  }

  static async getProposalsByStatus(status: ProposalStatus): Promise<Proposal[]> {
    return api.get<Proposal[]>(`/api/proposals/status/${status}`);
  }

  static async updateProposalStatus(firestoreId: string, newStatus: ProposalStatus): Promise<void> {
    await api.patch(`/api/proposals/${firestoreId}/status`, { status: newStatus });
  }

  static async castVote(proposalId: string, choice: 'support' | 'against', voter: string): Promise<void> {
    await api.post('/api/votes', { proposalId, voter, choice });
  }

  static async getProposalVotes(proposalId: string): Promise<{ support: number; against: number }> {
    return api.get<{ support: number; against: number }>(`/api/votes/proposal/${proposalId}`);
  }
}
