import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";

export const validateRegisterCompany = (body) => {
  const { companyName } = body;
  if (!companyName) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Company name is required.");
  }
};
