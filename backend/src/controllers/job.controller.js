import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import jobService from "../services/job.service.js";

const searchJobs = asyncHandler(async (req, res) => {
  const result = await jobService.searchJobs(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, result, "Jobs fetched successfully"));
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  res.status(200).json(new ApiResponse(200, job, "Job fetched successfully"));
});

const getFilterOptions = asyncHandler(async (req, res) => {
  const options = await jobService.getFilterOptions();
  res
    .status(200)
    .json(new ApiResponse(200, options, "Filter options fetched successfully"));
});

export { searchJobs, getJobById, getFilterOptions };
