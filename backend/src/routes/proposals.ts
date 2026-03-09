import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';
import { synapseUpload } from '../config/synapseUpload.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('proposals').orderBy('createdAt', 'desc').limit(50).get();
    const proposals = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    res.json(proposals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/status/:status', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('proposals')
      .where('status', '==', req.params.status)
      .orderBy('createdAt', 'desc')
      .get();
    const proposals = snapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    res.json(proposals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, summary, description, author, category, region } = req.body;
    if (!title || !summary || !author) {
      return res.status(400).json({ error: 'title, summary, and author are required' });
    }

    const proposalData = {
      title, summary, description, author, category, region,
      createdAt: Date.now(),
      status: 'Voting',
      support: 0,
      against: 0,
      comments: 0,
    };

    const json = JSON.stringify(proposalData, null, 2);
    const cid = await synapseUpload(json);

    const proposal = {
      id: `NDP-${String(Date.now()).slice(-6)}`,
      ...proposalData,
      cid,
      flowHash: '',
      filecoinDealUrl: `https://calibration.filscan.io/tipset/message-detail?cid=${cid}`,
      gatewayUrl: `https://gateway.calibration.node.glif.io/ipfs/${cid}`,
    };

    const docRef = await db.collection('proposals').add(proposal);
    res.status(201).json({ firestoreId: docRef.id, ...proposal });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:firestoreId/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status is required' });
    await db.collection('proposals').doc(req.params.firestoreId).update({ status });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
