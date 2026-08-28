import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";
import validate from "../middlewares/validate.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.middleware.js";
import * as jobValidator from "../validators/job.validator.js";

const router = express.Router();

router.post("/post", authMiddleware, validate(jobValidator.validateCreateJob), postJob);

router.get("/get", getAllJobs);

router.get("/getrecruiterjobs", authMiddleware, getAdminJobs);

router.get("/get/:id", validateObjectId('id'), getJobById);

export default router;
