import ApiError from "../utils/ApiError.js";
import STATUS_CODES from "../constants/statusCodes.js";

export const validateCreateJob = (body) => {
  const { title, description, requirements, salary, location, jobType, experience, position, companyId } = body;
  if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Somethin is missing.");
  }
};
