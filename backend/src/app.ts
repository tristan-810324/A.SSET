import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { apiRouter } from './routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

export const app = express();
const allowedOrigins = new Set([
  env.FRONTEND_ORIGIN,
  ...(env.NODE_ENV === 'development'
    ? ['http://localhost:4200', 'http://127.0.0.1:4200']
    : []),
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed by CORS.'));
  },
}));
app.use(express.json({ limit: '16kb' }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1', apiRouter);
app.use(errorHandler);
