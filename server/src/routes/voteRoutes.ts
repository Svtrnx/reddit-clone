import express from 'express';
import { createOrUpdateVoteByThreadId } from '../controllers/voteController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes below
router.use(authenticateToken);

// Update vote by thread id (protected route)
router.post("/:thread", createOrUpdateVoteByThreadId);


export default router;