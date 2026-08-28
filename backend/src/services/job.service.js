import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";
import * as jobRepository from "../repositories/job.repository.js";

export const createJob = async (jobData, userId) => {
  const { title, description, requirements, salary, location, jobType, experience, position, companyId } = jobData;
  
  const job = await jobRepository.createJob({
    title,
    description,
    requirements: requirements.split(","),
    salary: Number(salary),
    location,
    jobType,
    experienceLevel: experience,
    position,
    company: companyId,
    created_by: userId,
  });

  return job;
};

export const getAllJobs = async (keyword) => {
  const query = keyword
    ? {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }
    : {};

  const jobs = await jobRepository.findJobsByQuery(query);
  if (!jobs || jobs.length === 0) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Jobs not found.");
  }
  return jobs;
};

export const getJobById = async (jobId) => {
  const job = await jobRepository.findJobByIdWithApplications(jobId);
  if (!job) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Jobs not found.");
  }
  return job;
};

export const getAdminJobs = async (adminId) => {
  const jobs = await jobRepository.findJobsByCreator(adminId);
  if (!jobs || jobs.length === 0) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Jobs not found.");
  }
  return jobs;
};
