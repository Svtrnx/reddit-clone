import express from 'express';
import { getAllSubreddits, subscribeSubredditToUser, deleteSubredditById, updateSubredditById, createSubreddit, seedSubreddits, getSubredditById } from '../controllers/subredditController';
import { authenticateToken } from '../middleware/auth';
import { createSubredditSchema } from '../validators/subredditValidator';

const router = express.Router();

// Apply authentication middleware to all routes below
router.use(authenticateToken);

router.post('/subscribe/:id', subscribeSubredditToUser);

// Create a new subreddit
router.post('/', async (req, res, next) => {
  try {
    await createSubredditSchema.validateAsync(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.details[0].message });
  }
}, createSubreddit);

// Get all subreddits (protected route)
router.get('/', getAllSubreddits);

// Get all subreddits (protected route)
router.get('/seed', seedSubreddits);

// Get subreddit by id (protected route)
router.get("/:id", getSubredditById);

// Delete subreddit by id (protected route)
router.delete("/:id", deleteSubredditById);

// Put subreddit by id (protected route)
router.put("/:id", updateSubredditById);

export default router;