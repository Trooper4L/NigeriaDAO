import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { proposalId, voter, choice } = req.body;
    if (!proposalId || !voter || !choice) {
      return res.status(400).json({ error: 'proposalId, voter, and choice are required' });
    }
    if (!['support', 'against'].includes(choice)) {
      return res.status(400).json({ error: 'choice must be "support" or "against"' });
    }

    const existing = await db.collection('votes')
      .where('proposalId', '==', proposalId)
      .where('voter', '==', voter)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ error: 'Already voted on this proposal' });
    }

    const vote = { proposalId, voter, choice, weight: 1, timestamp: Date.now(), txHash: '' };
    const docRef = await db.collection('votes').add(vote);

    const proposalRef = db.collection('proposals').doc(proposalId);
    const proposalDoc = await proposalRef.get();
    if (proposalDoc.exists) {
      const data = proposalDoc.data()!;
      await proposalRef.update({
        support: choice === 'support' ? (data.support || 0) + 1 : (data.support || 0),
        against: choice === 'against' ? (data.against || 0) + 1 : (data.against || 0),
      });
    } else {
      const proposalSnap = await db.collection('proposals').where('id', '==', proposalId).get();
      if (!proposalSnap.empty) {
        const doc = proposalSnap.docs[0];
        const data = doc.data();
        await doc.ref.update({
          support: choice === 'support' ? (data.support || 0) + 1 : (data.support || 0),
          against: choice === 'against' ? (data.against || 0) + 1 : (data.against || 0),
        });
      }
    }

    res.status(201).json({ firestoreId: docRef.id, ...vote });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/proposal/:proposalId', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('votes')
      .where('proposalId', '==', req.params.proposalId)
      .get();

    let support = 0;
    let against = 0;
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.choice === 'support') support++;
      else against++;
    });

    res.json({ proposalId: req.params.proposalId, support, against, total: snapshot.size });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
