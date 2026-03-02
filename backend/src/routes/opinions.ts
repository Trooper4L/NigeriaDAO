import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import lighthouse from '@lighthouse-web3/sdk';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('opinions').orderBy('createdAt', 'desc').limit(50).get();
    const opinions = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    res.json(opinions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trending', async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('opinions').orderBy('createdAt', 'desc').limit(100).get();
    const opinions = snapshot.docs
      .map(doc => ({ firestoreId: doc.id, ...doc.data() } as any))
      .sort((a, b) => {
        const scoreA = (a.upvotes || 0) - (a.downvotes || 0) + (a.comments || 0) * 2;
        const scoreB = (b.upvotes || 0) - (b.downvotes || 0) + (b.comments || 0) * 2;
        return scoreB - scoreA;
      })
      .slice(0, 20);
    res.json(opinions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { content, author, mediaUrls = [] } = req.body;
    if (!content || !author) {
      return res.status(400).json({ error: 'content and author are required' });
    }

    const opinionData = {
      content, mediaUrls, author,
      createdAt: Date.now(),
      upvotes: 0, downvotes: 0, comments: 0,
    };

    const json = JSON.stringify(opinionData, null, 2);
    const upload = await lighthouse.uploadText(json, process.env.LIGHTHOUSE_API_KEY || '', 'opinion.json');
    const cid = upload.data.Hash;

    const opinion = {
      id: `OP-${Date.now()}`,
      ...opinionData,
      cid,
      flowHash: '',
      filecoinDealUrl: `https://filecoin.tools/${cid}`,
      gatewayUrl: `https://gateway.lighthouse.storage/ipfs/${cid}`,
    };

    const docRef = await db.collection('opinions').add(opinion);
    res.status(201).json({ firestoreId: docRef.id, ...opinion });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
