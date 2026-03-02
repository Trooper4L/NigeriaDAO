import { api } from '@/lib/api/client';
import { CivicAnalytics, RegionalData } from '@/lib/types';

export class AnalyticsService {
  static async getCivicAnalytics(): Promise<CivicAnalytics> {
    return api.get<CivicAnalytics>('/api/analytics');
  }

  static async getRegionalData(): Promise<RegionalData[]> {
    const data = await api.get<CivicAnalytics>('/api/analytics');
    return data.regionalData;
  }

  static async getProposalsByCategory(): Promise<Record<string, number>> {
    return api.get<Record<string, number>>('/api/analytics/categories');
  }

  static async getVotingTrends(days: number = 30): Promise<any[]> {
    return api.get<any[]>(`/api/analytics/trends?days=${days}`);
  }
}
