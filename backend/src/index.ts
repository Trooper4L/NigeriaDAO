import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import proposalRoutes from './routes/proposals.js';
import opinionRoutes from './routes/opinions.js';
import voteRoutes from './routes/votes.js';
import analyticsRoutes from './routes/analytics.js';
import daoRoutes from './routes/dao.js';
import storageRoutes from './routes/storage.js';
import resolveRoutes from './routes/resolve.js';
import { getSynapse } from './config/synapse.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/proposals', proposalRoutes);
app.use('/api/opinions', opinionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dao', daoRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/resolve', resolveRoutes);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Nigeria DAO API running on port ${PORT}`);
  getSynapse()
    .then(() => console.log('[Synapse] Ready'))
    .catch((e) => console.warn('[Synapse] Pre-warm failed:', e.message));
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Kill the process using it and restart.`);
    process.exit(1);
  } else {
    throw err;
  }
});

export default app;
