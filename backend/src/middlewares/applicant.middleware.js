import { USER_ROLES } from '../constants/roles.constant.js';
import ApiError from '../utils/ApiError.util.js';
import STATUS_CODES from '../constants/statusCodes.constant.js';

export const applicantMiddleware = (req, res, next) => {
  if (req.user.role !== USER_ROLES.APPLICANT) {
    return next(new ApiError(STATUS_CODES.FORBIDDEN, 'Access denied. Applicant only.'));
  }
  next();
};

export default applicantMiddleware;
