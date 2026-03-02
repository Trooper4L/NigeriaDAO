import { Router, Request, Response } from 'express';
import lighthouse from '@lighthouse-web3/sdk';

const router = Router();

router.post('/upload-text', async (req: Request, res: Response) => {
  try {
    const { text, name = 'content.txt' } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });
    const upload = await lighthouse.uploadText(text, process.env.LIGHTHOUSE_API_KEY || '', name);
    const cid = upload.data.Hash;
    res.json({
      cid,
      gatewayUrl: `https://gateway.lighthouse.storage/ipfs/${cid}`,
      filecoinDealUrl: `https://filecoin.tools/${cid}`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/deal-status/:cid', async (req: Request, res: Response) => {
  try {
    const response = await fetch(`https://api.lighthouse.storage/api/lighthouse/deal_status?cid=${req.params.cid}`);
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/uploads', async (_req: Request, res: Response) => {
  try {
    const result = await lighthouse.getUploads(process.env.LIGHTHOUSE_API_KEY || '');
    res.json(result.data.fileList || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
