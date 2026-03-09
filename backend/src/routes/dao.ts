import { Router, Request, Response } from 'express';
import { db } from '../config/firebase.js';
import { fcl, CONTRACT_ADDRESS } from '../config/flow.js';

const router = Router();

router.get('/balance/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const balance = await fcl.query({
      cadence: `
        import NDAOToken from ${CONTRACT_ADDRESS}
        access(all) fun main(address: Address): UFix64 {
          return NDAOToken.getBalance(address: address)
        }
      `,
      args: (arg: any, t: any) => [arg(address, t.Address)],
    });
    res.json({ address, balance: parseFloat(balance) || 0, staked: 0, votingPower: parseFloat(balance) || 0 });
  } catch {
    res.json({ address: req.params.address, balance: 0, staked: 0, votingPower: 0 });
  }
});

router.get('/reputation/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const [proposalsSnap, votesSnap, opinionsSnap] = await Promise.all([
      db.collection('proposals').where('author', '==', address).get(),
      db.collection('votes').where('voter', '==', address).get(),
      db.collection('opinions').where('author', '==', address).get(),
    ]);
    const reputation = proposalsSnap.size * 10 + votesSnap.size * 2 + opinionsSnap.size;
    res.json({
      address,
      reputation,
      proposalsCreated: proposalsSnap.size,
      votesCast: votesSnap.size,
      opinionsPosted: opinionsSnap.size,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
