import express from 'express';
import {
  registerUser,
  verifyUserEmail,
  updateUser,
  deleteUser,
  getUsers,
} from '../controllers/user.controller.js';
import {
  loginUser,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js'; // If you have a protect middleware

const router = express.Router();

/**
 * Public routes
 */
router.post('/register', registerUser);
router.post('/verify-email', verifyUserEmail);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

/**
 * Protected routes (require `protect` middleware, if used)
 */
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.get('/', getUsers);

export default router;
