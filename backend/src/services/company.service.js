import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";
import * as companyRepository from "../repositories/company.repository.js";
import * as jobRepository from "../repositories/job.repository.js";
import * as applicationRepository from "../repositories/application.repository.js";
import getDataUri from "../utils/datauri.util.js";
import cloudinary from "../config/cloudinary.config.js";

export const registerCompany = async ({ companyName, userId }) => {
  const existingCompanies = await companyRepository.findCompaniesByUserId(userId);
  if (existingCompanies && existingCompanies.length > 0) {
    throw new ApiError(STATUS_CODES.CONFLICT, "You have already registered a company.");
  }

  let company = await companyRepository.findCompanyByName(companyName);
  if (company) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "You can't register same company.");
  }

  company = await companyRepository.createCompany({ name: companyName, userId });
  return company;
};

export const getCompanies = async (userId) => {
  const companies = await companyRepository.findCompaniesByUserId(userId);
  return companies || [];
};

export const getCompanyById = async (companyId, userId) => {
  const company = await companyRepository.findCompanyById(companyId);
  if (!company) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Company not found.");
  }
  if (company.userId.toString() !== userId.toString()) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, "You do not have permission to access this company.");
  }
  return company;
};

export const updateCompany = async (companyId, updateData, file, userId) => {
  const companyToUpdate = await companyRepository.findCompanyById(companyId);
  if (!companyToUpdate) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Company not found.");
  }
  if (companyToUpdate.userId.toString() !== userId.toString()) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, "You do not have permission to update this company.");
  }

  let logo;
  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    logo = cloudResponse.secure_url;
  }

  const dataToUpdate = { ...updateData };
  delete dataToUpdate.name; // Company name immutability
  if (logo) dataToUpdate.logo = logo;

  const company = await companyRepository.updateCompanyById(companyId, dataToUpdate);

  return company;
};

export const deleteCompany = async (companyId, userId) => {
  const company = await companyRepository.findCompanyById(companyId);
  if (!company) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Company not found.");
  }
  if (company.userId.toString() !== userId.toString()) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, "You do not have permission to delete this company.");
  }

  const jobs = await jobRepository.findJobsByCompanyId(companyId);
  const jobIds = jobs.map(job => job._id);

  // Cascade delete applications for all jobs
  if (jobIds.length > 0) {
    await applicationRepository.deleteApplicationsByJobIds(jobIds);
  }

  // Cascade delete jobs
  await jobRepository.deleteJobsByCompanyId(companyId);

  // Delete company
  await companyRepository.deleteCompanyById(companyId);
};
