import validator from 'validator';

import ApiError from '../utils/ApiError.util.js';
import validatePassword from '../utils/auth/validatePassword.util.js';
import STATUS_CODES from '../constants/statusCodes.constant.js';

export const validateRegister = (data) => {
  const { fullname, email, password, role } = data;

  if (!fullname || !email || !password || !role) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid email.');
  }

  if (!['applicant', 'recruiter'].includes(role)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid role.');
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Password must contain uppercase, lowercase, number, special character and be at least 8 characters long.'
    );
  }
};

export const validateLogin = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email and Password are required.');
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid email.');
  }
};

export const validateVerifyOTP = (data) => {
  const { email, otp } = data;

  if (!email || !otp) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email and OTP are required.');
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid email.');
  }

  if (!validator.isLength(otp, { min: 6, max: 6 }) || !validator.isNumeric(otp)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid OTP.');
  }
};

export const validateResendOTP = (data) => {
  const { email } = data;

  if (!email) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is required.');
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid email.');
  }
};

export const validateForgotPassword = (data) => {
  const { email } = data;
  if (!email || !validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please provide a valid email.');
  }
};

export const validateResetPassword = (data) => {
  const { email, otp, password } = data;
  if (!email || !validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please provide a valid email.');
  }

  if (
    !otp ||
    !validator.isLength(otp, {
      min: 6,
      max: 6,
    }) ||
    !validator.isNumeric(otp)
  ) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please provide a valid OTP.');
  }

  validatePassword(password);
};

export const validateVerifyForgotPasswordOTP = (data) => {
  const { email, otp } = data;
  if (!email || !validator.isEmail(email)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please provide a valid email.');
  }

  if (
    !otp ||
    !validator.isLength(otp, {
      min: 6,
      max: 6,
    }) ||
    !validator.isNumeric(otp)
  ) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please provide a valid OTP.');
  }
};

export const validateChangePassword = ({ oldPassword, newPassword }) => {
  if (!oldPassword) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Old password is required.');
  }

  validatePassword(newPassword);
};
