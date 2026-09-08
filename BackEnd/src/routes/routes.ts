import {
  getProfile,
  login,
  logout,
  refreshToken,
  register,
} from '@/controllers/authController.js';
import { auth } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { loginSchema, registerSchemaBackend } from '@authforge/shared';
import { Router } from 'express';

const router = Router();

// Public routes
router.post('/register', validate(registerSchemaBackend), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);

// Protected routes middleware
router.use(auth);

// Protected routes
router.get('/profile', getProfile);
router.post('/logout', logout);

export default router;
