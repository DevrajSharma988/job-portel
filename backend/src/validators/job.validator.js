import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";

export const validateCreateJob = (body) => {
  const { title, description, requirements, location, employmentType, workMode, jobType, experienceLevel, position, companyId } = body;
  
  if (!title) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Job Title is missing.");
  if (!description) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Description is missing.");
  if (!requirements) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Requirements are missing.");
  if (!location || (Array.isArray(location) && location.length === 0)) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Location is missing.");
  if (!employmentType) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Employment Type is missing.");
  if (!workMode) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Work Mode is missing.");
  if (!jobType) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Job Type is missing.");
  if (!experienceLevel) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Experience Level is missing.");
  if (position === undefined || position === "") throw new ApiError(STATUS_CODES.BAD_REQUEST, "Position is missing.");
  if (!companyId) throw new ApiError(STATUS_CODES.BAD_REQUEST, "Company is missing. Please register a company first.");

  if (isNaN(Number(position))) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Position must be a valid number.");
  }
};
