import validator from 'validator';

import ApiError from '../ApiError.util.js';

import STATUS_CODES from '../../constants/statusCodes.constant.js';

export const validatePassword = (password) => {
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
      'Password must contain uppercase, lowercase, number, special character and be at least 8 characters long'
    );
  }
};
export default validatePassword;
