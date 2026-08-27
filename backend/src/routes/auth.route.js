import express from 'express';

import {
  register,
  verifyOTP,
  resendOTP,
  login,
  refresh,
  logout,
  getCurrentUser,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  changePassword,
} from '../controllers/auth.controller.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authMiddleware, logout);

router.get('/me', authMiddleware, getCurrentUser);

router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-password-otp', verifyForgotPasswordOTP);
router.post('/reset-password', resetPassword);

router.put('/change-password', authMiddleware, changePassword);

export default router;
