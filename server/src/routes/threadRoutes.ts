import express from 'express';
import { getAllThreads, updateThreadVotes, deleteThreadById, getThreadById, createThread } from '../controllers/threadController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes below
router.use(authenticateToken);

// Create thread (protected route)
router.post('/', createThread);

// Get all threads (protected route)
router.get('/', getAllThreads);

// Get thread by id (protected route)
router.get("/:id", getThreadById);

// Update thread votes (protected route)
router.put('/:thread', updateThreadVotes);

// Delete thread by id (protected route)
router.delete("/:id", deleteThreadById);

export default router;