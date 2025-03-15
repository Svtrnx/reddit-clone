const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

import express from 'express';
import userRoutes from './routes/userRoutes';
import subredditRoutes from './routes/subredditRoutes';
import threadRoutes from './routes/threadRoutes';
import voteRoutes from './routes/voteRoutes';
import healthRoutes from './routes/healthRoutes';

const app = express();

// Set up Prometheus middleware
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project: 'threadit-api' },
  promClient: { collectDefaultMetrics: {} },
  metricsPath: '/metrics',
  percentiles: [0.5, 0.9, 0.99], // p50, p90, p99 latency metrics
});

// Apply Prometheus middleware
app.use(metricsMiddleware);

// Other middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://threadit.site'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/subreddits', subredditRoutes);
app.use('/api/v1/threads', threadRoutes);
app.use('/api/v1/votes', voteRoutes);
app.use('/api/v1/health', healthRoutes);

export default app;