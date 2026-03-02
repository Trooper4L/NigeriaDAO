import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import proposalRoutes from './routes/proposals';
import opinionRoutes from './routes/opinions';
import voteRoutes from './routes/votes';
import analyticsRoutes from './routes/analytics';
import daoRoutes from './routes/dao';
import storageRoutes from './routes/storage';

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

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Nigeria DAO API running on port ${PORT}`);
});

export default app;
