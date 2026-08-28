import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";

export const validateCreateJob = (body) => {
  const { title, description, requirements, salary, location, jobType, experience, position, companyId } = body;
  
  if (!title || !description || !requirements || salary === undefined || salary === "" || !location || !jobType || experience === undefined || experience === "" || position === undefined || position === "" || !companyId) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "All fields are required.");
  }

  if (isNaN(Number(salary))) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Salary must be a valid number.");
  }
  if (isNaN(Number(experience))) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Experience must be a valid number.");
  }
  if (isNaN(Number(position))) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Position must be a valid number.");
  }
};
