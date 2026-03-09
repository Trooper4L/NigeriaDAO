import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

const VOTE_THRESHOLD = 10;
const SUPPORT_RATIO = 0.6;

router.post('/', async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('proposals')
      .where('status', '==', 'Voting')
      .get();

    const resolved: { id: string; newStatus: string; author?: string }[] = [];

    await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const support = data.support || 0;
      const against = data.against || 0;
      const total = support + against;

      if (total < VOTE_THRESHOLD) return;

      const supportRatio = support / total;
      const newStatus = supportRatio >= SUPPORT_RATIO ? 'Accepted' : 'Rejected';

      await doc.ref.update({ status: newStatus });
      resolved.push({ id: doc.id, newStatus, author: data.author });
    }));

    res.json({ resolved, checked: snapshot.size });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
