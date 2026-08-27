import { Company } from "../models/company.model.js";

export const findCompanyByName = async (name) => {
  return await Company.findOne({ name });
};

export const createCompany = async ({ name, userId }) => {
  return await Company.create({ name, userId });
};

export const findCompaniesByUserId = async (userId) => {
  return await Company.find({ userId });
};

export const findCompanyById = async (companyId) => {
  return await Company.findById(companyId);
};

export const updateCompanyById = async (companyId, updateData) => {
  return await Company.findByIdAndUpdate(companyId, updateData, { new: true });
};
