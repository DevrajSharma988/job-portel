import asyncHandler from "../utils/asyncHandler.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import * as jobValidator from "../validators/job.validator.js";
import * as jobService from "../services/job.service.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";

export const postJob = asyncHandler(async (req, res) => {
    jobValidator.validateCreateJob(req.body);
    const job = await jobService.createJob(req.body, req.id);

    return new ApiResponse(res, STATUS_CODES.CREATED, "New job created successfully.", { job });
});

export const getAllJobs = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword || "";
    
    const jobs = await jobService.getAllJobs(keyword);

    return new ApiResponse(res, STATUS_CODES.OK, undefined, { jobs });
});

export const getJobById = asyncHandler(async (req, res) => {
    const job = await jobService.getJobById(req.params.id);

    return new ApiResponse(res, STATUS_CODES.OK, undefined, { job });
});

export const getAdminJobs = asyncHandler(async (req, res) => {
    const jobs = await jobService.getAdminJobs(req.id);

    return new ApiResponse(res, STATUS_CODES.OK, undefined, { jobs });
});

export const updateJob = asyncHandler(async (req, res) => {
    jobValidator.validateCreateJob(req.body); // uses same validation
    const job = await jobService.updateJob(req.params.id, req.body, req.id);
    return new ApiResponse(res, STATUS_CODES.OK, "Job updated successfully.", { job });
});

export const deleteJob = asyncHandler(async (req, res) => {
    await jobService.deleteJob(req.params.id, req.id);
    return new ApiResponse(res, STATUS_CODES.OK, "Job deleted successfully.", undefined);
});

export const toggleSaveJob = asyncHandler(async (req, res) => {
    const result = await jobService.toggleSaveJob(req.params.id, req.id);
    return new ApiResponse(res, STATUS_CODES.OK, result.isSaved ? "Job saved successfully." : "Job unsaved successfully.", { user: result.user, isSaved: result.isSaved });
});

export const getSavedJobs = asyncHandler(async (req, res) => {
    const savedJobs = await jobService.getSavedJobs(req.id);
    return new ApiResponse(res, STATUS_CODES.OK, undefined, { savedJobs });
});
