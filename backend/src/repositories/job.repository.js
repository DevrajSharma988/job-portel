import { Job } from "../models/job.model.js";

export const createJob = async (jobData) => {
  return await Job.create(jobData);
};

export const findJobsByQuery = async (query) => {
  return await Job.find(query)
    .populate({ path: "company" })
    .sort({ createdAt: -1 });
};

export const findJobByIdWithApplications = async (jobId) => {
  return await Job.findById(jobId).populate({ path: "applications" });
};

export const findJobsByCreator = async (adminId) => {
  return await Job.find({ created_by: adminId }).populate({
    path: "company",
    createdAt: -1,
  });
};

export const findJobById = async (jobId) => {
  return await Job.findById(jobId);
};

export const deleteJobById = async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
};

export const deleteJobsByCompanyId = async (companyId) => {
  return await Job.deleteMany({ company: companyId });
};

export const findJobsByCompanyId = async (companyId) => {
  return await Job.find({ company: companyId });
};

export const updateJobById = async (jobId, updateData) => {
  return await Job.findByIdAndUpdate(jobId, updateData, { new: true });
};
