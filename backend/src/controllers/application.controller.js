import asyncHandler from "../utils/asyncHandler.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import * as applicationValidator from "../validators/application.validator.js";
import * as applicationService from "../services/application.service.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";

export const applyJob = asyncHandler(async (req, res) => {
    applicationValidator.validateApplyJob(req.params);

    await applicationService.applyJob(req.id, req.params.id);

    return new ApiResponse(res, STATUS_CODES.CREATED, "Job applied successfully.", undefined);
});

export const getAppliedJobs = asyncHandler(async (req, res) => {
    const application = await applicationService.getAppliedJobs(req.id);

    return new ApiResponse(res, STATUS_CODES.OK, undefined, { application });
});

export const getApplicants = asyncHandler(async (req, res) => {
    const job = await applicationService.getApplicants(req.params.id);

    return new ApiResponse(res, STATUS_CODES.OK, undefined, { job });
});

export const updateStatus = asyncHandler(async (req, res) => {
    applicationValidator.validateUpdateStatus(req.body);

    await applicationService.updateStatus(req.params.id, req.body.status);

    return new ApiResponse(res, STATUS_CODES.OK, "Status updated successfully.", undefined);
});
