import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pipelineRoutes from './app/routes/pipelines.js';
import userRoutes from './app/routes/users.js';
import aiRoutes from './app/routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/api/pipelines', pipelineRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

