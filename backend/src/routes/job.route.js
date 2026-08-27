import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();


router.route("/")
.get(authMiddleware, getAllJobs)
.post(authMiddleware, postJob);

router.route("/admin").get(authMiddleware, getAdminJobs);
router.route("/:id").get(authMiddleware, getJobById);

export default router;
