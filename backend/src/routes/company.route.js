import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/")
  .get(authMiddleware, getCompany)
  .post(authMiddleware, registerCompany);
router.route("/:id").get(authMiddleware, getCompanyById);
router.route("/:id").put(authMiddleware, singleUpload, updateCompany);

export default router;
