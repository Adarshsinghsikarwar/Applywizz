import express from "express";
import {
  searchJobs,
  getFilterOptions,
  getJobById,
} from "../controllers/job.controller.js";
import validate from "../middlewares/validate.js";
import {
  searchJobsValidator,
  jobIdParamValidator,
} from "../validators/job.validator.js";

const router = express.Router();

// GET /api/jobs?search=&department=&page=&limit=&sortBy=&sortOrder=
router.get("/", searchJobsValidator, validate, searchJobs);

// GET /api/jobs/filters/options
router.get("/filters/options", getFilterOptions);

// GET /api/jobs/:id
router.get("/:id", jobIdParamValidator, validate, getJobById);

export default router;
