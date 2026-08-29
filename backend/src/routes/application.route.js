import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
import validate from "../middlewares/validate.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.middleware.js";
import * as applicationValidator from "../validators/application.validator.js";

const router = express.Router();

router.get("/get", authMiddleware, getAppliedJobs);

router.get("/apply/:id", authMiddleware, validateObjectId('id'), validate(applicationValidator.validateApplyJob, 'params'), applyJob);

router.get("/:id/applicants", authMiddleware, validateObjectId('id'), getApplicants);

router.post("/status/:id/update", authMiddleware, validateObjectId('id'), validate(applicationValidator.validateUpdateStatus), updateStatus);

export default router;
