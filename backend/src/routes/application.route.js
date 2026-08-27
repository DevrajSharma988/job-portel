import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { recruiterMiddleware } from "../middlewares/recruiter.middleware.js";
import { applicantMiddleware } from "../middlewares/applicant.middleware.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/apply/:id").get(authMiddleware, applicantMiddleware, applyJob);
router.route("/get").get(authMiddleware, applicantMiddleware, getAppliedJobs);
router.route("/:id/applicants").get(authMiddleware, recruiterMiddleware, getApplicants);
router.route("/status/:id/update").post(authMiddleware, recruiterMiddleware, updateStatus);
 

export default router;
