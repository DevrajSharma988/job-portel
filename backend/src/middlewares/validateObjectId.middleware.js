import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.util.js';
import STATUS_CODES from '../constants/statusCodes.constant.js';

export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(STATUS_CODES.BAD_REQUEST, `Invalid ${paramName} format. Must be a valid MongoDB ObjectId.`));
    }
    next();
  };
};

export default validateObjectId;
