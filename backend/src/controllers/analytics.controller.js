import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import analyticsService from "../services/analytics.service.js";

const getDashboardMetrics = asyncHandler(async (req, res) => {
  const metrics = await analyticsService.getDashboardMetrics();
  res
    .status(200)
    .json(
      new ApiResponse(200, metrics, "Dashboard metrics fetched successfully")
    );
});

export { getDashboardMetrics };
