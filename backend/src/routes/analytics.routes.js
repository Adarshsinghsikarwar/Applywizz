import express from "express";
import { getDashboardMetrics } from "../controllers/analytics.controller.js";

const router = express.Router();

// GET /api/analytics/dashboard
router.get("/dashboard", getDashboardMetrics);

export default router;
