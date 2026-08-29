import * as authService from '../services/auth.service.js';
import * as authValidator from '../validators/auth.validator.js';
import { clearAuthCookies } from '../utils/auth/clearAuthCookies.util.js';
import { sendTokenResponse } from '../utils/auth/sendTokenResponse.util.js';
import ApiResponse from '../utils/ApiResponse.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';
import STATUS_CODES from '../constants/statusCodes.constant.js';

export const register = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.file = req.file;
  }

  const result = await authService.register(payload);

  let message = 'Registration successful. Please check your email for the verification OTP.';
  if (result.role === 'recruiter') {
    message += ' Once verified and logged in, please register your company to post job openings.';
  }

  new ApiResponse(
    res,
    STATUS_CODES.CREATED,
    message,
    result
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const payload = { ...req.body, userId: req.id };
  if (req.file) {
    payload.file = req.file;
  } else {
    delete payload.file;
  }
  const result = await authService.updateProfile(payload);

  new ApiResponse(res, STATUS_CODES.OK, 'Profile updated successfully.', { user: result });
});

export const verifyOTP = asyncHandler(async (req, res) => {

  const result = await authService.verifyOTP(req.body);

  let message = 'Email verified successfully. You are now logged in.';
  if (result.user.role === 'recruiter') {
    message += ' Please register your company to post job openings.';
  }

  sendTokenResponse(res, STATUS_CODES.OK, message, result);
});

export const resendOTP = asyncHandler(async (req, res) => {

  const result = await authService.resendOTP(req.body);

  new ApiResponse(res, STATUS_CODES.OK, 'A new verification OTP has been sent to your email.', result);
});

export const login = asyncHandler(async (req, res) => {

  const result = await authService.login(req.body);

  let message = 'Logged in successfully.';
  if (result.user.role === 'recruiter') {
    message += ' Please ensure your company is registered to post job openings.';
  }

  sendTokenResponse(res, STATUS_CODES.OK, message, result);
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
  const result = await authService.forgotPassword(req.body);
  new ApiResponse(res, STATUS_CODES.OK, 'Password reset OTP sent to your email.', result);
});

export const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
  const result = await authService.verifyForgotPasswordOTP(req.body);
  new ApiResponse(res, STATUS_CODES.OK, 'OTP verified successfully.', result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  clearAuthCookies(res);
  new ApiResponse(res, STATUS_CODES.OK, 'Password reset successfully. Please login with your new password.');
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword({
    userId: req.user._id,
    ...req.body,
  });
  clearAuthCookies(res);
  new ApiResponse(res, STATUS_CODES.OK, 'Password changed successfully. Please login again.');
});
