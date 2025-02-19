const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const cors = require('cors')

import express from 'express';
import userRoutes from './routes/userRoutes';
import subredditRoutes from './routes/subredditRoutes';
import threadRoutes from './routes/threadRoutes';
import voteRoutes from './routes/voteRoutes';
import healthRoutes from './routes/healthRoutes'

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://reddit-app.site'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));
app.use(cookieParser());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/subreddits', subredditRoutes);
app.use('/api/v1/threads', threadRoutes);
app.use('/api/v1/votes', voteRoutes);
app.use('/api/v1/health', healthRoutes);

export default app;