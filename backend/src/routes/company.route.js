import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.middleware.js";
import * as companyValidator from "../validators/company.validator.js";

const router = express.Router();

router.post("/register", authMiddleware, validate(companyValidator.validateRegisterCompany), registerCompany);

router.get("/get", authMiddleware, getCompany);

router.get("/get/:id", authMiddleware, validateObjectId('id'), getCompanyById);

router.put("/update/:id", authMiddleware, validateObjectId('id'), singleUpload, updateCompany);

export default router;
