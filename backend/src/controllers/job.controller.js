import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as jobValidator from "../validators/job.validator.js";
import * as jobService from "../services/job.service.js";
import STATUS_CODES from "../constants/statusCodes.js";

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