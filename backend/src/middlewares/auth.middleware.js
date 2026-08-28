import * as authRepository from '../repositories/auth.repository.js';

import { verifyAccessToken } from '../services/auth/token.service.js';

import ApiError from '../utils/ApiError.util.js';

import STATUS_CODES from '../constants/statusCodes.constant.js';

export const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'Access token is required.'));
  }

  try {
    const payload = verifyAccessToken(accessToken);

    const user = await authRepository.findUserById(payload.id);

    if (!user) {
      return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'User not found.'));
    }

    req.user = user;
    req.id = user._id;

    next();
  } catch (error) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid or expired Access Token.'));
  }
};

export default authMiddleware;
