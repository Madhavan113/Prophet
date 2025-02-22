// routes/user.router.js
import express from 'express';
import { 
  registerUser, 
  verifyUserEmail, 
  updateUser, 
  deleteUser, 
  getUsers 
} from '../controllers/user.controller.js';
import { 
  loginUser, 
  requestPasswordReset, 
  resetPassword 
} from '../controllers/auth.controller.js'; // or same file if you prefer

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/verify-email', verifyUserEmail);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes would have middleware (not shown here)
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/', getUsers);

export default router;
// This is a basic example of how you might structure your routes.