import express from 'express';

import * as authController from '../controllers/auth.controller.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);

router.post('/verify-otp', authController.verifyOTP);

router.post('/resend-otp', authController.resendOTP);

router.post('/login',  authController.login);

router.post('/forgot-password',  authController.forgotPassword);

router.post('/verify-forgot-password-otp', authController.verifyForgotPasswordOTP);

router.post('/reset-password', authController.resetPassword);

router.patch(
  '/change-password',
  authMiddleware,
  authController.changePassword
);

router.post('/refresh-token', authController.refreshAccessToken);

router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
