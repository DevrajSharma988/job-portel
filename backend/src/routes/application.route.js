import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

// 1. Get all applications for current user
router.route("/").get(authMiddleware, getAppliedJobs);

// 2. Apply for a job (Requires POST, creates application)
// 3. Get all applications for a specific job (Admin view)
router.route("/job/:id")
  .post(authMiddleware, applyJob)
  .get(authMiddleware, getApplicants);

// 4. Update the status of a specific application
router.route("/:id/status").patch(authMiddleware, updateStatus);


export default router;
