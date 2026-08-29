import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";
import * as applicationRepository from "../repositories/application.repository.js";

export const applyJob = async (userId, jobId) => {
  const existingApplication = await applicationRepository.findApplicationByJobAndApplicant(jobId, userId);
  if (existingApplication) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "You have already applied for this jobs");
  }

  const job = await applicationRepository.findJobById(jobId);
  if (!job) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Job not found");
  }

  const newApplication = await applicationRepository.createApplication({
    job: jobId,
    applicant: userId,
  });

  job.applications.push(newApplication._id);
  await job.save();
};

export const getAppliedJobs = async (userId) => {
  const application = await applicationRepository.findApplicationsByApplicant(userId);
  return application || [];
};

export const getApplicants = async (jobId) => {
  const job = await applicationRepository.findJobWithApplicants(jobId);
  if (!job) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Job not found.");
  }
  return job;
};

export const updateStatus = async (applicationId, status) => {
  const application = await applicationRepository.findApplicationById(applicationId);
  if (!application) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Application not found.");
  }

  application.status = status.toLowerCase();
  await application.save();
};
