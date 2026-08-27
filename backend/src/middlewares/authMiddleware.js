import * as authRepository from '../repositories/auth.repository.js';
import { verifyAccessToken } from '../services/auth/tokenService.js';
import ApiError from '../utils/ApiError.js';
import STATUS_CODES from '../constants/statusCodes.js';

const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'Access token is required.'));
  }

  const payload = verifyAccessToken(accessToken);

  const user = await authRepository.findUserById(payload.id);

  if (!user) {
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'User not found.'));
  }

  req.user = user;

  next();
};

export default authMiddleware;
