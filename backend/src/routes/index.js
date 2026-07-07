import express from "express";
import jobRoutes from "./job.routes.js";
import duplicateRoutes from "./duplicate.routes.js";
import analyticsRoutes from "./analytics.routes.js";

const router = express.Router();

router.use("/jobs", jobRoutes);
router.use("/duplicates", duplicateRoutes);
router.use("/analytics", analyticsRoutes);

router.get("/health", (req, res) =>
  res.status(200).json({ success: true, message: "OK" })
);


export default router;