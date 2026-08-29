import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";
import * as jobRepository from "../repositories/job.repository.js";
import * as companyRepository from "../repositories/company.repository.js";
import * as applicationRepository from "../repositories/application.repository.js";

export const createJob = async (jobData, userId) => {
  const { title, description, requirements, salary, location, employmentType, workMode, experience, position, companyId } = jobData;
  
  const company = await companyRepository.findCompanyById(companyId);
  if (!company) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Company not found.");
  }
  if (company.userId.toString() !== userId.toString()) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, "You do not have permission to post a job for this company.");
  }

  const job = await jobRepository.createJob({
    title,
    description,
    requirements: requirements.split(","),
    salary: Number(salary),
    location,
    employmentType,
    workMode,
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
  return jobs || [];
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
  return jobs || [];
};

export const deleteJob = async (jobId, userId) => {
  const job = await jobRepository.findJobById(jobId);
  if (!job) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Job not found.");
  }
  if (job.created_by.toString() !== userId.toString()) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, "You do not have permission to delete this job.");
  }

  // Delete applications for this job
  await applicationRepository.deleteApplicationsByJobId(jobId);

  // Delete job
  await jobRepository.deleteJobById(jobId);
};

export const updateJob = async (jobId, jobData, userId) => {
  const job = await jobRepository.findJobById(jobId);
  if (!job) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Job not found.");
  }
  if (job.created_by.toString() !== userId.toString()) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, "You do not have permission to edit this job.");
  }

  // Check application count
  const applicationCount = await applicationRepository.countApplicationsByJobId(jobId);
  if (applicationCount > 0) {
    throw new ApiError(STATUS_CODES.CONFLICT, "This job cannot be edited because candidates have already applied.");
  }

  const { title, description, requirements, salary, location, employmentType, workMode, experience, position } = jobData;

  const updatedJob = await jobRepository.updateJobById(jobId, {
    title,
    description,
    requirements: Array.isArray(requirements) ? requirements : requirements.split(","),
    salary: Number(salary),
    location,
    employmentType,
    workMode,
    experienceLevel: experience,
    position
  });

  return updatedJob;
};
