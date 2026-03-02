import { api } from '@/lib/api/client';
import { Opinion } from '@/lib/types';

export class OpinionService {
  static async createOpinion(
    content: string,
    author: string,
    mediaUrls: string[] = []
  ): Promise<Opinion> {
    return api.post<Opinion>('/api/opinions', { content, author, mediaUrls });
  }

  static async getOpinions(_limitCount: number = 50): Promise<Opinion[]> {
    return api.get<Opinion[]>('/api/opinions');
  }

  static async getTrendingOpinions(): Promise<Opinion[]> {
    return api.get<Opinion[]>('/api/opinions/trending');
  }
}
