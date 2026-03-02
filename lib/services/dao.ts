import { api } from '@/lib/api/client';
import { DAOToken } from '@/lib/types';

export class DAOService {
  static async getTokenBalance(address: string): Promise<DAOToken> {
    return api.get<DAOToken>(`/api/dao/balance/${address}`);
  }

  static async getReputation(address: string): Promise<any> {
    return api.get(`/api/dao/reputation/${address}`);
  }

  static calculateReputation(
    proposalsCreated: number,
    votesCast: number,
    opinionsPosted: number
  ): number {
    return proposalsCreated * 10 + votesCast * 2 + opinionsPosted;
  }
}
