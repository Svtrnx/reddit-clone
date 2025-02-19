import express from 'express';
import { healthCheck } from '../controllers/healthController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes below
router.use(authenticateToken);

// Database health check
router.get("/db", healthCheck)


export default router;