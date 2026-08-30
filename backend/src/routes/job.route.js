import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob, deleteJob, toggleSaveJob, getSavedJobs } from "../controllers/job.controller.js";
import validate from "../middlewares/validate.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.middleware.js";
import * as jobValidator from "../validators/job.validator.js";

const router = express.Router();

router.post("/post", authMiddleware, validate(jobValidator.validateCreateJob), postJob);

router.get("/get", getAllJobs);

router.get("/getrecruiterjobs", authMiddleware, getAdminJobs);

router.get("/saved", authMiddleware, getSavedJobs);

router.get("/get/:id", validateObjectId('id'), getJobById);

router.post("/save/:id", authMiddleware, validateObjectId('id'), toggleSaveJob);

router.put("/update/:id", authMiddleware, validateObjectId('id'), validate(jobValidator.validateCreateJob), updateJob);

router.delete("/delete/:id", authMiddleware, validateObjectId('id'), deleteJob);

export default router;
