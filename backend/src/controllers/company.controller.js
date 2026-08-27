import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as companyValidator from "../validators/company.validator.js";
import * as companyService from "../services/company.service.js";
import STATUS_CODES from "../constants/statusCodes.js";

export const registerCompany = asyncHandler(async (req, res) => {
    companyValidator.validateRegisterCompany(req.body);

    const company = await companyService.registerCompany({
        companyName: req.body.companyName,
        userId: req.id,
    });

    return new ApiResponse(res, STATUS_CODES.CREATED, "Company registered successfully.", { company });
});

export const getCompany = asyncHandler(async (req, res) => {
    const companies = await companyService.getCompanies(req.id);

    return new ApiResponse(res, STATUS_CODES.OK, undefined, { companies });
});

export const getCompanyById = asyncHandler(async (req, res) => {
    const company = await companyService.getCompanyById(req.params.id);

    return new ApiResponse(res, STATUS_CODES.OK, undefined, { company });
});

export const updateCompany = asyncHandler(async (req, res) => {
    const { name, description, website, location } = req.body;

    await companyService.updateCompany(req.params.id, { name, description, website, location }, req.file);

    return new ApiResponse(res, STATUS_CODES.OK, "Company information updated.", undefined);
});