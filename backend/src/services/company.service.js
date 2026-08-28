import ApiError from "../utils/ApiError.util.js";
import STATUS_CODES from "../constants/statusCodes.constant.js";
import * as companyRepository from "../repositories/company.repository.js";
import getDataUri from "../utils/datauri.util.js";
import cloudinary from "../config/cloudinary.config.js";

export const registerCompany = async ({ companyName, userId }) => {
  let company = await companyRepository.findCompanyByName(companyName);
  if (company) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "You can't register same company.");
  }

  company = await companyRepository.createCompany({ name: companyName, userId });
  return company;
};

export const getCompanies = async (userId) => {
  const companies = await companyRepository.findCompaniesByUserId(userId);
  if (!companies || companies.length === 0) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Companies not found.");
  }
  return companies;
};

export const getCompanyById = async (companyId) => {
  const company = await companyRepository.findCompanyById(companyId);
  if (!company) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Company not found.");
  }
  return company;
};

export const updateCompany = async (companyId, updateData, file) => {
  let logo;
  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    logo = cloudResponse.secure_url;
  }

  const dataToUpdate = { ...updateData };
  if (logo) dataToUpdate.logo = logo;

  const company = await companyRepository.updateCompanyById(companyId, dataToUpdate);

  if (!company) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Company not found.");
  }

  return company;
};
