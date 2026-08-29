import { USER_ROLES } from '../constants/roles.constant.js';
import ApiError from '../utils/ApiError.util.js';
import STATUS_CODES from '../constants/statusCodes.constant.js';

export const recruiterMiddleware = (req, res, next) => {
  if (req.user.role !== USER_ROLES.RECRUITER) {
    return next(new ApiError(STATUS_CODES.FORBIDDEN, 'Access denied. Recruiter only.'));
  }
  next();
};

export default recruiterMiddleware;
