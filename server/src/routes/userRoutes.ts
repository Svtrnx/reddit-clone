import express from 'express';
import { createUser, loginUser, getCurrentUser, getAllUsers, getUserByUsername, deleteUserByUsername, updateUserByUsername } from '../controllers/userController';
import { createUserSchema } from '../validators/userValidator';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Create a new user
router.post('/', async (req, res, next) => {
  try {
    await createUserSchema.validateAsync(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ error: error.details[0].message });
  }
}, createUser);

// Authorize a user (public route)
router.post('/auth', loginUser);

// Apply authentication middleware to all routes below
router.use(authenticateToken);

// Get current user (protected route)
router.get('/me', getCurrentUser);

// Get all users (protected route)
router.get('/', getAllUsers);

// Get user by username (protected route)
router.get("/:username", getUserByUsername);

// Put user by username (protected route)
router.put("/:username", updateUserByUsername);

// Delete user by username (protected route)
router.delete("/:username", deleteUserByUsername);

export default router;