import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { recruiterMiddleware } from "../middlewares/recruiter.middleware.js";
import { applicantMiddleware } from "../middlewares/applicant.middleware.js";
import { getRecruiterJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(authMiddleware, recruiterMiddleware, postJob);
router.route("/get").get(getAllJobs);
router.route("/getrecruiterjobs").get(authMiddleware, recruiterMiddleware, getRecruiterJobs);
router.route("/get/:id").get(getJobById);

export default router;
