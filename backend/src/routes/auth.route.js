import express from 'express';

import * as authController from '../controllers/auth.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import * as authValidator from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validate(authValidator.validateRegister), authController.register);

router.post('/verify-otp', validate(authValidator.validateVerifyOTP), authController.verifyOTP);

router.post('/resend-otp', validate(authValidator.validateResendOTP), authController.resendOTP);

router.post('/login', validate(authValidator.validateLogin), authController.login);

router.post('/forgot-password', validate(authValidator.validateForgotPassword), authController.forgotPassword);

router.post('/verify-forgot-password-otp', validate(authValidator.validateVerifyForgotPasswordOTP), authController.verifyForgotPasswordOTP);

router.post('/reset-password', validate(authValidator.validateResetPassword), authController.resetPassword);

router.patch(
  '/change-password',
  authMiddleware,
  validate(authValidator.validateChangePassword),
  authController.changePassword
);

router.post('/refresh-token', authController.refresh);

router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
