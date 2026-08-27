import * as authService from '../services/auth.service.js';
import * as authValidator from '../validators/auth.validator.js';
import { clearAuthCookies } from '../utils/auth/clearAuthCookies.util.js';
import { sendTokenResponse } from '../utils/auth/sendTokenResponse.util.js';
import ApiResponse from '../utils/ApiResponse.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';
import STATUS_CODES from '../constants/statusCodes.constant.js';

export const register = asyncHandler(async (req, res) => {
  authValidator.validateRegister(req.body);

  const result = await authService.register(req.body);

  new ApiResponse(
    res,
    STATUS_CODES.CREATED,
    'Registration successful. Please check your email for the verification OTP.',
    result
  );
});

export const verifyOTP = asyncHandler(async (req, res) => {
  authValidator.validateVerifyOTP(req.body);

  const result = await authService.verifyOTP(req.body);

  sendTokenResponse(res, STATUS_CODES.OK, 'Email verified successfully. You are now logged in.', result);
});

export const resendOTP = asyncHandler(async (req, res) => {
  authValidator.validateResendOTP(req.body);

  const result = await authService.resendOTP(req.body);

  new ApiResponse(res, STATUS_CODES.OK, 'A new verification OTP has been sent to your email.', result);
});

export const login = asyncHandler(async (req, res) => {
  authValidator.validateLogin(req.body);

  const result = await authService.login(req.body);

  sendTokenResponse(res, STATUS_CODES.OK, 'Logged in successfully.', result);
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const result = await authService.refreshAccessToken(refreshToken);

  sendTokenResponse(res, STATUS_CODES.OK, 'Token refreshed successfully.', result);
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await authService.logout(req.user._id);
  }

  clearAuthCookies(res);

  new ApiResponse(res, STATUS_CODES.OK, 'Logged out successfully.');
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const result = await authService.getCurrentUser(req.user._id);

  new ApiResponse(res, STATUS_CODES.OK, 'User fetched successfully.', result);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  authValidator.validateForgotPassword(req.body);
  const result = await authService.forgotPassword(req.body);
  new ApiResponse(res, STATUS_CODES.OK, 'Password reset OTP sent to your email.', result);
});

export const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
  authValidator.validateVerifyForgotPasswordOTP(req.body);
  const result = await authService.verifyForgotPasswordOTP(req.body);
  new ApiResponse(res, STATUS_CODES.OK, 'OTP verified successfully.', result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  authValidator.validateResetPassword(req.body);
  await authService.resetPassword(req.body);
  clearAuthCookies(res);
  new ApiResponse(res, STATUS_CODES.OK, 'Password reset successfully. Please login with your new password.');
});

export const changePassword = asyncHandler(async (req, res) => {
  authValidator.validateChangePassword(req.body);
  await authService.changePassword({
    userId: req.user._id,
    ...req.body,
  });
  clearAuthCookies(res);
  new ApiResponse(res, STATUS_CODES.OK, 'Password changed successfully. Please login again.');
});
