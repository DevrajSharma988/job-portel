import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { recruiterMiddleware } from "../middlewares/recruiter.middleware.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post(authMiddleware, recruiterMiddleware, registerCompany);
router.route("/get").get(authMiddleware, recruiterMiddleware, getCompany);
router.route("/get/:id").get(authMiddleware, recruiterMiddleware, getCompanyById);
router.route("/update/:id").put(authMiddleware, recruiterMiddleware, singleUpload, updateCompany);

export default router;
