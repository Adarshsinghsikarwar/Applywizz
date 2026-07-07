import express from "express";
import {
  listDuplicateGroups,
  reviewJob,
  runDetection,
} from "../controllers/duplicate.controller.js";
import validate from "../middlewares/validate.js";
import { reviewJobValidator } from "../validators/job.validator.js";

const router = express.Router();

// GET /api/duplicates?status=&page=&limit=
router.get("/", listDuplicateGroups);

// PATCH /api/duplicates/:jobId/review   body: { status }
router.patch("/:jobId/review", reviewJobValidator, validate, reviewJob);

// POST /api/duplicates/detect  (re-runs detection across the whole collection)
router.post("/detect", runDetection);

export default router;
