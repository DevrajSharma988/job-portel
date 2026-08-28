import { User } from '../models/user.model.js';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (userId) => {
  return await User.findById(userId);
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const updateEmailVerificationOTP = async (email, hashedOTP, expiresAt) => {
  return await User.findOneAndUpdate(
    { email },
    {
      emailVerificationOTP: hashedOTP,
      emailVerificationOTPExpires: expiresAt,
    },
    { new: true }
  );
};

export const verifyUser = async (email) => {
  return await User.findOneAndUpdate(
    { email },
    {
      isVerified: true,
      emailVerificationOTP: null,
      emailVerificationOTPExpires: null,
    },
    { new: true }
  );
};

export const updateForgotPasswordOTP = async (email, hashedOTP, expiresAt) => {
  return await User.findOneAndUpdate(
    { email },
    {
      forgotPasswordOTP: hashedOTP,
      forgotPasswordOTPExpires: expiresAt,
    },
    { new: true }
  );
};

export const resetPassword = async (email, hashedPassword) => {
  return await User.findOneAndUpdate(
    { email },
    {
      password: hashedPassword,
      forgotPasswordOTP: null,
      forgotPasswordOTPExpires: null,
    },
    { new: true }
  );
};

export const changePassword = async (userId, hashedPassword) => {
  return await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );
};
