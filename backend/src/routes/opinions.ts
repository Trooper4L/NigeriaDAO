import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';
import { synapseUpload } from '../config/synapseUpload.js';

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
    const cid = await synapseUpload(json);

    const opinion = {
      id: `OP-${Date.now()}`,
      ...opinionData,
      cid,
      flowHash: '',
      filecoinDealUrl: `https://calibration.filscan.io/tipset/message-detail?cid=${cid}`,
      gatewayUrl: `https://gateway.calibration.node.glif.io/ipfs/${cid}`,
    };

    const docRef = await db.collection('opinions').add(opinion);
    res.status(201).json({ firestoreId: docRef.id, ...opinion });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/vote', async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    if (type !== 'up' && type !== 'down') {
      return res.status(400).json({ error: 'type must be "up" or "down"' });
    }
    const field = type === 'up' ? 'upvotes' : 'downvotes';
    const docRef = db.collection('opinions').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Opinion not found' });
    const current = (doc.data()?.[field] || 0) + 1;
    await docRef.update({ [field]: current });
    res.json({ [field]: current });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { content, author = 'anonymous' } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    const comment = {
      content,
      author,
      createdAt: Date.now(),
    };

    const docRef = await db
      .collection('opinions')
      .doc(req.params.id)
      .collection('comments')
      .add(comment);

    await db.collection('opinions').doc(req.params.id).update({
      comments: (await db.collection('opinions').doc(req.params.id).get()).data()?.comments + 1 || 1,
    });

    res.status(201).json({ id: docRef.id, ...comment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/comments', async (req: Request, res: Response) => {
  try {
    const snapshot = await db
      .collection('opinions')
      .doc(req.params.id)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .get();
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
