import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const findApplicationByJobAndApplicant = async (jobId, userId) => {
  return await Application.findOne({ job: jobId, applicant: userId });
};

export const createApplication = async ({ job, applicant }) => {
  return await Application.create({ job, applicant });
};

export const findApplicationsByApplicant = async (userId) => {
  return await Application.find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "job",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "company",
        options: { sort: { createdAt: -1 } },
      },
    });
};

export const findJobWithApplicants = async (jobId) => {
  return await Job.findById(jobId).populate({
    path: "applications",
    options: { sort: { createdAt: -1 } },
    populate: {
      path: "applicant",
    },
  });
};

export const findApplicationById = async (applicationId) => {
  return await Application.findOne({ _id: applicationId });
};

export const findJobById = async (jobId) => {
  return await Job.findById(jobId);
};

export const deleteApplicationsByJobId = async (jobId) => {
  return await Application.deleteMany({ job: jobId });
};

export const deleteApplicationsByJobIds = async (jobIds) => {
  return await Application.deleteMany({ job: { $in: jobIds } });
};

export const countApplicationsByJobId = async (jobId) => {
  return await Application.countDocuments({ job: jobId });
};
