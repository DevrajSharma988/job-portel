import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";

export const validateApplyJob = (params) => {
  const { id } = params;
  if (!id) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Job id is required.");
  }
};

export const validateUpdateStatus = (body) => {
  const { status } = body;
  if (!status) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "status is required");
  }
};
