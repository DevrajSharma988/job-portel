import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.config.js';
import getDataUri from '../utils/datauri.util.js';

import * as authRepository from '../repositories/auth.repository.js';

import { generateTokens, verifyRefreshToken } from './auth/token.service.js';

import {
  storeRefreshSession,
  getRefreshSession,
  removeRefreshSession,
} from './auth/session.service.js';

import { sendVerificationOTP, sendForgotPasswordOTP } from './auth/otp.service.js';

import createOTP from '../utils/auth/createOTP.util.js';
import hashPassword from '../utils/auth/hashPassword.util.js';
import hashToken from '../utils/auth/hashToken.util.js';

import ApiError from '../utils/ApiError.util.js';

import STATUS_CODES from '../constants/statusCodes.constant.js';

import { USER_ROLES } from '../constants/roles.constant.js';

export const register = async ({ fullname, email, phoneNumber, password, role, file }) => {
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'User already exists.');
  }

  let profilePhoto = "";
  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    profilePhoto = cloudResponse.secure_url;
  }

  const { otp, hashedOTP, expiresAt } = await createOTP();

  const hashedPassword = await hashPassword(password);

  const user = await authRepository.createUser({
    fullname,
    email,
    phoneNumber,
    password: hashedPassword,
    emailVerificationOTP: hashedOTP,
    emailVerificationOTPExpires: expiresAt,
    role,
    profile: { profilePhoto }
  });

  try {
    await sendVerificationOTP(email, otp);
  } catch (error) {
    await user.deleteOne();

    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to send verification OTP. Please try again.'
    );
  }

  return {
    email: user.email,
  };
};

export const updateProfile = async ({ userId, fullname, email, phoneNumber, bio, skills, file }) => {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  if (fullname) user.fullname = fullname;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  
  if (!user.profile) user.profile = {};
  if (bio) user.profile.bio = bio;
  if (skills) {
    user.profile.skills = typeof skills === 'string' ? skills.split(',') : skills;
  }

  if (file) {
    const fileUri = getDataUri(file);
    let cloudResponse;
    
    if (file.mimetype === 'application/pdf') {
      // Resume
      cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: 'raw' });
      if (cloudResponse) {
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = file.originalname;
      }
    } else {
      // Profile Photo
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      if (cloudResponse) {
        user.profile.profilePhoto = cloudResponse.secure_url;
      }
    }
  }

  await user.save();

  return {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile
  };
};

export const verifyOTP = async ({ email, otp }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  if (user.isVerified) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is already verified.');
  }

  if (!user.emailVerificationOTP || !user.emailVerificationOTPExpires) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Verification OTP not found.');
  }

  if (user.emailVerificationOTPExpires < new Date()) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'OTP has expired.');
  }

  const isOTPValid = await bcrypt.compare(otp, user.emailVerificationOTP);

  if (!isOTPValid) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid OTP.');
  }

  await authRepository.verifyUser(email);

  const updatedUser = await authRepository.findUserByEmail(email);

  const { accessToken, refreshToken } = generateTokens(updatedUser);

  await storeRefreshSession(updatedUser._id, refreshToken);

  return {
    user: {
      _id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    },
    accessToken,
    refreshToken,
  };
};

export const resendOTP = async ({ email }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  if (user.isVerified) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is already verified.');
  }

  const { otp, hashedOTP, expiresAt } = await createOTP();

  await authRepository.updateEmailVerificationOTP(email, hashedOTP, expiresAt);

  try {
    await sendVerificationOTP(email, otp);
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to send verification OTP. Please try again.'
    );
  }

  return {
    email: user.email,
  };
};

export const login = async ({ email, password }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'First Register your account before logging in.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid email or password.');
  }

  if (!user.isVerified) {
    const { otp, hashedOTP, expiresAt } = await createOTP();
    await authRepository.updateEmailVerificationOTP(email, hashedOTP, expiresAt);

    try {
      await sendVerificationOTP(email, otp);
    } catch (error) {
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to send verification OTP. Please try again.'
      );
    }

    const error = new ApiError(
      STATUS_CODES.FORBIDDEN,
      'Your email is not verified. A new verification code has been sent.'
    );
    error.code = 'ACCOUNT_UNVERIFIED';
    error.data = { email };
    throw error;
  }

  const { accessToken, refreshToken } = generateTokens(user);

  await storeRefreshSession(user._id.toString(), refreshToken);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Refresh token is required.');
  }

  const payload = verifyRefreshToken(refreshToken);

  const user = await authRepository.findUserById(payload.id);

  if (!user) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'User not found.');
  }

  const storedRefreshToken = await getRefreshSession(user._id.toString());

  if (!storedRefreshToken) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Session expired.');
  }

  const incomingTokenHash = hashToken(refreshToken);

  if (incomingTokenHash !== storedRefreshToken) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid refresh token.');
  }

  const tokens = generateTokens(user);

  await storeRefreshSession(user._id.toString(), tokens.refreshToken);

  return {
    user,
    ...tokens,
  };
};

export const logout = async (userId) => {
  await removeRefreshSession(userId);
};

export const getCurrentUser = async (userId) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
};

export const forgotPassword = async ({ email }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  const { otp, hashedOTP, expiresAt } = await createOTP();

  await authRepository.updateForgotPasswordOTP(email, hashedOTP, expiresAt);

  try {
    await sendForgotPasswordOTP(email, otp);
  } catch (error) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to send OTP.');
  }

  return {
    email,
  };
};

export const verifyForgotPasswordOTP = async ({ email, otp }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  if (!user.forgotPasswordOTP || !user.forgotPasswordOTPExpires) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Reset OTP not found.');
  }

  if (user.forgotPasswordOTPExpires < new Date()) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'OTP has expired.');
  }

  const isOTPValid = await bcrypt.compare(otp, user.forgotPasswordOTP);

  if (!isOTPValid) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid OTP.');
  }

  return { success: true };
};

export const resetPassword = async ({ email, otp, password }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  if (!user.forgotPasswordOTP || !user.forgotPasswordOTPExpires) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Reset OTP not found.');
  }

  if (user.forgotPasswordOTPExpires < new Date()) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'OTP has expired.');
  }

  const isOTPValid = await bcrypt.compare(otp, user.forgotPasswordOTP);

  if (!isOTPValid) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid OTP.');
  }

  const hashedPassword = await hashPassword(password);

  await authRepository.resetPassword(email, hashedPassword);

  await removeRefreshSession(user._id.toString());

  return;
};

export const changePassword = async ({ userId, oldPassword, newPassword }) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found.');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Old password is incorrect.');
  }

  if (oldPassword === newPassword) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'New password must be different from the old password.'
    );
  }

  const hashedPassword = await hashPassword(newPassword);

  await authRepository.changePassword(userId, hashedPassword);

  await removeRefreshSession(userId.toString());
};
