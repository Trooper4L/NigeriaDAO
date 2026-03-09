import { Router, Request, Response } from 'express';
import { getSynapse } from '../config/synapse.js';
import { synapseUpload } from '../config/synapseUpload.js';

const router = Router();

router.post('/upload-text', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });

    const cidStr = await synapseUpload(text);
    const size = new TextEncoder().encode(text).length;

    res.json({
      cid: cidStr,
      size,
      gatewayUrl: `https://gateway.calibration.node.glif.io/ipfs/${cidStr}`,
      filecoinDealUrl: `https://calibration.filscan.io/tipset/message-detail?cid=${cidStr}`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload-image', async (req: Request, res: Response) => {
  try {
    const { data, mimeType } = req.body;
    if (!data) return res.status(400).json({ error: 'data (base64) is required' });

    const buffer = Buffer.from(data, 'base64');
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large (max 10MB)' });
    }

    const synapse = await getSynapse();
    const bytes = new Uint8Array(buffer.length < 127 ? 127 : buffer.length);
    bytes.set(buffer);
    const { pieceCid } = await synapse.storage.upload(bytes);
    const cidStr = pieceCid.toString();

    res.json({
      cid: cidStr,
      url: `https://gateway.calibration.node.glif.io/ipfs/${cidStr}`,
      mimeType: mimeType || 'application/octet-stream',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/download/:pieceCid', async (req: Request, res: Response) => {
  try {
    const synapse = await getSynapse();
    const data = await synapse.storage.download({ pieceCid: req.params.pieceCid });
    const text = new TextDecoder().decode(data);
    res.json({ content: text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
