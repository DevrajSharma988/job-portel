import ApiError from "../utils/ApiError.js";
import STATUS_CODES from "../constants/statusCodes.js";

export const validateRegisterCompany = (body) => {
  const { companyName } = body;
  if (!companyName) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Company name is required.");
  }
};
