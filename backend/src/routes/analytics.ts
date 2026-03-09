import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const [proposalsSnap, votesSnap, opinionsSnap] = await Promise.all([
      db.collection('proposals').get(),
      db.collection('votes').get(),
      db.collection('opinions').get(),
    ]);

    const regionalMap = new Map<string, {
      state: string; proposalCount: number; voteCount: number;
      sentimentScore: number; topIssues: string[];
    }>();

    proposalsSnap.docs.forEach(doc => {
      const p = doc.data();
      const state = p.region || 'National';
      if (!regionalMap.has(state)) {
        regionalMap.set(state, { state, proposalCount: 0, voteCount: 0, sentimentScore: 0, topIssues: [] });
      }
      const r = regionalMap.get(state)!;
      r.proposalCount++;
      r.voteCount += (p.support || 0) + (p.against || 0);
    });

    let totalSentiment = 0;
    opinionsSnap.docs.forEach(doc => {
      const o = doc.data();
      totalSentiment += (o.upvotes || 0) - (o.downvotes || 0);
    });
    const sentimentScore = opinionsSnap.size > 0
      ? Math.min(100, Math.max(0, (totalSentiment / opinionsSnap.size) * 10 + 50))
      : 50;

    res.json({
      totalProposals: proposalsSnap.size,
      totalVotes: votesSnap.size,
      totalOpinions: opinionsSnap.size,
      activeUsers: 0,
      sentimentScore,
      regionalData: Array.from(regionalMap.values()).sort((a, b) => b.proposalCount - a.proposalCount),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('proposals').get();
    const categoryMap: Record<string, number> = {};
    snapshot.docs.forEach(doc => {
      const category = doc.data().category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    res.json(categoryMap);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trends', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const snapshot = await db.collection('votes').where('timestamp', '>=', cutoff).get();
    const dailyVotes: Record<string, number> = {};
    snapshot.docs.forEach(doc => {
      const date = new Date(doc.data().timestamp).toLocaleDateString();
      dailyVotes[date] = (dailyVotes[date] || 0) + 1;
    });
    res.json(Object.entries(dailyVotes).map(([date, votes]) => ({ date, votes })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
